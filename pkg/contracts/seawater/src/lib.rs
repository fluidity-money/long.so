#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
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
use stylus_sdk::{prelude::*, storage::*};
use types::U256Extension;

type Revert = Vec<u8>;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[entrypoint]
#[solidity_storage]
pub struct Pools {
    pools: StorageMap<Address, pool::StoragePool>,
}

#[external]
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
