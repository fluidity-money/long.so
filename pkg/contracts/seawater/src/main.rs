#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

mod error;
mod maths;
mod position;
mod test_shims;
mod tick;
mod types;

use alloc::vec::Vec;
use stylus_sdk::{prelude::*, storage::*};
use types::{Address, Wrap, I256, U256, U128, I32, I256Extension};
use maths::{sqrt_price_math, tick_bitmap, tick_math, full_math, liquidity_math, swap_math};

extern crate alloc;

type Revert = Vec<u8>;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[entrypoint]
#[solidity_storage]
pub struct StoragePool {
    // immutables
    fee: StorageU32,
    tick_spacing: StorageU8,

    fee_protocol: StorageU8,
    max_liquidity_per_tick: StorageU128,
    fee_growth_global_0: StorageU256,
    fee_growth_global_1: StorageU256,
    protocol_fee_0: StorageU128,
    protocol_fee_1: StorageU128,

    sqrt_price: StorageU256,
    liquidity: StorageU128,
    cur_tick: StorageI32,
    positions: position::StoragePositions,
    ticks: tick::StorageTicks,
    tick_bitmap: tick::StorageTickBitmap,
}

#[external]
impl StoragePool {
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
            false,
            self.max_liquidity_per_tick.get().unwrap(),
        )?;

        let flip_upper = self.ticks.update(
            lower,
            self.cur_tick.get().unwrap(),
            delta,
            self.fee_growth_global_0.get(),
            self.fee_growth_global_1.get(),
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
            position::StoragePositionKey{
                address: owner,
                lower,
                upper,
            },
            delta,
            fee_growth_inside_0,
            fee_growth_inside_1,
        )?;

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

    pub fn swap(
        &mut self,
        zero_for_one: bool,
        amount: I256,
        price_limit: U256,
    ) -> Result<(I256, I256), Revert> {
        match zero_for_one {
            true => assert!(price_limit < self.sqrt_price.get() && price_limit > tick_math::MIN_SQRT_RATIO),
            false => assert!(price_limit > self.sqrt_price.get() && price_limit < tick_math::MAX_SQRT_RATIO),
        };

        let exact_in = amount > I256::zero();

        let fee_protocol = match zero_for_one {
            true => self.fee_protocol.get().unwrap() % 16,
            false => self.fee_protocol.get().unwrap() >> 4,
        };

        struct SwapState {
            amount_remaining: I256,
            amount_calculated: I256,
            price: U256,
            tick: i32,
            fee_growth_global: U256,
            protocol_fee: u128,
            liquidity: u128,
        }
        let mut state = SwapState {
            amount_remaining: amount,
            amount_calculated: I256::zero(),
            price: self.sqrt_price.get(),
            tick: self.cur_tick.get().unwrap(),
            fee_growth_global: match zero_for_one {
                true => self.fee_growth_global_0.get(),
                false => self.fee_growth_global_1.get(),
            },
            protocol_fee: 0,
            liquidity: self.liquidity.get().unwrap(),
        };

        while state.amount_remaining != I256::zero() && state.price != price_limit {
            let step_initial_price = state.price;
            let (step_next_tick, step_next_tick_initialised) = tick_bitmap::next_initialized_tick_within_one_word(
                &self.tick_bitmap.bitmap,
                state.tick,
                self.tick_spacing.get().unwrap().into(),
                zero_for_one,
            )?;

            // make sure the next tick's within bounds
            let step_next_tick = step_next_tick.clamp(tick_math::MIN_TICK, tick_math::MAX_TICK);

            let step_next_price = tick_math::get_sqrt_ratio_at_tick(step_next_tick)?;

            // swap til the tick is reached or the price limit is reached or the in/out amount is
            // used
            let hit_limit = match zero_for_one {
                true => step_next_price < price_limit,
                false => step_next_price > price_limit,
            };
            let step_clamped_price = match hit_limit {
                true => price_limit,
                false => step_next_price,
            };
            let (next_sqrt_price, step_amount_in, step_amount_out, mut step_fee_amount) = swap_math::compute_swap_step(
                state.price,
                step_clamped_price,
                state.liquidity,
                state.amount_remaining,
                self.fee.get().unwrap(),
            )?;
            state.price = next_sqrt_price;

            // update state
            match exact_in {
                true => {
                    state.amount_remaining -= I256::unchecked_from(step_amount_in + step_fee_amount);
                    state.amount_calculated -= I256::unchecked_from(step_amount_out);
                },
                false => {
                    state.amount_remaining += I256::unchecked_from(step_amount_out);
                    state.amount_remaining += I256::unchecked_from(step_amount_in + step_fee_amount);
                },
            }

            // set fees
            if fee_protocol > 0 {
                let delta = step_fee_amount.wrapping_div(U256::from(fee_protocol));
                step_fee_amount -= delta;
                state.protocol_fee += u128::try_from(delta).unwrap();
            }

            // update fees
            if state.liquidity >  0 {
                state.fee_growth_global += full_math::mul_div(
                    step_fee_amount,
                    full_math::Q128,
                    U256::try_from(state.liquidity).unwrap(),
                )?;
            }

            // shift tick
            if state.price == step_next_price {
                if step_next_tick_initialised {
                    let (fee_0, fee_1) = match zero_for_one {
                        true => (state.fee_growth_global, self.fee_growth_global_1.get()),
                        false => (self.fee_growth_global_0.get(), state.fee_growth_global),
                    };

                    let liquidity_net = self.ticks.cross(
                        step_next_tick,
                        fee_0,
                        fee_1,
                    );

                    // flip the liquidity delta if we're moving leftwards
                    let liquidity_net = match zero_for_one {
                        true => liquidity_net.wrapping_neg(),
                        false => liquidity_net,
                    };

                    state.liquidity = liquidity_math::add_delta(state.liquidity, liquidity_net)?;
                }

                state.tick = match zero_for_one {
                    true => step_next_tick - 1,
                    false => step_next_tick,
                };
            } else if state.price != step_initial_price {
                // recompute tick
                // is this needed??
                state.tick = tick_math::get_tick_at_sqrt_ratio(state.price)?;
            }
        }

        // write state
        // update price and tick
        self.sqrt_price.set(state.price);
        if state.tick != self.cur_tick.get().unwrap() {
            self.cur_tick.set(I32::unchecked_from(state.tick));
        }

        // update liquidity
        if self.liquidity.get().unwrap() != state.liquidity {
            self.liquidity.set(U128::wrap(&state.liquidity));
        }

        // update fees
        if zero_for_one {
            self.fee_growth_global_0.set(state.fee_growth_global);
            if state.protocol_fee > 0 {
                let new_protocol_fee = self.protocol_fee_0.get() + U128::wrap(&state.protocol_fee);
                self.protocol_fee_0.set(new_protocol_fee);
            }
        } else {
            self.fee_growth_global_1.set(state.fee_growth_global);
            if state.protocol_fee > 0 {
                let new_protocol_fee = self.protocol_fee_1.get() + U128::wrap(&state.protocol_fee);
                self.protocol_fee_1.set(new_protocol_fee);
            }
        }

        let (amount_0, amount_1) = match zero_for_one == exact_in {
            true => (amount - state.amount_remaining, state.amount_calculated),
            false => (state.amount_calculated, amount - state.amount_remaining),
        };

        Ok((amount_0, amount_1))
    }
}
