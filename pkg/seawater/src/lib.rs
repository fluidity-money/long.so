//! Implementation of the seawater AMM
//!
//! Seawater is an AMM designed for arbitrum's stylus environment based on uniswap v3.

#![feature(split_array)]
#![cfg_attr(not(target_arch = "wasm32"), feature(const_trait_impl))]
#![deny(clippy::unwrap_used)]

pub mod eth_serde;
pub mod immutables;
#[macro_use]
pub mod error;
pub mod events;

pub mod maths;
pub mod pool;
pub mod position;
pub mod tick;
pub mod types;

#[cfg(all(not(target_arch = "wasm32"), feature = "testing"))]
pub mod host_test_shims;

#[cfg(all(not(target_arch = "wasm32"), feature = "testing"))]
pub mod host_test_utils;

#[cfg(feature = "testing")]
pub mod test_shims;

#[cfg(feature = "testing")]
pub mod test_utils;

// Permit2 types exposed by the erc20 file.
pub mod permit2_types;

// We only want to have testing on the host environment and mocking stuff
// out in a testing context
#[cfg(all(not(target_arch = "wasm32"), feature = "testing"))]
pub mod host_erc20;

#[cfg(target_arch = "wasm32")]
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

use stylus_sdk::{evm, msg, prelude::*, storage::*};

#[allow(dead_code)]
type RawArbResult = Option<Result<Vec<u8>, Vec<u8>>>;

// aliased for simplicity
type Revert = Vec<u8>;

extern crate alloc;
// only set a custom allocator if we're deploying on wasm
#[cfg(target_arch = "wasm32")]
mod allocator {
    use lol_alloc::{AssumeSingleThreaded, FreeListAllocator};
    // SAFETY: This application is single threaded, so using AssumeSingleThreaded is allowed.
    #[global_allocator]
    static ALLOCATOR: AssumeSingleThreaded<FreeListAllocator> =
        unsafe { AssumeSingleThreaded::new(FreeListAllocator::new()) };
}

// we split our entrypoint functions into three sets, and call them via diamond proxies, to
// save on binary size
#[cfg(not(any(
    feature = "swaps",
    feature = "swap_permit2",
    feature = "quotes",
    feature = "positions",
    feature = "update_positions",
    feature = "admin",
)))]
mod shim {
    #[cfg(target_arch = "wasm32")]
    compile_error!(
        "Either `swaps` or `swap_permit2` or `quotes` or `positions` or `update_positions` or `admin` must be enabled when building for wasm."
    );
    #[stylus_sdk::prelude::external]
    impl crate::Pools {}
}

/// The root of seawater's storage. Stores variables needed globally, as well as the map of AMM
/// pools.
#[solidity_storage]
#[entrypoint]
pub struct Pools {
    seawater_admin: StorageAddress,
    // the nft manager is a privileged account that can transfer NFTs!
    nft_manager: StorageAddress,

    pools: StorageMap<Address, pool::StoragePool>,
    // position NFTs
    next_position_id: StorageU256,
    // ID => owner
    position_owners: StorageMap<U256, StorageAddress>,
    // owner => count
    owned_positions: StorageMap<Address, StorageU256>,
}

impl Pools {
    /// Raw swap function, implementing the uniswap v3 interface.
    ///
    /// This function is called by [Self::swap] and `swap_permit2`, which do
    /// argument decoding.
    ///
    /// # Arguments
    /// * `pool` - The pool to swap for. Pools are accessed as the address of their first token,
    /// where every pool has the fluid token as token 1.
    /// * `zero_for_one` - The swap direction. This is `true` if swapping to the fluid token, or
    /// `false` if swapping from the fluid token.
    /// * `amount` - The amount of token to swap. Follows the uniswap convention, where a positive
    /// amount will perform an exact in swap and a negative amount will perform an exact out swap.
    /// * `price_limit_x96` - The price limit, specified as an X96 encoded square root price.
    /// * `permit2` - Optional permit2 blob for the token being transfered - transfers will be done
    /// using permit2 if this is `Some`, or `transferFrom` if this is `None`.
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
        let (amount_0, amount_1, ending_tick) =
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
        erc20::give(give_token, give_amount.abs_neg()?)?;

        let amount_0_abs = amount_0
            .checked_abs()
            .ok_or(Error::SwapResultTooHigh)?
            .into_raw();
        let amount_1_abs = amount_1
            .checked_abs()
            .ok_or(Error::SwapResultTooHigh)?
            .into_raw();

        evm::log(events::Swap1 {
            user: msg::sender(),
            pool,
            zeroForOne: zero_for_one,
            amount0: amount_0_abs,
            amount1: amount_1_abs,
            finalTick: ending_tick,
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
        let original_amount = amount;

        let amount = I256::try_from(amount).unwrap();

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
        let (amount_out, interim_usdc_in, final_tick_out) = pools.pools.setter(to).swap(
            false,
            interim_usdc_out,
            tick_math::MAX_SQRT_RATIO - U256::one(),
        )?;

        let amount_in = amount_in.abs_pos()?;
        let amount_out = amount_out.abs_neg()?;

        assert_eq_or!(interim_usdc_out, interim_usdc_in, Error::InterimSwapNotEq);
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
        let (
            original_amount,
            amount_in,
            amount_out,
            interim_usdc_out,
            final_tick_in,
            final_tick_out,
        ) = Self::swap_2_internal(pools, from, to, amount, min_out)?;

        // transfer tokens
        erc20::take(from, original_amount, permit2)?;
        erc20::give(to, amount_out)?;

        evm::log(events::Swap2 {
            user: msg::sender(),
            from,
            to,
            amountIn: amount_in,
            amountOut: amount_out,
            fluidVolume: interim_usdc_out.abs().into_raw(),
            finalTick0: final_tick_in,
            finalTick1: final_tick_out,
        });

        // return amount - amount_in to the user
        // send amount_out to the user
        Ok((amount_in, amount_out))
    }
}

/// Swap functions. Only enabled when the `swaps` feature is set.
#[cfg_attr(feature = "swaps", external)]
impl Pools {
    pub fn swap(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit_x96: U256,
    ) -> Result<(I256, I256), Revert> {
        Pools::swap_internal(self, pool, zero_for_one, amount, price_limit_x96, None)
    }

    /// Performs a two stage swap, using approvals to transfer tokens. See [Self::swap_2_internal].
    pub fn swap_2_exact_in(
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
#[cfg_attr(feature = "quotes", external)]
impl Pools {
    /// Quote a [Self::swap]. Will revert with the result of the swap
    /// as a decimal number as the message of an `Error(string)`.
    /// Returns a `Result` as Stylus expects but will always only fill the `Revert`.
    pub fn quote(
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
                // we always want the token that was taken from the pool, so it's always negative
                let quote_amount = if zero_for_one { -amount_1 } else { -amount_0 };
                let revert = erc20::revert_from_msg(&quote_amount.to_dec_string());
                Err(revert)
            }
            // actual error, return it as normal
            Err(e) => Err(e),
        }
    }

    /// Quote a [Self::swap_2_exact_in]. Will revert with the result of the swap
    /// as a decimal number as the message of an `Error(string)`.
    /// Returns a `Result` as Stylus expects but will always only fill the `Revert`.
    pub fn quote2(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<(), Revert> {
        let swapped = Pools::swap_2_internal(self, from, to, amount, min_out);

        match swapped {
            Ok((_, _, amount_out, _, _, _)) => {
                let revert = erc20::revert_from_msg(&amount_out.to_string());
                Err(revert)
            }
            // actual error, return it as normal
            Err(e) => Err(e),
        }
    }
}

/// Swap functions using Permit2. Only enabled when the `swap_permit2` feature is set.
#[cfg_attr(feature = "swap_permit2", external)]
impl Pools {
    // slight hack - we cfg out the whole function, since the `selector` and `raw` attributes don't
    // actually exist, so we can't `cfg_attr` them in
    #[cfg(feature = "swap_permit2")]
    #[selector(id = "swapPermit2(address,bool,int256,uint256,uint256,uint256,uint256,bytes)")]
    #[raw]
    pub fn swap_permit2(&mut self, data: &[u8]) -> RawArbResult {
        let (pool, data) = eth_serde::parse_addr(data);
        let (zero_for_one, data) = eth_serde::parse_bool(data);
        let (amount, data) = eth_serde::parse_i256(data);
        let (price_limit_x96, data) = eth_serde::parse_u256(data);
        let (nonce, data) = eth_serde::parse_u256(data);
        let (deadline, data) = eth_serde::parse_u256(data);
        let (max_amount, data) = eth_serde::parse_u256(data);
        let (_, data) = eth_serde::take_word(data); // placeholder
        let (sig, _) = eth_serde::parse_bytes(data);

        let permit2_args = Permit2Args {
            max_amount,
            nonce,
            deadline,
            sig,
        };

        match Pools::swap_internal(
            self,
            pool,
            zero_for_one,
            amount,
            price_limit_x96,
            Some(permit2_args),
        ) {
            Ok((a, b)) => Some(Ok([a.to_be_bytes::<32>(), b.to_be_bytes::<32>()].concat())),
            Err(e) => Some(Err(e)),
        }
    }

    /// Performs a two stage swap, using permit2 to transfer tokens. See [Self::swap_2_internal].
    #[cfg(feature = "swap_permit2")]
    #[selector(id = "swap2ExactInPermit2(address,address,uint256,uint256,uint256,uint256,bytes)")]
    #[raw]
    pub fn swap_2_permit2(&mut self, data: &[u8]) -> RawArbResult {
        let (from, data) = eth_serde::parse_addr(data);
        let (to, data) = eth_serde::parse_addr(data);
        let (amount, data) = eth_serde::parse_u256(data);
        let (min_out, data) = eth_serde::parse_u256(data);
        let (nonce, data) = eth_serde::parse_u256(data);
        let (deadline, data) = eth_serde::parse_u256(data);
        let (_, data) = eth_serde::take_word(data);
        let (sig, _) = eth_serde::parse_bytes(data);

        let permit2_args = Permit2Args {
            max_amount: amount,
            nonce,
            deadline,
            sig,
        };

        match Pools::swap_2_internal_erc20(self, from, to, amount, min_out, Some(permit2_args)) {
            Ok((a, b)) => Some(Ok([a.to_be_bytes::<32>(), b.to_be_bytes::<32>()].concat())),
            Err(e) => Some(Err(e)),
        }
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
#[cfg_attr(feature = "positions", external)]
impl Pools {
    /// Creates a new, empty position, owned by a user.
    ///
    /// # Errors
    /// Requires the pool to exist and be enabled.
    pub fn mint_position(&mut self, pool: Address, lower: i32, upper: i32) -> Result<(), Revert> {
        let id = self.next_position_id.get();
        self.pools.setter(pool).create_position(id, lower, upper)?;

        self.next_position_id.set(id + U256::one());

        let owner = msg::sender();

        self.grant_position(owner, id);

        evm::log(events::MintPosition {
            owner,
            id,
            pool,
            lower,
            upper,
        });

        Ok(())
    }

    /// Burns a position. Only usable by the position owner.
    ///
    /// Calling this function leaves any liquidity or fees left in the position inaccessible.
    ///
    /// # Errors
    /// Requires the position be owned by the caller. Requires the pool to be enabled.
    pub fn burn_position(&mut self, id: U256) -> Result<(), Revert> {
        let owner = msg::sender();
        assert_eq_or!(
            self.position_owners.get(id),
            owner,
            Error::PositionOwnerOnly
        );

        self.remove_position(owner, id);

        evm::log(events::BurnPosition { owner, id });

        Ok(())
    }

    /// Transfers a position's ownership from one address to another. Only usable by the NFT
    /// manager account.
    ///
    /// # Calling requirements
    /// Requires that the `from` address is the current owner of the position.
    ///
    /// # Errors
    /// Requires the caller be the NFT manager.
    pub fn transfer_position(
        &mut self,
        id: U256,
        from: Address,
        to: Address,
    ) -> Result<(), Revert> {
        assert_eq_or!(msg::sender(), self.nft_manager.get(), Error::NftManagerOnly);

        self.remove_position(from, id);
        self.grant_position(to, id);

        evm::log(events::TransferPosition { from, to, id });

        Ok(())
    }

    /// Returns the current owner of a position.
    pub fn position_owner(&self, id: U256) -> Result<Address, Revert> {
        Ok(self.position_owners.get(id))
    }

    /// Returns the number of positions owned by an account.
    pub fn position_balance(&self, user: Address) -> Result<U256, Revert> {
        Ok(self.owned_positions.get(user))
    }

    /// Returns the amount of liquidity in a position.
    pub fn position_liquidity(&self, pool: Address, id: U256) -> Result<u128, Revert> {
        let liquidity = self.pools.getter(pool).get_position_liquidity(id);

        Ok(liquidity.sys())
    }

    /// Collects AMM fees from a position, and triggers a release of fluid LP rewards.
    /// Only usable by the position's owner.
    ///
    /// # Arguments
    /// * `pool` - The pool the position belongs to.
    /// * `id` - The ID of the position.
    /// * `amount_0` - The maximum amount of token 0 (the pool token) to collect.
    /// * `amount_1` - The maximum amount of token 1 (the fluid token) to collect.
    ///
    /// # Side effects
    /// Transfers tokens to the caller, and triggers a release of fluid LP rewards.
    ///
    /// # Errors
    /// Requires the caller to be the position owner. Requires the pool to be enabled.
    pub fn collect(
        &mut self,
        pool: Address,
        id: U256,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.position_owners.get(id),
            Error::PositionOwnerOnly
        );

        let (token_0, token_1) = self.pools.setter(pool).collect(id, amount_0, amount_1)?;

        erc20::give(pool, U256::from(token_0))?;
        erc20::give(FUSDC_ADDR, U256::from(token_1))?;

        evm::log(events::CollectFees {
            id,
            pool,
            to: msg::sender(),
            amount0: token_0,
            amount1: token_1,
        });
        Ok((token_0, token_1))
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
    /// using permit2 if this is `Some`, or `transferFrom` if this is `None`.
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
        pool: Address,
        id: U256,
        delta: i128,
        permit2: Option<(Permit2Args, Permit2Args)>,
    ) -> Result<(I256, I256), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.position_owners.get(id),
            Error::PositionOwnerOnly
        );

        let (token_0, token_1) = self.pools.setter(pool).update_position(id, delta)?;

        if delta < 0 {
            erc20::give(pool, token_0.abs_neg()?)?;
            erc20::give(FUSDC_ADDR, token_1.abs_neg()?)?;
        } else {
            let (permit_0, permit_1) = match permit2 {
                Some((permit_0, permit_1)) => (Some(permit_0), Some(permit_1)),
                None => (None, None),
            };

            erc20::take(pool, token_0.abs_pos()?, permit_0)?;
            erc20::take(FUSDC_ADDR, token_1.abs_pos()?, permit_1)?;
        }

        evm::log(events::UpdatePositionLiquidity {
            id: id,
            token0: token_0,
            token1: token_1,
        });

        Ok((token_0, token_1))
    }
}

#[cfg_attr(feature = "update_positions", external)]
impl Pools {
    /// Refreshes and updates liquidity in a position, using approvals to transfer tokens.
    /// See [Self::update_position_internal].
    pub fn update_position(
        &mut self,
        pool: Address,
        id: U256,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        self.update_position_internal(pool, id, delta, None)
    }

    #[cfg(feature = "update_positions")]
    #[raw]
    #[selector(
        id = "updatePositionPermit2(address,uint256,int128,uint256,uint256,uint256,bytes,uint256,uint256,uint256,bytes)"
    )]
    /// Refreshes and updates liquidity in a position, using permit2 to transfer tokens.
    /// See [Self::update_position_internal].
    pub fn update_position_permit2(&mut self, data: &[u8]) -> RawArbResult {
        let (pool, data) = eth_serde::parse_addr(data);
        let (id, data) = eth_serde::parse_u256(data);
        let (delta, data) = eth_serde::parse_i128(data);

        fn parse_permit2(data: &[u8]) -> (U256, U256, U256, &[u8]) {
            let (nonce, data) = eth_serde::parse_u256(data);
            let (deadline, data) = eth_serde::parse_u256(data);
            let (max_amount, data) = eth_serde::parse_u256(data);
            let (_, data) = eth_serde::take_word(data);

            (nonce, deadline, max_amount, data)
        }

        let (nonce_0, deadline_0, max_amount_0, data) = parse_permit2(data);
        let (nonce_1, deadline_1, max_amount_1, data) = parse_permit2(data);

        let (sig_0, data) = eth_serde::parse_bytes(data);
        let (sig_1, _) = eth_serde::parse_bytes(data);

        let permit2_token_0 = Permit2Args {
            max_amount: max_amount_0,
            nonce: nonce_0,
            deadline: deadline_0,
            sig: sig_0,
        };

        let permit2_token_1 = Permit2Args {
            max_amount: max_amount_1,
            nonce: nonce_1,
            deadline: deadline_1,
            sig: sig_1,
        };

        match Pools::update_position_internal(
            self,
            pool,
            id,
            delta,
            Some((permit2_token_0, permit2_token_1)),
        ) {
            Ok((token_0, token_1)) => Some(Ok([
                token_0.to_be_bytes::<32>(),
                token_1.to_be_bytes::<32>(),
            ]
            .concat())),
            Err(e) => Some(Err(e)),
        }
    }
}

/// Admin functions. Only enabled when the `admin` feature is set.
#[cfg_attr(feature = "admin", external)]
impl Pools {
    /// The initialiser function for the seawater contract. Should be called in the proxy's
    /// constructor.
    ///
    ///  # Errors
    ///  Requires the contract to not be initialised.
    pub fn ctor(&mut self, seawater_admin: Address, nft_manager: Address) -> Result<(), Revert> {
        assert_eq_or!(
            self.seawater_admin.get(),
            Address::ZERO,
            Error::ContractAlreadyInitialised
        );

        self.seawater_admin.set(seawater_admin);
        self.nft_manager.set(nft_manager);

        Ok(())
    }

    /// Creates a new pool. Only usable by the seawater admin.
    ///
    /// # Arguments
    /// * `pool` - The address of the non-fluid token to construct the pool around.
    /// * `price` - The initial price for the pool, as an X96 encoded square root price.
    /// * `fee` - The fee for the pool.
    /// * `tick_spacing` - The tick spacing for the pool.
    /// * `max_liquidity_per_tick` - The maximum amount of liquidity allowed in a single tick.
    ///
    /// # Errors
    /// Requires the caller to be the seawater admin. Requires the pool to not exist.
    pub fn create_pool(
        &mut self,
        pool: Address,
        price: U256,
        fee: u32,
        tick_spacing: u8,
        max_liquidity_per_tick: u128,
    ) -> Result<(), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        self.pools
            .setter(pool)
            .init(price, fee, tick_spacing, max_liquidity_per_tick)?;

        // get the decimals for the asset so we can log it's decimals for the indexer

        let decimals = erc20::decimals(pool)?;

        evm::log(events::NewPool {
            token: pool,
            fee,
            decimals,
            tickSpacing: tick_spacing,
        });

        Ok(())
    }

    /// Getter method for the sqrt price
    pub fn sqrt_price_x96(&self, pool: Address) -> Result<U256, Revert> {
        Ok(self.pools.getter(pool).get_sqrt_price())
    }

    /// Getter method for the current tick
    pub fn cur_tick(&self, pool: Address) -> Result<i32, Revert> {
        // converted to i32 for automatic abi encoding
        Ok(self.pools.getter(pool).get_cur_tick().sys())
    }

    /// Getter method for the tick spacing of the pool given.
    pub fn tick_spacing(&self, pool: Address) -> Result<u8, Revert> {
        // converted to i32 for automatic abi encoding
        Ok(self.pools.getter(pool).get_tick_spacing().sys())
    }

    /// Getter method for getting the fee growth for token 0
    pub fn fee_growth_global_0(&self, pool: Address) -> Result<U256, Revert> {
        Ok(self.pools.getter(pool).get_fee_growth_global_0())
    }

    /// Getter method for getting the fee growth for token 1
    pub fn fee_growth_global_1(&self, pool: Address) -> Result<U256, Revert> {
        Ok(self.pools.getter(pool).get_fee_growth_global_1())
    }

    /// Collects protocol fees from the AMM. Only usable by the seawater admin.
    ///
    /// # Errors
    /// Requires the user to be the seawater admin. Requires the pool to be enabled.
    pub fn collect_protocol(
        &mut self,
        pool: Address,
        amount_0: u128,
        amount_1: u128,
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

        erc20::give(pool, U256::from(token_0))?;
        erc20::give(FUSDC_ADDR, U256::from(token_1))?;

        evm::log(events::CollectProtocolFees {
            pool,
            to: msg::sender(),
            amount0: token_0,
            amount1: token_1,
        });

        // transfer tokens
        Ok((token_0, token_1))
    }

    /// Changes if a pool is enabled. Only usable by the seawater admin.
    ///
    /// # Errors
    /// Requires the user to be the seawater admin.
    pub fn enable_pool(&mut self, pool: Address, enabled: bool) -> Result<(), Revert> {
        assert_eq_or!(
            msg::sender(),
            self.seawater_admin.get(),
            Error::SeawaterAdminOnly
        );

        Ok(self.pools.setter(pool).set_enabled(enabled))
    }
}

#[cfg(all(not(target_arch = "wasm32"), feature = "testing"))]
impl test_utils::StorageNew for Pools {
    fn new(i: U256, v: u8) -> Self {
        unsafe { <Self as stylus_sdk::storage::StorageType>::new(i, v) }
    }
}

#[cfg(test)]
mod test {
    use crate::{eth_serde, test_utils, types::I256Extension, types::*, Pools};
    use maplit::hashmap;
    use ruint_macro::uint;
    use stylus_sdk::{
        alloy_primitives::{address, bytes},
        msg,
    };

    #[test]
    fn test_decode_swap() {
        // taken from an ethers generated blob
        let data = bytes!(
            "baef4bf9"
            "00000000000000000000000028f99e094fc846d4f5c8ad91e2ffd6ff92b0e7ca"
            "0000000000000000000000000000000000000000000000000000000000000001"
            "000000000000000000000000000000000000000000000000000000000000000a"
            "00000000000000000000000000000000000000057a2b748da963c00000000000"
            "0000000000000000000000000000000000000000000000000000000000000001"
            "00000000000000000000000000000000000000000000000000000000655d6b6d"
            "000000000000000000000000000000000000000000000000000000000000000a"
            "0000000000000000000000000000000000000000000000000000000000000100"
            "0000000000000000000000000000000000000000000000000000000000000041"
            "749af269b6860d64e97485e6be28448028f0e5e306b723fec3967bd489d667c8"
            "3c679180bc36f3d6ea751198b01e4b082e83ed853265a504d1f56f6712ee7380"
            "1b00000000000000000000000000000000000000000000000000000000000000"
        )
        .0;

        let data = &data;

        let (_, data) = eth_serde::parse_selector(data);
        let (pool, data) = eth_serde::parse_addr(data);
        let (zero_for_one, data) = eth_serde::parse_bool(data);
        let (amount, data) = eth_serde::parse_i256(data);
        let (_price_limit_x96, data) = eth_serde::parse_u256(data);
        let (nonce, data) = eth_serde::parse_u256(data);
        let (_deadline, data) = eth_serde::parse_u256(data);
        let (max_amount, data) = eth_serde::parse_u256(data);
        let (_, data) = eth_serde::take_word(data); // placeholder
        let (_sig, data) = eth_serde::parse_bytes(data);

        assert_eq!(pool, address!("28f99e094fc846d4f5c8ad91e2ffd6ff92b0e7ca"));
        assert_eq!(zero_for_one, true);
        assert_eq!(amount.abs_pos().unwrap(), uint!(10_U256));
        assert_eq!(nonce, uint!(1_U256));
        assert_eq!(max_amount, uint!(10_U256));
        assert_eq!(data.len(), 0);
    }

    #[test]
    fn test_sqrt_price() {
        dbg!(test_utils::encode_sqrt_price(100, 1));
    }

    #[test]
    fn test_similar_to_ethers() -> Result<(), Vec<u8>> {
        test_utils::with_storage::<_, Pools, _>(None, &hashmap! {}, |contract| {
            // Create the storage
            contract.seawater_admin.set(msg::sender());
            let token_addr = address!("97392C28f02AF38ac2aC41AF61297FA2b269C3DE");

            // First, we set up the pool.
            contract.create_pool(
                token_addr,
                test_utils::encode_sqrt_price(50, 1), // the price
                0,
                1,
                100000000000,
            )?;

            let lower_tick = test_utils::encode_tick(50);
            let upper_tick = test_utils::encode_tick(150);
            let liquidity_delta = 20000;

            // Begin to create the position, following the same path as
            // in `createPosition` in ethers-tests/tests.ts
            contract.mint_position(token_addr, lower_tick, upper_tick)?;
            let position_id = contract
                .next_position_id
                .clone()
                .checked_sub(U256::one())
                .unwrap();

            contract.update_position(token_addr, position_id, liquidity_delta)?;

            Ok(())
        })
    }

    #[test]
    fn test_alex() -> Result<(), Vec<u8>> {
        test_utils::with_storage::<_, Pools, _>(None, &hashmap! {}, |contract| {
            // Create the storage
            contract.seawater_admin.set(msg::sender());
            let token_addr = address!("97392C28f02AF38ac2aC41AF61297FA2b269C3DE");

            // First, we set up the pool.
            contract.create_pool(
                token_addr,
                test_utils::encode_sqrt_price(100, 1), // the price
                0,
                1,
                100000000000,
            )?;

            let lower_tick = 39122;
            let upper_tick = 50108;
            let liquidity_delta = 20000;

            // Begin to create the position, following the same path as
            // in `createPosition` in ethers-tests/tests.ts
            contract.mint_position(token_addr, lower_tick, upper_tick)?;
            let position_id = contract
                .next_position_id
                .clone()
                .checked_sub(U256::one())
                .unwrap();

            contract.update_position(token_addr, position_id, liquidity_delta)?;

            Ok(())
        })
    }

    #[test]
    fn broken_erik() -> Result<(), Vec<u8>> {
        test_utils::with_storage::<_, Pools, _>(
            Some(address!("eB6b882A295D316aC62C8cfcc81c3E37c084b7c5").into_array()),
            &hashmap! {
              "0x0000000000000000000000000000000000000000000000000000000000000000"=> "0x000000000000000000000000feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5",
              "0x3aafa5613932f019a44c0ba4fef5db570fdc26a44b344eb7016ee305da1d2cdd"=> "0x0000000000000000000000000000000000000000000000000000000000000000",
              "0x3c79da47f96b0f39664f73c0a1f350580be90742947dddfa21ba64d578dfe600"=> "0x0000000000000000000000000000000000000000000000000000000000000000",
              "0xb27456616f8c77c635d3551b8179f6887795e920c5c4421a6fa3c3c76fc90fa8"=> "0x000000000000000000000000c3a6d3de0772397a7216ebf5157a6c781666be83",
              "0xce67bab47ccb0f35690620809f2318ef477b533824426881f498e863af201134"=> "0x00000000000000000000ffffffffffffffffffffffffffffffff3c00000bb801",
              "0xce67bab47ccb0f35690620809f2318ef477b533824426881f498e863af201135"=> "0x00000000000000000000000000000176e500e5c6267c89a971bf79d5def44f71",
              "0xce67bab47ccb0f35690620809f2318ef477b533824426881f498e863af201138"=> "0xce67bab47ccb0f35690620809f2318ef477b533824426881f498e863af201138",
              "0xce67bab47ccb0f35690620809f2318ef477b533824426881f498e863af201139"=> "0x0000000000000000000000000000000000000000000010a59b9bb894028ef201",
              "0x8fbdd8104933a0a177010a6634261ffafc4ccc198a7e6ad034d7dcf09d0f560d" => "0x00000000000000000000ffffffffffffffffffffffffffffffff3c00000bb801",
              "0xce67bab47ccb0f35690620809f2318ef477b533824426881f498e863af201136" => "0x0000000000000000000000000000000000000001850189a932f92a682dd7f589",
            },
            |contract| {
                let from = address!("09F7156AAE9C903F90B1CB1E312582C4f208A759");
                let to = address!("6437fdc89cED41941b97A9f1f8992D88718C81c5");
                let amount = U256::from_limbs([0x6bc75e2d, 0x5, 0, 0]);
                let min_out = U256::from(0);
                contract
                    .swap_2_exact_in(from, to, amount, min_out)
                    .map(|_| ())
            },
        )
    }
}
