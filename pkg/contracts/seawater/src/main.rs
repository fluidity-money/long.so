#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

mod error;
mod maths;
mod position;
mod test_shims;
mod tick;
mod types;

use position::*;
use stylus_sdk::prelude::*;
use stylus_sdk::storage::*;
use types::{Address, Wrap, I256, U160, U256, U128, I128, I256Extension};
use maths::sqrt_price_math;
use maths::tick_math;
use maths::liquidity_math;

extern crate alloc;

type Revert = Vec<u8>;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[entrypoint]
#[solidity_storage]
pub struct StoragePool {
    max_liquidity_per_tick: StorageU128,
    fee_growth_global_0: StorageU256,
    fee_growth_global_1: StorageU256,

    sqrt_price: StorageU256,
    liquidity: StorageU128,
    tick_spacing: StorageU8,
    cur_tick: StorageI32,
    positions: position::StoragePositions,
    ticks: tick::StorageTicks,
    tick_bitmap: tick::StorageTickBitmap,
}

#[external]
impl StoragePool {
    #[allow(unused)]
    pub fn update_position(
        &mut self,
        owner: Address,
        lower: i32,
        upper: i32,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        // update the ticks
        let flip_lower = self.ticks.update(
            lower,
            self.cur_tick.get().unwrap(),
            delta,
            self.fee_growth_global_0.get(),
            self.fee_growth_global_1.get(),
            U160::from(0), // seconds per liquidity
            0,             // tick cumulative
            1,             // time
            false,
            self.max_liquidity_per_tick.get().unwrap(),
        )?;

        let flip_upper = self.ticks.update(
            lower,
            self.cur_tick.get().unwrap(),
            delta,
            self.fee_growth_global_0.get(),
            self.fee_growth_global_1.get(),
            U160::from(0), // seconds per liquidity
            0,             // tick cumulative
            1,             // time
            true,
            self.max_liquidity_per_tick.get().unwrap(),
        )?;

        // update the position
        let (fee_growth_inside_0, fee_growth_inside_1) = self.ticks.get_fee_growth_inside(
            lower,
            upper,
            self.cur_tick.get().unwrap(),
            self.fee_growth_global_0.get(),
            self.fee_growth_global_1.get(),
        )?;

        self.positions.update(
            StoragePositionKey{
                address: owner,
                lower,
                upper,
            },
            delta,
            fee_growth_inside_0,
            fee_growth_inside_1,
        );

        // clear unneeded storage
        if flip_lower {
            self.tick_bitmap
                .flip(lower, self.tick_spacing.get().unwrap());
            if delta < 0 {
                self.ticks.clear(lower);
            }
        }
        if flip_upper {
            self.tick_bitmap
                .flip(upper, self.tick_spacing.get().unwrap());
            self.ticks.clear(upper);
        }

        // calculate liquidity change and the amount of each token we need
        if delta != 0 {
            let (amount_0, amount_1) = if self.cur_tick.get().unwrap() < lower {
                // we're below the range, we need to move right, we'll need more token0
                (
                    sqrt_price_math::get_amount_0_delta(
                        tick_math::get_sqrt_ratio_at_tick(lower)?,
                        tick_math::get_sqrt_ratio_at_tick(upper)?,
                        delta,
                        )?,
                        I256::zero(),
                        )
            } else if self.cur_tick.get().unwrap() < upper {
                // we're inside the range, the liquidity is active and we need both tokens
                let new_liquidity = liquidity_math::add_delta(self.liquidity.get().unwrap(), delta)?;
                self.liquidity.set(U128::wrap(&new_liquidity));

                (
                    sqrt_price_math::get_amount_0_delta(
                        self.sqrt_price.get(),
                        tick_math::get_sqrt_ratio_at_tick(upper)?,
                        delta,
                        )?,
                        sqrt_price_math::get_amount_1_delta(
                            tick_math::get_sqrt_ratio_at_tick(lower)?,
                            self.sqrt_price.get(),
                            delta,
                            )?,
                            )
            } else {
                // we're above the range, we need to move left, we'll need token1
                (
                    I256::zero(),
                    sqrt_price_math::get_amount_1_delta(
                        tick_math::get_sqrt_ratio_at_tick(lower)?,
                        tick_math::get_sqrt_ratio_at_tick(upper)?,
                        delta,
                        )?,
                        )
            };
            Ok((amount_0, amount_1))
        } else {
            Ok((I256::zero(), I256::zero()))
        }
    }

    #[allow(unused)]
    pub fn swap(
        &mut self,
        zero_for_one: bool,
        amount: I256,
        price_limit: U256,
    ) -> Result<(I256, I256), Revert> {
        todo!()
    }
}
