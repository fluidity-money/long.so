//! Implementation of the seawater AMM
//!
//! Seawater is an AMM designed for arbitrum's stylus environment based on uniswap v3.

#![feature(split_array)]
#![cfg_attr(not(target_arch = "wasm32"), feature(lazy_cell, const_trait_impl))]
#![deny(clippy::unwrap_used)]

pub mod immutables;
pub mod erc20;
pub mod eth_serde;
#[macro_use]
pub mod error;
pub mod events;

pub mod maths;
pub mod pool;
pub mod position;
pub mod test_shims;
pub mod tick;
pub mod types;

use crate::types::{Address, I256Extension, I256, U256};
use erc20::Permit2Args;
use error::Error;
use immutables::FUSDC_ADDR;
use maths::tick_math;

use types::{U256Extension, WrappedNative};

use stylus_sdk::{evm, msg, prelude::*, storage::*, alloy_primitives::address};

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
    feature = "positions",
    feature = "update_positions",
    feature = "admin",
)))]
mod shim {
    #[cfg(target_arch = "wasm32")]
    compile_error!(
        "Either `swaps` or `positions` or `update_positions` or `admin` must be enabled when building for wasm."
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

        erc20::take(
            take_token,
            take_amount.abs_pos()?,
            permit2,
        )?;
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

    /// Performs a two step swap, taking a permit2 blob for transfers.
    ///
    /// This function is called by [Self::swap_2] and `swap_2_permit2`, which do
    /// argument decoding.
    /// See [Self::swap] for more details on how this operates.
    pub fn swap_2_internal(
        pools: &mut Pools,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
        permit2: Option<Permit2Args>,
    ) -> Result<(U256, U256), Revert> {
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
    // slight hack - we cfg out the whole function, since the `selector` and `raw` attributes don't
    // actually exist, so we can't `cfg_attr` them in
    #[cfg(feature = "swaps")]
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

    pub fn swap(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit_x96: U256,
    ) -> Result<(I256, I256), Revert> {
        Pools::swap_internal(self, pool, zero_for_one, amount, price_limit_x96, None)
    }

    /// Performs a two stage swap, using permit2 to transfer tokens. See [Self::swap_2_internal].
    #[cfg(feature = "swaps")]
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

        match Pools::swap_2_internal(self, from, to, amount, min_out, Some(permit2_args)) {
            Ok((a, b)) => Some(Ok([a.to_be_bytes::<32>(), b.to_be_bytes::<32>()].concat())),
            Err(e) => Some(Err(e)),
        }
    }

    /// Performs a two stage swap, using approvals to transfer tokens. See [Self::swap_2_internal].
    pub fn swap_2(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<(U256, U256), Revert> {
        Pools::swap_2_internal(self, from, to, amount, min_out, None)
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
            erc20::take(
                FUSDC_ADDR,
                token_1.abs_pos()?,
                permit_1,
            )?;
        }

        evm::log(events::UpdatePositionLiquidity { id, delta });

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
            Ok((token_0, token_1)) => Some(Ok(
                [token_0.to_be_bytes::<32>(), token_1.to_be_bytes::<32>()].concat()
            )),
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
    pub fn ctor(
        &mut self,
        seawater_admin: Address,
        nft_manager: Address,
    ) -> Result<(), Revert> {
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

        evm::log(events::NewPool {
            token: pool,
            fee,
            price,
        });

        Ok(())
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

#[cfg(test)]
mod test {
    use crate::{eth_serde, types::I256Extension};
    use ruint_macro::uint;
    use stylus_sdk::alloy_primitives::{address, bytes};

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
}
