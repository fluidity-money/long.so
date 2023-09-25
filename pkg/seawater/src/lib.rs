#![cfg_attr(test, feature(lazy_cell, const_trait_impl))]

pub mod error;
pub mod maths;
pub mod pool;
pub mod position;
pub mod test_shims;
pub mod tick;
pub mod types;

extern crate alloc;

use crate::types::{Address, I256Extension, Wrap, I256, I32, U128, U256, U32, U8};
use maths::tick_math;
use stylus_sdk::{prelude::*, storage::*, abi::Router, ArbResult};
use types::U256Extension;

type Revert = Vec<u8>;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(not(any(
        feature = "swaps",
        feature = "positions",
        feature = "admin",
)))]
mod shim {
    #[cfg(target_arch = "wasm32")]
    compile_error!("Either `swaps` or `positions` or `admin` must be enabled when building for wasm.");
    #[stylus_sdk::prelude::external]
    impl crate::Pools { }
}


#[solidity_storage]
#[entrypoint]
pub struct Pools {
    pools: StorageMap<Address, pool::StoragePool>,
}

#[cfg_attr(feature = "swaps", external)]
impl Pools {
    // raw swap function
    pub fn swap(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit: U256,
    ) -> Result<(I256, I256), Revert> {
        self.pools
            .setter(pool)
            .swap(zero_for_one, amount, price_limit)
    }

    pub fn swap_2_exact_in(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<U256, Revert> {
        let amount = I256::unchecked_from(amount);
        // swap in -> usdc
        let (amount_in, interim_usdc_out) =
            self.pools
                .setter(from)
                .swap(true, amount, tick_math::MIN_SQRT_RATIO + U256::one())?;

        // swap usdc -> out
        let (interim_usdc_in, amount_out) = self.pools.setter(to).swap(
            false,
            interim_usdc_out,
            tick_math::MAX_SQRT_RATIO - U256::one(),
        )?;

        let amount_out = U256::try_from(amount_out).unwrap();

        assert_eq!(interim_usdc_out, interim_usdc_in);
        assert!(amount_out >= min_out);

        // return amount - amount_in to the user
        // send amount_out to the user
        Ok(amount_out)
    }
}

#[cfg_attr(feature = "positions", external)]
impl Pools {
    pub fn update_position(
        &mut self,
        pool: Address,
        owner: Address,
        lower: i32,
        upper: i32,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        let (token_0, token_1) = self.pools
            .setter(pool)
            .update_position(owner, lower, upper, delta)?;

        // transfer tokens
        Ok((token_0, token_1))
    }

    pub fn collect(&mut self, pool: Address, owner: Address, lower: i32, upper: i32, amount_0: u128, amount_1: u128) -> Result<(u128, u128), Revert> {
        let (token_0, token_1) = self.pools
            .setter(pool)
            .collect(owner, lower, upper, amount_0, amount_1);

        // transfer tokens
        Ok((token_0, token_1))
    }
}


#[cfg_attr(feature = "admin", external)]
impl Pools {
    pub fn init(&mut self, pool: Address, price: U256, fee: u32, tick_spacing: u8, max_liquidity_per_tick: u128) -> Result<(), Revert> {
        self.pools
            .setter(pool)
            .init(price, fee, tick_spacing, max_liquidity_per_tick)?;

        Ok(())
    }

    pub fn collect_protocol(&mut self, pool: Address, amount_0: u128, amount_1: u128) -> Result<(u128, u128), Revert> {
        let (token_0, token_1) = self.pools
            .setter(pool)
            .collect_protocol(amount_0, amount_1);

        // transfer tokens
        Ok((token_0, token_1))

    }
}
