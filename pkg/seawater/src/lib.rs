//! Implementation of the seawater AMM
//!
//! Seawater is an AMM designed for arbitrum's stylus environment based on uniswap v3.

#![deny(clippy::unwrap_used)]

pub mod immutables;
#[macro_use]
pub mod error;
pub mod events;

pub mod maths;
pub mod pool;
pub mod position;
pub mod tick;
pub mod types;

#[cfg(feature = "testing")]
pub mod vm_hooks;

#[cfg(feature = "testing")]
pub mod test_utils;

// Permit2 types exposed by the erc20 file.
pub mod permit2_types;

// We only want to have testing on the host environment and mocking stuff
// out in a testing context
#[cfg(feature = "testing")]
pub mod host_erc20;

#[cfg(not(feature = "testing"))]
pub mod wasm_erc20;

pub mod erc20;

use crate::{
    erc20::Permit2Args,
    types::{Address, I256Extension, I256, U256},
};

use error::Error;
use immutables::FUSDC_ADDR;
use maths::tick_math;

use types::{U256Extension, WrappedNative};

use stylus_sdk::{msg, prelude::*, storage::*};

use stylus_sdk::evm;

#[allow(dead_code)]
type RawArbResult = Option<Result<Vec<u8>, Vec<u8>>>;

// aliased for simplicity
type Revert = Vec<u8>;

extern crate alloc;

#[link(wasm_import_module = "stylus_test_runner")]
extern "C" {
    #[allow(dead_code)]
    fn wasm_log_ext(ptr: *const u8, len: usize);
}

#[macro_export]
macro_rules! wasm_log {
    ($($arg:tt)*) => {
        #[cfg(all(feature = "testing-dbg", target_arch = "wasm32"))]
        unsafe {
            let msg = format!($($arg)*);
            wasm_log_ext(msg.as_ptr(), msg.len())
        }
    }
}

// we split our entrypoint functions into three sets, and call them via diamond proxies, to
// save on binary size
#[cfg(not(any(
    feature = "swaps",
    feature = "swap_permit2_a",
    feature = "quotes",
    feature = "positions",
    feature = "update_positions",
    feature = "admin",
    feature = "migrations",
    feature = "adjust_positions",
    feature = "swap_permit2_b"
)))]
mod shim {
    #[cfg(all(not(target_arch = "wasm32"), not(feature = "testing")))]
    compile_error!(
        "Either `swaps` or `swap_permit2_a` or `quotes` or `positions` or `update_positions`, `admin`, `migrations`, `adjust_positions` or `swap_permit2_b` must be enabled when building for wasm."
    );
    #[stylus_sdk::prelude::public]
    impl crate::Pools {}
}

/// The root of seawater's storage. Stores variables needed globally, as well as the map of AMM
/// pools.
#[storage]
#[entrypoint]
pub struct Pools {
    // admin that can control the settings of everything. either the DAO, or the
    pub seawater_admin: StorageAddress,
    // the nft manager is a privileged account that can transfer NFTs!
    nft_manager: StorageAddress,

    pub pools: StorageMap<Address, pool::StoragePool>,
    // position NFTs
    pub next_position_id: StorageU256,
    // ID => owner
    position_owners: StorageMap<U256, StorageAddress>,
    // owner => count
    owned_positions: StorageMap<Address, StorageU256>,

    // address that's able to activate and disable emergency mode functionality
    emergency_council: StorageAddress,

    // authorised enablers to create new pools, and enable them
    authorised_enablers: StorageMap<Address, StorageBool>,
}

impl Pools {
    /// Raw swap function, implementing the uniswap v3 interface.
    ///
    /// This function is called by [Self::swap] and `swap_permit2`, which do
    /// argument decoding.
    ///
    /// # Arguments
    /// * `pool` - The pool to swap for. Pools are accessed as the address of their first token,
    ///            where every pool has the fluid token as token 1.
    /// * `zero_for_one` - The swap direction. This is `true` if swapping to the fluid token, or
    ///                    `false` if swapping from the fluid token.
    /// * `amount` - The amount of token to swap. Follows the uniswap convention, where a positive
    ///              amount will perform an exact in swap and a negative amount will perform an
    ///              exact out swap.
    /// * `price_limit_x96` - The price limit, specified as an X96 encoded square root price.
    /// * `permit2` - Optional permit2 blob for the token being transfered - transfers will be done
    ///               using permit2 if this is `Some`, or `transferFrom` if this is `None`.
    ///
    /// # Side effects
    /// This function transfers ERC20 tokens from and to the caller as per the swap. It takes
    /// tokens using ERC20's `transferFrom` method, and therefore must have approvals set before
    /// use.
    pub fn swap_internal(
        pools: &mut Pools,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit_x96: U256,
        permit2: Option<Permit2Args>,
    ) -> Result<(I256, I256), Revert> {
        assert_or!(!amount.is_zero(), Error::SwapIsZero);

        let (amount_0, amount_1, _ending_tick) =
            pools
                .pools
                .setter(pool)
                .swap(zero_for_one, amount, price_limit_x96)?;

        // entirely reentrant safe because stylus
        // denies all reentrancy unless explicity allowed (which we don't)

        // if zero_for_one, send them token1 and take token0
        let (take_token, take_amount, give_token, give_amount) = match zero_for_one {
            true => (pool, amount_0, FUSDC_ADDR, amount_1),
            false => (FUSDC_ADDR, amount_1, pool, amount_0),
        };

        erc20::take(take_token, take_amount.abs_pos()?, permit2)?;
        erc20::transfer_to_sender(give_token, give_amount.abs_neg()?)?;

        let amount_0_abs = amount_0
            .checked_abs()
            .ok_or(Error::SwapResultTooHigh)?
            .into_raw();
        let amount_1_abs = amount_1
            .checked_abs()
            .ok_or(Error::SwapResultTooHigh)?
            .into_raw();

        assert_or!(
            amount_0_abs > U256::zero() || amount_1_abs > U256::zero(),
            Error::SwapResultTooLow
        );

        evm::log(events::Swap1 {
            user: msg::sender(),
            pool,
            zeroForOne: zero_for_one,
            amount0: amount_0_abs,
            amount1: amount_1_abs,
            finalTick: _ending_tick,
        });

        Ok((amount_0, amount_1))
    }

    /// Performs a two step swap internally, without performing any ERC20 transfers.
    fn swap_2_internal(
        pools: &mut Pools,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<(U256, U256, U256, I256, i32, i32), Revert> {
        assert_or!(from != to, Error::SamePool);
        assert_or!(!amount.is_zero(), Error::SwapIsZero);

        let original_amount = amount;

        let amount = I256::try_from(amount).map_err(|_| Error::SwapResultTooHigh)?;

        // swap in -> usdc
        let (amount_in, interim_usdc_out, final_tick_in) = pools.pools.setter(from).swap(
            true,
            amount,
            // swap with no price limit, since we use min_out instead
            tick_math::MIN_SQRT_RATIO + U256::one(),
        )?;

        // make this positive for exact in
        let interim_usdc_out = interim_usdc_out
            .checked_neg()
            .ok_or(Error::InterimSwapPositive)?;

        // swap usdc -> out
        let (amount_out, _interim_usdc_in, final_tick_out) = pools.pools.setter(to).swap(
            false,
            interim_usdc_out,
            tick_math::MAX_SQRT_RATIO - U256::one(),
        )?;

        let amount_in = amount_in.abs_pos()?;
        let amount_out = amount_out.abs_neg()?;

        assert_or!(amount_out >= min_out, Error::MinOutNotReached);

        Ok((
            original_amount,
            amount_in,
            amount_out,
            interim_usdc_out,
            final_tick_in,
            final_tick_out,
        ))
    }

    /// Performs a two step swap, taking a permit2 blob for transfers.
    ///
    /// This function is called by [Self::swap_2] and `swap_2_permit2`, which do
    /// argument decoding.
    /// See [Self::swap] for more details on how this operates.
    pub fn swap_2_internal_erc20(
        pools: &mut Pools,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
        permit2: Option<Permit2Args>,
    ) -> Result<(U256, U256), Revert> {
        #[cfg(feature = "testing-dbg")]
        dbg!((
            "swap 2 internal erc20 at start",
            amount.to_string(),
            min_out.to_string()
        ));

        let (
            original_amount,
            amount_in,
            amount_out,
            _interim_usdc_out,
            _final_tick_in,
            _final_tick_out,
        ) = Self::swap_2_internal(pools, from, to, amount, min_out)?;

        #[cfg(feature = "testing-dbg")]
        dbg!((
            "swap 2 internal erc20 after internal",
            amount_in.to_string(),
            amount_out.to_string()
        ));

        // transfer tokens
        erc20::take(from, amount_in, permit2)?;
        erc20::transfer_to_sender(to, amount_out)?;

        if original_amount > amount_in {
            erc20::transfer_to_sender(
                to,
                original_amount
                    .checked_sub(amount_in)
                    .ok_or(Error::TransferToSenderSub)?,
            )?;
        }

        evm::log(events::Swap2 {
            user: msg::sender(),
            from,
            to,
            amountIn: amount_in,
            amountOut: amount_out,
            fluidVolume: _interim_usdc_out.abs().into_raw(),
            finalTick0: _final_tick_in,
            finalTick1: _final_tick_out,
        });

        // return amount - amount_in to the user
        // send amount_out to the user
        Ok((amount_in, amount_out))
    }
}

/// Swap functions. Only enabled when the `swaps` feature is set.
/// Functions here are dispatched into by when the proxy
/// sees the EXECUTOR_SWAP_DISPATCH magic byte in
/// its fallback function.
#[cfg_attr(feature = "swaps", public)]
impl Pools {
    #[allow(non_snake_case)]
    pub fn swap_904369_B_E(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit_x96: U256,
    ) -> Result<(I256, I256), Revert> {
        Pools::swap_internal(self, pool, zero_for_one, amount, price_limit_x96, None)
    }

    /// Performs a two stage swap, using approvals to transfer tokens. See [Self::swap_2_internal].
    #[allow(non_snake_case)]
    pub fn swap_2_exact_in_41203_F1_D(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<(U256, U256), Revert> {
        Pools::swap_2_internal_erc20(self, from, to, amount, min_out, None)
    }
}

/// Quote functions. Only enabled when the `quotes` feature is set.
/// Functions here are dispatched into by when the proxy
/// sees the EXECUTOR_QUOTES_DISPATCH magic byte in
/// its fallback function.
#[cfg_attr(feature = "quotes", public)]
impl Pools {
    /// Quote a [Self::swap]. Will revert with the result of the swap
    /// as a decimal number as the message of an `Error(string)`.
    /// Returns a `Result` as Stylus expects but will always only fill the `Revert`.
    #[allow(non_snake_case)]
    pub fn quote_72_E2_A_D_E7(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit_x96: U256,
    ) -> Result<(), Revert> {
        let swapped = self
            .pools
            .setter(pool)
            .swap(zero_for_one, amount, price_limit_x96);

        match swapped {
            Ok((amount_0, amount_1, _)) => {
                // if zero_for_one, send them token1 and take token0
                let (give_token, give_amount) = match zero_for_one {
                    true => (FUSDC_ADDR, amount_1),
                    false => (pool, amount_0),
                };

                erc20::transfer_to_sender(give_token, give_amount.abs_neg()?)?;

                // we always want the token that was taken from the pool, so it's always negative
                let quote_amount = if zero_for_one { -amount_1 } else { -amount_0 };

                let revert = erc20::revert_from_msg(&quote_amount.to_dec_string());
                Err(revert)
            }
            // actual error, return it as normal
            Err(e) => Err(e),
        }
    }

    /// Quote a [Self::swap_2_exact_ine4f82465]. Will revert with the result of the swap
    /// as a decimal number as the message of an `Error(string)`.
    /// Returns a `Result` as Stylus expects but will always only fill the `Revert`.
    #[allow(non_snake_case)]
    pub fn quote_2_C_D06_B86_E(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<(), Revert> {
        let swapped = Pools::swap_2_internal(self, from, to, amount, min_out);

        match swapped {
            Ok((_, _, amount_out, _, _, _)) => {
                erc20::transfer_to_sender(to, amount_out)?;
                let revert = erc20::revert_from_msg(&amount_out.to_string());
                Err(revert)
            }
            // actual error, return it as normal
            Err(e) => Err(e),
        }
    }
}

/// Some swap functions using Permit2. Only enabled when the `swap_permit2_a` feature is
/// set. Functions here are dispatched into by when the proxy
/// sees the EXECUTOR_SWAP_PERMIT2_A_DISPATCH magic byte in
/// its fallback function.
#[cfg_attr(feature = "swap_permit2_a", public)]
impl Pools {
    #[allow(non_snake_case)]
    pub fn swap_permit_2_E_E84_A_D91(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit_x96: U256,
        nonce: U256,
        deadline: U256,
        max_amount: U256,
        sig: Vec<u8>,
    ) -> Result<(I256, I256), Revert> {
        let permit2_args = Permit2Args {
            max_amount,
            nonce,
            deadline,
            sig: &sig,
        };

        Pools::swap_internal(
            self,
            pool,
            zero_for_one,
            amount,
            price_limit_x96,
            Some(permit2_args),
        )
    }
}

/// Internal functions for position management.
impl Pools {
    /// Makes the user the owner of a position. The position must not have an owner.
    fn grant_position(&mut self, owner: Address, id: U256) {
        // set owner
        self.position_owners.setter(id).set(owner);

        // increment count
        let owned_positions_count = self.owned_positions.get(owner) + U256::one();
        self.owned_positions
            .setter(owner)
            .set(owned_positions_count);
    }

    /// Removes the user as the owner of a position. The position must have an owner.
    fn remove_position(&mut self, owner: Address, id: U256) {
        // remove owner
        self.position_owners.setter(id).erase();

        // decrement count
        let owned_positions_count = self.owned_positions.get(owner) - U256::one();
        self.owned_positions
            .setter(owner)
            .set(owned_positions_count);
    }
}

/// Position management functions. Only enabled when the `positions` feature is set.
/// Functions here are dispatched into by when the proxy
/// sees the EXECUTOR_POSITION_DISPATCH magic byte in
/// its fallback function.
#[cfg_attr(feature = "positions", public)]
impl Pools {
    /// Creates a new, empty position, owned by a user.
    ///
    /// # Errors
    /// Requires the pool to exist and be enabled.
    #[allow(non_snake_case)]
    pub fn mint_position_B_C5_B086_D(
        &mut self,
        pool: Address,
        lower: i32,
        upper: i32,
    ) -> Result<U256, Revert> {
        let id = self.next_position_id.get();
        self.pools.setter(pool).create_position(id, lower, upper)?;

        self.next_position_id.set(id + U256::one());

        let owner = msg::sender();

        self.grant_position(owner, id);

        evm::log(events::MintPosition {
            id,
            owner,
            pool,
            lower,
            upper,
        });

        Ok(id)
    }

    /// Transfers a position's ownership from one address to another. Only usable by the NFT
    /// manager account.
    ///
    /// # Errors
    /// Requires the caller be the NFT manager.
    #[allow(non_snake_case)]
    pub fn transfer_position_E_E_C7_A3_C_D(
        &mut self,
        id: U256,
        from: Address,
        to: Address,
    ) -> Result<(), Revert> {
        assert_eq_or!(msg::sender(), self.nft_manager.get(), Error::NftManagerOnly);
        assert_eq_or!(
            self.position_owners.getter(id).get(),
            from,
            Error::PositionOwnerOnly
        );

        self.remove_position(from, id);
        self.grant_position(to, id);

        evm::log(events::TransferPosition { from, to, id });

        Ok(())
    }

    /// Returns the current owner of a position.
    #[allow(non_snake_case)]
    pub fn position_owner_D7878480(&self, id: U256) -> Result<Address, Revert> {
        Ok(self.position_owners.get(id))
    }

    /// Returns the number of positions owned by an address.
    #[allow(non_snake_case)]
    pub fn position_balance_4_F32_C7_D_B(&self, user: Address) -> Result<U256, Revert> {
        Ok(self.owned_positions.get(user))
    }

    /// Returns the amount of liquidity in a position.
    #[allow(non_snake_case)]
    pub fn position_liquidity_8_D11_C045(&self, pool: Address, id: U256) -> Result<u128, Revert> {
        let liquidity = self.pools.getter(pool).get_position_liquidity(id);
        Ok(liquidity.sys())
    }

    #[allow(non_snake_case)]
    pub fn position_tick_lower_2_F_77_C_C_E_1(
        &self,
        pool: Address,
        id: U256,
    ) -> Result<i32, Revert> {
        let lower = self.pools.getter(pool).get_position_tick_lower(id);
        Ok(lower.sys())
    }

    #[allow(non_snake_case)]
    pub fn position_tick_upper_67_F_D_55_B_A(
        &self,
        pool: Address,
        id: U256,
    ) -> Result<i32, Revert> {
        let upper = self.pools.getter(pool).get_position_tick_upper(id);
        Ok(upper.sys())
    }

    #[allow(non_snake_case)]
    pub fn collect_single_to_6_D_76575_F(
        &mut self,
        pool: Address,
        id: U256,
        recipient: Address,
    ) -> Result<(u128, u128), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.position_owners.get(id),
            Error::PositionOwnerOnly
        );

        let res = self.pools.setter(pool).collect(id)?;
        let (token_0, token_1) = res;

        evm::log(events::CollectFees {
            id,
            pool,
            to: msg::sender(),
            amount0: token_0,
            amount1: token_1,
        });

        erc20::transfer_to_addr(pool, recipient, U256::from(token_0))?;
        erc20::transfer_to_addr(FUSDC_ADDR, recipient, U256::from(token_1))?;

        Ok(res)
    }

    /// Collects AMM fees from a position, and triggers a release of fluid LP rewards.
    /// Only usable by the position's owner.
    ///
    /// # Arguments
    /// * `pools` - The pool the position belongs to.
    /// * `ids` - The ID of the positions.
    ///
    /// # Side effects
    /// Transfers tokens to the caller, and triggers a release of fluid LP rewards.
    ///
    /// # Errors
    /// Requires the caller to be the position owner. Requires the pool to be enabled.
    /// Requires the length of the pools and ids to be equal.
    #[allow(non_snake_case)]
    pub fn collect_7_F21947_C(
        &mut self,
        pools: Vec<Address>,
        ids: Vec<U256>,
    ) -> Result<Vec<(u128, u128)>, Revert> {
        assert_eq!(ids.len(), pools.len());

        pools
            .iter()
            .zip(ids.iter())
            .map(|(&pool, &id)| self.collect_single_to_6_D_76575_F(pool, id, msg::sender()))
            .collect::<Result<Vec<(u128, u128)>, Revert>>()
    }
}

impl Pools {
    /// Refreshes the amount of liquidity in a position, and adds or removes liquidity. Only usable
    /// by the position's owner.
    ///
    /// # Arguments
    /// * `pool` - The pool the position belongs to.
    /// * `id` - The ID of the position.
    /// * `delta` - The change to apply to the liquidity in the position.
    /// * `permit2` - Optional permit2 blob for the token being transfered - transfers will be done
    ///               using permit2 if this is `Some`, or `transferFrom` if this is `None`.
    ///
    /// # Side effects
    /// Adding or removing liquidity will transfer tokens from or to the caller. Tokens are
    /// transfered with ERC20's `transferFrom`, so approvals must be set before calling.
    ///
    /// # Errors
    /// Requires token approvals to be set if adding liquidity. Requires the caller to be the
    /// position owner. Requires the pool to be enabled unless removing liquidity.
    pub fn update_position_internal(
        &mut self,
        pool_addr: Address,
        id: U256,
        delta: i128,
        permit2: Option<(Permit2Args, Permit2Args)>,
    ) -> Result<(I256, I256), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.position_owners.get(id),
            Error::PositionOwnerOnly
        );

        let mut pool = self.pools.setter(pool_addr);
        let (token_0, token_1) = pool.update_position(id, delta)?;

        if delta < 0 {
            // if we're sending to sender, make sure that the pool is initialised.
            assert_or!(pool.initialised.get(), Error::PoolDisabled);
            erc20::transfer_to_sender(pool_addr, token_0.abs_neg()?)?;
            erc20::transfer_to_sender(FUSDC_ADDR, token_1.abs_neg()?)?;
        } else {
            // if we're TAKING, make sure that the pool is enabled.
            assert_or!(pool.enabled.get(), Error::PoolDisabled);
            let (permit_0, permit_1) = match permit2 {
                Some((permit_0, permit_1)) => (Some(permit_0), Some(permit_1)),
                None => (None, None),
            };

            erc20::take(pool_addr, token_0.abs_pos()?, permit_0)?;
            erc20::take(FUSDC_ADDR, token_1.abs_pos()?, permit_1)?;
        }

        evm::log(events::UpdatePositionLiquidity {
            id,
            token0: token_0,
            token1: token_1,
        });

        Ok((token_0, token_1))
    }

    #[allow(clippy::too_many_arguments)]
    pub fn adjust_position_internal(
        &mut self,
        pool: Address,
        id: U256,
        amount_0_min: U256,
        amount_1_min: U256,
        amount_0_desired: U256,
        amount_1_desired: U256,
        permit2: Option<(Permit2Args, Permit2Args)>,
    ) -> Result<(U256, U256), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.position_owners.get(id),
            Error::PositionOwnerOnly
        );

        let (amount_0, amount_1) =
            self.pools
                .setter(pool)
                .adjust_position(id, amount_0_desired, amount_1_desired)?;

        evm::log(events::UpdatePositionLiquidity {
            id,
            token0: amount_0,
            token1: amount_1,
        });

        let (amount_0, amount_1) = (amount_0.abs_pos()?, amount_1.abs_pos()?);

        assert_or!(amount_0 >= amount_0_min, Error::LiqResultTooLow);
        assert_or!(amount_1 >= amount_1_min, Error::LiqResultTooLow);

        let (permit_0, permit_1) = match permit2 {
            Some((permit_0, permit_1)) => (Some(permit_0), Some(permit_1)),
            None => (None, None),
        };

        erc20::take(pool, amount_0, permit_0)?;
        erc20::take(FUSDC_ADDR, amount_1, permit_1)?;

        Ok((amount_0, amount_1))
    }
}

#[cfg_attr(feature = "update_positions", public)]
impl Pools {
    /// Refreshes and updates liquidity in a position, using approvals to transfer tokens.
    /// See [Self::update_position_internal].
    #[allow(non_snake_case)]
    pub fn update_position_C_7_F_1_F_740(
        &mut self,
        pool: Address,
        id: U256,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        self.update_position_internal(pool, id, delta, None)
    }
}

/// Admin functions. Only enabled when the `admin` feature is set.
/// Functions for adjusting positions using in-contract calculation of
/// certain values. Functions here are dispatched into by when the proxy
/// sees the EXECUTOR_ADMIN_DISPATCH magic byte in
/// its fallback function.
#[cfg_attr(feature = "admin", public)]
impl Pools {
    /// The initialiser function for the seawater contract. Should be called in the proxy's
    /// constructor.
    ///
    ///  # Errors
    ///  Requires the contract to not be initialised.
    pub fn ctor(
        &mut self,
        seawater_admin: Address,
        nft_manager: Address,
        emergency_council: Address,
    ) -> Result<(), Revert> {
        assert_eq_or!(
            self.seawater_admin.get(),
            Address::ZERO,
            Error::ContractAlreadyInitialised
        );

        self.seawater_admin.set(seawater_admin);
        self.nft_manager.set(nft_manager);
        self.emergency_council.set(emergency_council);

        Ok(())
    }

    /// Creates a new pool.
    ///
    /// # Arguments
    /// * `pool` - The address of the non-fluid token to construct the pool around.
    /// * `price` - The initial price for the pool, as an X96 encoded square root price.
    /// * `fee` - The fee for the pool.
    /// * `tick_spacing` - The tick spacing for the pool.
    /// * `max_liquidity_per_tick` - The maximum amount of liquidity allowed in a single tick.
    ///
    /// # Errors
    /// Requires the pool to not exist.
    #[allow(non_snake_case)]
    pub fn create_pool_D650_E2_D0(
        &mut self,
        pool: Address,
        price: U256,
        fee: u32,
    ) -> Result<(), Revert> {
        let tick_spacing = match fee {
            0 => Ok(1),
            500 => Ok(10),
            3000 => Ok(60),
            10_000 => Ok(200),
            _ => Err(Error::BadFee)
        }?;

        let max_liq_per_tick = tick_math::tick_spacing_to_max_liq(tick_spacing)?;

        self.pools
            .setter(pool)
            .init(price, fee, tick_spacing, max_liq_per_tick)?;

        // get the decimals for the asset so we can log it's decimals for the indexer

        let _decimals = erc20::decimals(pool)?;

        evm::log(events::NewPool {
            token: pool,
            fee,
            decimals: _decimals,
            tickSpacing: tick_spacing,
        });

        Ok(())
    }

    /// Getter method for the sqrt price
    #[allow(non_snake_case)]
    pub fn sqrt_price_x967_B8_F5_F_C5(&self, pool: Address) -> Result<U256, Revert> {
        Ok(self.pools.getter(pool).get_sqrt_price())
    }

    /// Getter method for the current tick
    #[allow(non_snake_case)]
    pub fn cur_tick181_C6_F_D9(&self, pool: Address) -> Result<i32, Revert> {
        // converted to i32 for automatic abi encoding
        Ok(self.pools.getter(pool).get_cur_tick().sys())
    }

    #[allow(non_snake_case)]
    pub fn fees_owed_22_F28_D_B_D(&self, pool: Address, id: U256) -> Result<(u128, u128), Revert> {
        Ok(self.pools.getter(pool).get_fees_owed(id))
    }

    /// Getter method for the tick spacing of the pool given.
    #[allow(non_snake_case)]
    pub fn tick_spacing_653_F_E28_F(&self, pool: Address) -> Result<u8, Revert> {
        // converted to i32 for automatic abi encoding
        Ok(self.pools.getter(pool).get_tick_spacing().sys())
    }

    #[allow(non_snake_case)]
    pub fn fee_B_B_3_C_F_608(&self, pool: Address) -> Result<u32, Revert> {
        Ok(self.pools.getter(pool).get_fee())
    }

    /// Getter method for getting the fee growth for token 0
    #[allow(non_snake_case)]
    pub fn fee_growth_global_0_38_B5665_B(&self, pool: Address) -> Result<U256, Revert> {
        Ok(self.pools.getter(pool).get_fee_growth_global_0())
    }

    /// Getter method for getting the fee growth for token 1
    #[allow(non_snake_case)]
    pub fn fee_growth_global_1_A_33_A_5_A_1_B(&self, pool: Address) -> Result<U256, Revert> {
        Ok(self.pools.getter(pool).get_fee_growth_global_1())
    }

    /// Set the sqrt price for a pool. Only useful if the pool was
    /// misconfigured (intentionally or otherwise) at the beginning of the
    /// pool's life. Be careful with this!
    #[allow(non_snake_case)]
    pub fn set_sqrt_price_F_F_4_D_B_98_C(
        &mut self,
        pool: Address,
        new_price: U256,
    ) -> Result<(), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        self.pools.setter(pool).set_sqrt_price(new_price);

        Ok(())
    }

    #[allow(non_snake_case)]
    pub fn set_fee_protocol_C_B_D_3_E_C_35(
        &mut self,
        pool: Address,
        fee_protocol_0: u8,
        fee_protocol_1: u8,
    ) -> Result<(), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        let is_fee_valid = (fee_protocol_0 == 0 || (4..=10).contains(&fee_protocol_0))
            && (fee_protocol_1 == 0 || (4..=10).contains(&fee_protocol_1));

        assert_or!(is_fee_valid, Error::BadFeeProtocol);

        let fee_protocol = fee_protocol_0 + (fee_protocol_1 << 4);

        self.pools.setter(pool).set_fee_protocol(fee_protocol);

        evm::log(events::NewFees {
            pool,
            feeProtocol: fee_protocol,
        });

        Ok(())
    }

    /// Update the NFT manager that has trusted access to moving tokens on
    /// behalf of users.
    #[allow(non_snake_case)]
    pub fn update_nft_manager_9_B_D_F_41_F_6(&mut self, manager: Address) -> Result<(), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        self.nft_manager.set(manager);

        Ok(())
    }

    /// Update the emergency council that can disable the pools.
    #[allow(non_snake_case)]
    pub fn update_emergency_council_7_D_0_C_1_C_58(
        &mut self,
        manager: Address,
    ) -> Result<(), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        self.emergency_council.set(manager);

        Ok(())
    }

    /// Collects protocol fees from the AMM. Only usable by the seawater admin.
    ///
    /// # Errors
    /// Requires the user to be the seawater admin. Requires the pool to be enabled.
    #[allow(non_snake_case)]
    pub fn collect_protocol_7540_F_A_9_F(
        &mut self,
        pool: Address,
        amount_0: u128,
        amount_1: u128,
        recipient: Address,
    ) -> Result<(u128, u128), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        let (token_0, token_1) = self
            .pools
            .setter(pool)
            .collect_protocol(amount_0, amount_1)?;

        erc20::transfer_to_addr(pool, recipient, U256::from(token_0))?;
        erc20::transfer_to_addr(FUSDC_ADDR, recipient, U256::from(token_1))?;

        evm::log(events::CollectProtocolFees {
            pool,
            to: recipient,
            amount0: token_0,
            amount1: token_1,
        });

        // transfer tokens
        Ok((token_0, token_1))
    }

    /// Changes if a pool is enabled. Only usable by the seawater admin, or the emergency council, or the
    ///
    /// # Errors
    /// Requires the user to be the seawater admin.
    #[allow(non_snake_case)]
    pub fn enable_pool_579_D_A658(&mut self, pool: Address, enabled: bool) -> Result<(), Revert> {
        assert_or!(
            self.seawater_admin.get() == msg::sender()
                || self.emergency_council.get() == msg::sender()
                || self.authorised_enablers.get(msg::sender()),
            Error::SeawaterAdminOnly
        );
        assert_or!(
            self.pools.getter(pool).initialised.get(),
            Error::PoolIsNotInitialised
        );

        if self.emergency_council.get() == msg::sender()
            && self.seawater_admin.get() != msg::sender()
            && enabled
        {
            // Emergency council can only disable!
            return Err(Error::SeawaterEmergencyOnlyDisable.into());
        }

        self.pools.setter(pool).set_enabled(enabled);
        Ok(())
    }

    #[allow(non_snake_case)]
    pub fn authorise_enabler_5_B_17_C_274(
        &mut self,
        enabler: Address,
        enabled: bool,
    ) -> Result<(), Revert> {
        assert_or!(
            self.seawater_admin.get() == msg::sender(),
            Error::SeawaterAdminOnly
        );

        self.authorised_enablers.setter(enabler).set(enabled);

        Ok(())
    }
}

/// Migrations code that should only be used in a testing environment, or in a rescue
/// situation. These functions will break the internal state of the pool most likely.
/// These likely won't exist beyond testnet, and are as such not included as a facet,
/// intending to be used in the catch all feature.
#[cfg_attr(feature = "migrations", public)]
impl Pools {
    pub fn disable_pools(&mut self, pools: Vec<Address>) -> Result<(), Vec<u8>> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        for pool in pools {
            self.pools.setter(pool).set_enabled(false);
        }

        Ok(())
    }

    #[allow(non_snake_case)]
    pub fn send_token_to_sender_9603_F_18_B(
        &mut self,
        token: Address,
        amount: U256,
    ) -> Result<(), Vec<u8>> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        erc20::transfer_to_sender(token, amount)?;

        Ok(())
    }

    #[allow(non_snake_case)]
    pub fn send_amounts_from_sender_3_D_F_81_C_E_5(
        &mut self,
        token: Address,
        recipients: Vec<(Address, U256)>,
    ) -> Result<(), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        for (addr, amount) in recipients {
            erc20::take_from_to(token, addr, amount)?;
        }

        Ok(())
    }
}

/// Functions for adjusting positions using in-contract calculation of certain values.
/// Functions here are dispatched into by when the proxy
/// sees the EXECUTOR_ADJUST_POSITION_DISPATCH magic byte in
/// its fallback function.
#[cfg_attr(feature = "adjust_positions", public)]
impl Pools {
    /// Refreshes and updates liquidity in a position, transferring tokens from the user with a restriction on the amount taken.
    /// See [Self::adjust_position_internal].
    #[allow(non_snake_case)]
    pub fn incr_position_E_2437399(
        &mut self,
        pool: Address,
        id: U256,
        amount_0_min: U256,
        amount_1_min: U256,
        amount_0_desired: U256,
        amount_1_desired: U256,
    ) -> Result<(U256, U256), Revert> {
        self.adjust_position_internal(
            pool,
            id,
            amount_0_min,
            amount_1_min,
            amount_0_desired,
            amount_1_desired,
            None,
        )
    }
}

/// Some swap functions using Permit2. Only enabled when the `swap_permit2_b` feature is
/// set. Functions here are dispatched into by when the proxy
/// sees the EXECUTOR_SWAP_PERMIT2_B_DISPATCH magic byte in
/// its fallback function.
#[cfg_attr(feature = "swap_permit2_b", public)]
impl Pools {
    /// Performs a two stage swap, using permit2 to transfer tokens. See [Self::swap_2_internal].
    #[allow(non_snake_case)]
    pub fn swap2_exact_in_permit_254_A_7_D_B_B_1(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
        nonce: U256,
        deadline: U256,
        sig: Vec<u8>,
    ) -> Result<(U256, U256), Revert> {
        let permit2_args = Permit2Args {
            max_amount: amount,
            nonce,
            deadline,
            sig: &sig,
        };

        assert_or!(from != to, Error::SamePool);

        Pools::swap_2_internal_erc20(self, from, to, amount, min_out, Some(permit2_args))
    }
}

#[cfg(feature = "testing")]
impl test_utils::StorageNew for Pools {
    fn new(i: U256, v: u8) -> Self {
        unsafe { <Self as stylus_sdk::storage::StorageType>::new(i, v) }
    }
}
