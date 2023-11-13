//! Implementation of the seawater AMM
//!
//! Seawater is an AMM designed for arbitrum's stylus environment based on uniswap v3.

#![cfg_attr(not(target_arch = "wasm32"), feature(lazy_cell, const_trait_impl))]
#![deny(clippy::unwrap_used)]

pub mod erc20;
#[macro_use]
pub mod error;
pub mod events;

pub mod maths;
pub mod pool;
pub mod position;
pub mod test_shims;
pub mod tick;
pub mod types;

// stylus requires this, since it accesses alloc::vec etc directly
extern crate alloc;

use crate::types::{Address, I256Extension, I256, U256};
use error::Error;
use maths::tick_math;

use types::U256Extension;

use stylus_sdk::{evm, msg, prelude::*, storage::*};

// aliased for simplicity
type Revert = Vec<u8>;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// we split our entrypoint functions into three sets, and call them via diamond proxies, to
// save on binary size

#[cfg(not(any(feature = "swaps", feature = "positions", feature = "admin",)))]
mod shim {
    #[cfg(target_arch = "wasm32")]
    compile_error!(
        "Either `swaps` or `positions` or `admin` must be enabled when building for wasm."
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

    fusdc: StorageAddress,
    pools: StorageMap<Address, pool::StoragePool>,
    // position NFTs
    next_position_id: StorageU256,
    // ID => owner
    position_owners: StorageMap<U256, StorageAddress>,
    // owner => count
    owned_positions: StorageMap<Address, StorageU256>,
}

/// Swap functions. Only enabled when the `swaps` feature is set.
#[cfg_attr(feature = "swaps", external)]
impl Pools {
    /// Raw swap function, implementing the uniswap v3 interface.
    ///
    /// # Arguments
    /// * `pool` - The pool to swap for. Pools are accessed as the address of their first token,
    /// where every pool has the fluid token as token 1.
    /// * `zero_for_one` - The swap direction. This is `true` if swapping to the fluid token, or
    /// `false` if swapping from the fluid token.
    /// * `amount` - The amount of token to swap. Follows the uniswap convention, where a positive
    /// amount will perform an exact in swap and a negative amount will perform an exact out swap.
    /// * `price_limit_x96` - The price limit, specified as an X96 encoded square root price.
    /// # Side effects
    /// This function transfers ERC20 tokens from and to the caller as per the swap. It takes
    /// tokens using ERC20's `transferFrom` method, and therefore must have approvals set before
    /// use.
    pub fn swap(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit_x96: U256,
    ) -> Result<(I256, I256), Revert> {
        let (amount_0, amount_1, ending_tick) =
            self.pools
                .setter(pool)
                .swap(zero_for_one, amount, price_limit_x96)?;

        // entirely reentrant safe because stylus
        // denies all reentrancy unless explicity allowed (which we don't)
        erc20::exchange(pool, amount_0)?;
        erc20::exchange(self.fusdc.get(), amount_1)?;

        let amount_0_abs = amount_0.checked_abs().ok_or(Error::SwapResultTooHigh)?.into_raw();
        let amount_1_abs = amount_1.checked_abs().ok_or(Error::SwapResultTooHigh)?.into_raw();

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

    /// Performs a two step swap, swapping from a non-fluid token to a non-fluid token.
    ///
    /// See [Self::swap] for more details on how this operates.
    pub fn swap_2_exact_in(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<(U256, U256), Revert> {
        let amount = I256::try_from(amount).unwrap();
        // swap in -> usdc
        let (amount_in, interim_usdc_out, final_tick_in) =
            self.pools
                .setter(from)
                .swap(
                    true,
                    amount,
                    // swap with no price limit, since we use min_out instead
                    tick_math::MIN_SQRT_RATIO + U256::one(),
                )?;

        // make this positive for exact in
        let interim_usdc_out = interim_usdc_out.checked_neg().ok_or(Error::InterimSwapPositive)?;

        // swap usdc -> out
        let (amount_out, interim_usdc_in, final_tick_out) = self.pools.setter(to).swap(
            false,
            interim_usdc_out,
            tick_math::MAX_SQRT_RATIO - U256::one(),
        )?;

        let amount_in = amount_in.abs_pos()?;
        let amount_out = amount_out.abs_neg()?;

        assert_eq_or!(interim_usdc_out, interim_usdc_in, Error::InterimSwapNotEq);
        assert_or!(amount_out >= min_out, Error::MinOutNotReached);

        // transfer tokens
        erc20::take(from, amount_in)?;
        erc20::send(to, amount_out)?;

        evm::log(events::Swap2 {
            user: msg::sender(),
            from,
            to,
            amountIn: amount_in,
            amountOut: amount_out,
            finalTick0: final_tick_in,
            finalTick1: final_tick_out,
        });

        // return amount - amount_in to the user
        // send amount_out to the user
        Ok((amount_in, amount_out))
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
    pub fn mint_position(&mut self, pool: Address, lower: i32, upper: i32) -> Result<(), Revert> {
        let id = self.next_position_id.get();
        self.pools.setter(pool).create_position(id, lower, upper);

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
    pub fn burn_position(&mut self, id: U256) -> Result<(), Revert> {
        let owner = msg::sender();
        assert_eq_or!(self.position_owners.get(id), owner, Error::PositionOwnerOnly);

        self.remove_position(owner, id);

        evm::log(events::BurnPosition { owner, id });

        Ok(())
    }

    /// Transfers a position's ownership from one address to another. Only usable by the NFT
    /// manager account.
    ///
    /// # Calling requirements
    /// Requires that the `from` address is the current owner of the position.
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

    /// Refreshes the amount of liquidity in a position, and adds or removes liquidity. Only usable
    /// by the position's owner.
    ///
    /// # Arguments
    /// * `pool` - The pool the position belongs to.
    /// * `id` - The ID of the position.
    /// * `delta` - The change to apply to the liquidity in the position.
    ///
    /// # Side effects
    /// Adding or removing liquidity will transfer tokens from or to the caller. Tokens are
    /// transfered with ERC20's `transferFrom`, so approvals must be set before calling.
    pub fn update_position(
        &mut self,
        pool: Address,
        id: U256,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        assert_eq_or!(msg::sender(), self.position_owners.get(id), Error::PositionOwnerOnly);

        let (token_0, token_1) = self.pools.setter(pool).update_position(id, delta)?;

        erc20::exchange(pool, token_0)?;
        erc20::exchange(self.fusdc.get(), token_1)?;

        evm::log(events::UpdatePositionLiquidity { id, delta });

        Ok((token_0, token_1))
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
    pub fn collect(
        &mut self,
        pool: Address,
        id: U256,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        assert_eq_or!(msg::sender(), self.position_owners.get(id), Error::PositionOwnerOnly);

        let (token_0, token_1) = self.pools.setter(pool).collect(id, amount_0, amount_1);

        erc20::send(pool, U256::from(token_0))?;
        erc20::send(self.fusdc.get(), U256::from(token_1))?;

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

/// Admin functions. Only enabled when the `admin` feature is set.
#[cfg_attr(feature = "admin", external)]
impl Pools {
    /// The initialiser function for the seawater contract. Should be called in the proxy's
    /// constructor.
    pub fn ctor(
        &mut self,
        usdc: Address,
        seawater_admin: Address,
        nft_manager: Address,
    ) -> Result<(), Revert> {
        assert_eq_or!(self.fusdc.get(), Address::ZERO, Error::ContractAlreadyInitialised);

        self.fusdc.set(usdc);
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
    pub fn create_pool(
        &mut self,
        pool: Address,
        price: U256,
        fee: u32,
        tick_spacing: u8,
        max_liquidity_per_tick: u128,
    ) -> Result<(), Revert> {
        assert_eq_or!(msg::sender(), self.seawater_admin.get(), Error::SeawaterAdminOnly);

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
    pub fn collect_protocol(
        &mut self,
        pool: Address,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        assert_eq_or!(msg::sender(), self.seawater_admin.get(), Error::SeawaterAdminOnly);
        let (token_0, token_1) = self.pools.setter(pool).collect_protocol(amount_0, amount_1);

        erc20::send(pool, U256::from(token_0))?;
        erc20::send(self.fusdc.get(), U256::from(token_1))?;

        evm::log(events::CollectProtocolFees {
            pool,
            to: msg::sender(),
            amount0: token_0,
            amount1: token_1,
        });

        // transfer tokens
        Ok((token_0, token_1))
    }
}
