#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(test, feature(lazy_cell, const_trait_impl))]

pub mod error;
pub mod maths;
pub mod position;
pub mod test_shims;
pub mod tick;
pub mod types;

use alloc::vec::Vec;
use maths::{full_math, liquidity_math, sqrt_price_math, swap_math, tick_bitmap, tick_math};
use stylus_sdk::{prelude::*, storage::*};
use types::{Address, I256Extension, Wrap, I256, I32, U128, U256, U32, U8};

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
    max_liquidity_per_tick: StorageU128,

    // packed token0[4], token1[4]
    fee_protocol: StorageU8,
    fee_growth_global_0: StorageU256,
    fee_growth_global_1: StorageU256,
    protocol_fee_0: StorageU128,
    protocol_fee_1: StorageU128,

    liquidity: StorageU128,
    cur_tick: StorageI32,
    sqrt_price: StorageU256,

    positions: position::StoragePositions,

    ticks: tick::StorageTicks,
    tick_bitmap: tick::StorageTickBitmap,
}

impl StoragePool {
    pub fn update_position_internal(
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
            &self.fee_growth_global_0.get(),
            &self.fee_growth_global_1.get(),
            false,
            self.max_liquidity_per_tick.get().unwrap(),
        )?;

        let flip_upper = self.ticks.update(
            lower,
            self.cur_tick.get().unwrap(),
            delta,
            &self.fee_growth_global_0.get(),
            &self.fee_growth_global_1.get(),
            true,
            self.max_liquidity_per_tick.get().unwrap(),
        )?;

        // update the position
        let (fee_growth_inside_0, fee_growth_inside_1) = self.ticks.get_fee_growth_inside(
            lower,
            upper,
            self.cur_tick.get().unwrap(),
            &self.fee_growth_global_0.get(),
            &self.fee_growth_global_1.get(),
        )?;

        self.positions.update(
            position::StoragePositionKey {
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
                let new_liquidity =
                    liquidity_math::add_delta(self.liquidity.get().unwrap(), delta)?;
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

    pub fn swap_internal(
        &mut self,
        zero_for_one: bool,
        amount: I256,
        price_limit: U256,
    ) -> Result<(I256, I256), Revert> {
        // ensure the price limit is within bounds
        match zero_for_one {
            true => assert!(
                price_limit < self.sqrt_price.get() && price_limit > tick_math::MIN_SQRT_RATIO
            ),
            false => assert!(
                price_limit > self.sqrt_price.get() && price_limit < tick_math::MAX_SQRT_RATIO
            ),
        };

        // is the swap exact in or exact out
        let exact_in = amount > I256::zero();

        // select either the high or low 4 bits
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

        // continue swapping while there's tokens left to swap
        // and we haven't reached the price limit
        while !state.amount_remaining.is_zero() && state.price != price_limit {
            let step_initial_price = state.price;
            let (step_next_tick, step_next_tick_initialised) =
                tick_bitmap::next_initialized_tick_within_one_word(
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
            let (next_sqrt_price, step_amount_in, step_amount_out, mut step_fee_amount) =
                swap_math::compute_swap_step(
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
                    state.amount_remaining -=
                        I256::unchecked_from(step_amount_in + step_fee_amount);
                    state.amount_calculated -= I256::unchecked_from(step_amount_out);
                }
                false => {
                    state.amount_remaining += I256::unchecked_from(step_amount_out);
                    state.amount_remaining +=
                        I256::unchecked_from(step_amount_in + step_fee_amount);
                }
            }

            // set fees
            if fee_protocol > 0 {
                let delta = step_fee_amount.wrapping_div(U256::from(fee_protocol));
                step_fee_amount -= delta;
                state.protocol_fee += u128::try_from(delta).unwrap();
            }

            // update fees
            if state.liquidity > 0 {
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

                    let liquidity_net = self.ticks.cross(step_next_tick, &fee_0, &fee_1);

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

    pub fn collect_protocol_internal(&mut self, amount_0: u128, amount_1: u128) -> (u128, u128) {
        let owed_0 = self.protocol_fee_0.get().unwrap();
        let owed_1 = self.protocol_fee_1.get().unwrap();

        let amount_0 = u128::min(amount_0, owed_0);
        let amount_1 = u128::min(amount_1, owed_1);

        if amount_0 > 0 {
            self.protocol_fee_0.set(U128::wrap(&(owed_0 - amount_0)));
        }
        if amount_1 > 1 {
            self.protocol_fee_1.set(U128::wrap(&(owed_1 - amount_1)));
        }

        (amount_0, amount_1)
    }
}

#[external]
impl StoragePool {
    pub fn init(
        &mut self,
        price: U256,
        fee: u32,
        tick_spacing: u8,
        max_liquidity_per_tick: u128,
    ) -> Result<(), Revert> {
        self.sqrt_price.set(price);
        self.cur_tick
            .set(I32::wrap(&tick_math::get_tick_at_sqrt_ratio(price)?));

        self.fee.set(U32::wrap(&fee));
        self.tick_spacing.set(U8::wrap(&tick_spacing));
        self.max_liquidity_per_tick
            .set(U128::wrap(&max_liquidity_per_tick));

        Ok(())
    }

    pub fn update_position(
        &mut self,
        owner: Address,
        lower: i32,
        upper: i32,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        let (token_0_delta, token_1_delta) =
            self.update_position_internal(owner, lower, upper, delta)?;

        // TODO transfer tokens

        Ok((token_0_delta, token_1_delta))
    }

    pub fn swap(
        &mut self,
        zero_for_one: bool,
        amount: I256,
        price_limit: U256,
    ) -> Result<(I256, I256), Revert> {
        let (token_0_delta, token_1_delta) =
            self.swap_internal(zero_for_one, amount, price_limit)?;

        // TODO transfer tokens

        Ok((token_0_delta, token_1_delta))
    }

    pub fn collect(
        &mut self,
        owner: Address,
        lower: i32,
        upper: i32,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        let (owed_0, owed_1) = self.positions.collect_fees(
            position::StoragePositionKey {
                address: owner,
                lower,
                upper,
            },
            amount_1,
            amount_1,
        );

        // TODO transfer tokens

        Ok((owed_0, owed_1))
    }

    pub fn collect_protocol(
        &mut self,
        _recipient: Address,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        let (owed_0, owed_1) = self.collect_protocol_internal(amount_0, amount_1);

        // TODO transfer

        Ok((owed_0, owed_1))
    }

    pub fn swap_exact_0_for_1(
        &mut self,
        amount_0_in: I256,
        limit: U256,
    ) -> Result<(I256, I256), Revert> {
        self.swap(true, amount_0_in, limit)
    }
    pub fn swap_0_for_exact_1(
        &mut self,
        amount_1_out: I256,
        limit: U256,
    ) -> Result<(I256, I256), Revert> {
        self.swap(true, -amount_1_out, limit)
    }
    pub fn swap_exact_1_for_0(
        &mut self,
        amount_1_in: I256,
        limit: U256,
    ) -> Result<(I256, I256), Revert> {
        self.swap(false, amount_1_in, limit)
    }
    pub fn swap_1_for_exact_0(
        &mut self,
        amount_0_out: I256,
        limit: U256,
    ) -> Result<(I256, I256), Revert> {
        self.swap(false, -amount_0_out, limit)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use sqrt_price_math::Q96;
    use stylus_sdk::alloy_primitives::address;
    use types::*;

    // encodes a a/b price as a sqrt.q96 price
    fn encode_sqrt_price(num: u64, denom: u64) -> U256 {
        let num = U256::from(num);
        let denom = U256::from(denom);

        let ratio = num * Q96 / denom;

        // newton's method
        let mut g = U256::one() * Q96;
        let two = U256::from(2);
        for _ in 0..1000000 {
            let g_new = (g + (ratio * Q96 / g)) / two;
            if g_new == g {
                return g;
            }
            g = g_new;
        }

        panic!("encode_sqrt_price did not converge after 1000000 iters")
    }

    // splits a q96 fixed point into whole and fractional components
    fn split_q96(val: U256) -> (U256, U256) {
        (val >> 96, val % Q96)
    }

    #[test]
    fn test_encode_sqrt_price() {
        let price = encode_sqrt_price(16, 1);
        assert_eq!(split_q96(price), (U256::from(4), U256::from(0)));

        let price = encode_sqrt_price(4, 1);
        assert_eq!(split_q96(price), (U256::from(2), U256::from(0)));

        let price = encode_sqrt_price(10, 1);
        assert_eq!(split_q96(price).0, U256::from(3));
    }

    // this is probably unsound! we don't ensure a real lock on storage
    fn with_storage<T, F: FnOnce(&mut StoragePool) -> T>(f: F) -> T {
        let mut storage = unsafe { <StoragePool as StorageType>::new(U256::ZERO, 0) };
        let res = f(&mut storage);
        stylus_sdk::storage::StorageCache::flush();
        test_shims::log_storage();
        test_shims::reset_storage();

        res
    }

    #[test]
    fn test_update_position() {
        with_storage(|storage| {
            storage
                .init(encode_sqrt_price(1, 10), 0, 1, u128::MAX)
                .unwrap();
            assert_eq!(
                storage.update_position(
                    address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
                    tick_math::get_min_tick(1),
                    tick_math::get_max_tick(1),
                    3161,
                ),
                Ok((I256::unchecked_from(9996), I256::unchecked_from(1000))),
            );
        });
    }

    #[test]
    fn test_swap() -> Result<(), Revert> {
        with_storage(|storage| {
            storage.init(encode_sqrt_price(100, 1), 0, 1, u128::MAX)?;

            storage.update_position(
                address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
                tick_math::get_tick_at_sqrt_ratio(encode_sqrt_price(50, 1))?,
                tick_math::get_tick_at_sqrt_ratio(encode_sqrt_price(150, 1))?,
                100,
            )?;

            storage.update_position(
                address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
                tick_math::get_tick_at_sqrt_ratio(encode_sqrt_price(80, 1))?,
                tick_math::get_tick_at_sqrt_ratio(encode_sqrt_price(150, 1))?,
                100,
            )?;

            storage.swap_exact_0_for_1(I256::unchecked_from(10), encode_sqrt_price(60, 1))?;

            storage.swap_exact_1_for_0(I256::unchecked_from(10), encode_sqrt_price(120, 1))?;

            storage.swap_0_for_exact_1(I256::unchecked_from(10), encode_sqrt_price(60, 1))?;

            storage.swap_1_for_exact_0(I256::unchecked_from(10000), encode_sqrt_price(120, 1))?;

            Ok(())
        })
    }
}
