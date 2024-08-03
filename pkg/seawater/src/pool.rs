//! The [StoragePool] struct, containing most of the core AMM functions.

use crate::error::Error;
use crate::maths::{full_math, liquidity_math, sqrt_price_math, swap_math, tick_bitmap, tick_math};
use crate::position;
use crate::tick;
use crate::types::{I256Extension, U256Extension, WrappedNative, I256, I32, U128, U256, U32, U8};
use alloc::vec::Vec;
use stylus_sdk::{prelude::*, storage::*};

use num_traits::ToPrimitive;

#[cfg(all(not(target_arch = "wasm32"), feature = "testing"))]
use crate::test_utils;

#[cfg(feature = "testing-dbg")]
use crate::current_test;

type Revert = Vec<u8>;

/// The storage type for an AMM pool.
#[solidity_storage]
pub struct StoragePool {
    enabled: StorageBool,
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
    /// Creates and initialises a new pool.
    pub fn init(
        &mut self,
        price: U256,
        fee: u32,
        tick_spacing: u8,
        max_liquidity_per_tick: u128,
    ) -> Result<(), Revert> {
        assert_eq_or!(
            self.sqrt_price.get(),
            U256::ZERO,
            Error::PoolAlreadyInitialised
        );

        self.sqrt_price.set(price);
        self.cur_tick
            .set(I32::lib(&tick_math::get_tick_at_sqrt_ratio(price)?));

        self.fee.set(U32::lib(&fee));
        self.tick_spacing.set(U8::lib(&tick_spacing));
        self.max_liquidity_per_tick
            .set(U128::lib(&max_liquidity_per_tick));

        Ok(())
    }

    /// Creates a new position in this pool.
    pub fn create_position(&mut self, id: U256, low: i32, up: i32) -> Result<(), Revert> {
        assert_or!(self.enabled.get(), Error::PoolDisabled);
        let spacing = self.tick_spacing.get().sys() as i32;
        assert_or!(low % spacing == 0, Error::InvalidTickSpacing);
        assert_or!(up % spacing == 0, Error::InvalidTickSpacing);
        let spacing: u8 = spacing.try_into().map_err(|_| Error::InvalidTickSpacing)?;
        let min_tick = tick_math::get_min_tick(spacing);
        let max_tick = tick_math::get_max_tick(spacing);
        assert_or!(low >= min_tick && low <= max_tick, Error::InvalidTick);
        assert_or!(up >= min_tick && up <= max_tick, Error::InvalidTick);
        Ok(self.positions.new(id, low, up))
    }

    /// Updates a position in this pool, refreshing fees earned and updating liquidity.
    pub fn update_position(&mut self, id: U256, delta: i128) -> Result<(I256, I256), Revert> {
        // the pool must be enabled
        assert_or!(self.enabled.get(), Error::PoolDisabled);

        let position = self.positions.positions.get(id);
        let lower = position.lower.get().sys();
        let upper = position.upper.get().sys();

        // update the ticks
        let cur_tick = self.cur_tick.get().sys();
        let fee_growth_global_0 = self.fee_growth_global_0.get();
        let fee_growth_global_1 = self.fee_growth_global_1.get();
        let max_liquidity_per_tick = self.max_liquidity_per_tick.get().sys();

        let flip_lower = self.ticks.update(
            lower,
            cur_tick,
            delta,
            &fee_growth_global_0,
            &fee_growth_global_1,
            false,
            max_liquidity_per_tick,
        )?;

        let flip_upper = self.ticks.update(
            upper,
            cur_tick,
            delta,
            &fee_growth_global_0,
            &fee_growth_global_1,
            true,
            max_liquidity_per_tick,
        )?;

        // update the position
        let (fee_growth_inside_0, fee_growth_inside_1) = self.ticks.get_fee_growth_inside(
            lower,
            upper,
            self.cur_tick.get().sys(),
            &self.fee_growth_global_0.get(),
            &self.fee_growth_global_1.get(),
        )?;

        self.positions
            .update(id, delta, fee_growth_inside_0, fee_growth_inside_1)?;

        // clear unneeded storage
        if flip_lower {
            self.tick_bitmap.flip(lower, self.tick_spacing.get().sys());
            if delta < 0 {
                self.ticks.clear(lower);
            }
        }
        if flip_upper {
            self.tick_bitmap.flip(upper, self.tick_spacing.get().sys());
            if delta < 0 {
                self.ticks.clear(upper);
            }
        }

        // calculate liquidity change and the amount of each token we need
        if delta == 0 {
            Ok((I256::zero(), I256::zero()))
        } else {
            let (amount_0, amount_1) = if self.cur_tick.get().sys() < lower {
                #[cfg(feature = "testing-dbg")]
                dbg!((
                    "update_position, cur_tick < lower path",
                    lower,
                    upper,
                    tick_math::get_sqrt_ratio_at_tick(lower)?,
                    tick_math::get_sqrt_ratio_at_tick(upper)?,
                    self.sqrt_price.get(),
                    delta
                ));

                // we're below the range, we need to move right, we'll need more token0
                (
                    sqrt_price_math::get_amount_0_delta(
                        tick_math::get_sqrt_ratio_at_tick(lower)?,
                        tick_math::get_sqrt_ratio_at_tick(upper)?,
                        delta,
                    )?,
                    I256::zero(),
                )
            } else if self.cur_tick.get().sys() < upper {
                // we're inside the range, the liquidity is active and we need both tokens
                let new_liquidity = liquidity_math::add_delta(self.liquidity.get().sys(), delta)?;

                #[cfg(feature = "testing-dbg")]
                dbg!((
                    "update_position, cur_tick < upper path",
                    lower,
                    upper,
                    tick_math::get_sqrt_ratio_at_tick(lower)?.to_string(),
                    tick_math::get_sqrt_ratio_at_tick(upper)?.to_string(),
                    self.sqrt_price.get().to_string(),
                    delta,
                    self.liquidity.get().sys(),
                    new_liquidity
                ));

                self.liquidity.set(U128::lib(&new_liquidity));

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
                #[cfg(feature = "testing-dbg")]
                dbg!((
                    "update_position, else",
                    lower,
                    upper,
                    tick_math::get_sqrt_ratio_at_tick(lower)?,
                    tick_math::get_sqrt_ratio_at_tick(upper)?,
                    self.sqrt_price.get(),
                    delta,
                ));

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
        }
    }

    pub fn adjust_position(
        &mut self,
        id: U256,
        amount_0: U256,
        amount_1: U256,
        giving: bool,
    ) -> Result<(I256, I256), Revert> {
        // calculate the delta using the amounts that we have here, guaranteeing
        // that we don't dip below the amount that's supplied as the minimum.

        let position = self.positions.positions.get(id);

        let sqrt_ratio_x_96 = tick_math::get_sqrt_ratio_at_tick(self.get_cur_tick().as_i32())?;
        let sqrt_ratio_a_x_96 = tick_math::get_sqrt_ratio_at_tick(position.lower.get().as_i32())?;
        let sqrt_ratio_b_x_96 = tick_math::get_sqrt_ratio_at_tick(position.upper.get().as_i32())?;

        let mut delta = sqrt_price_math::get_liquidity_for_amounts(
            sqrt_ratio_x_96,   // cur_tick
            sqrt_ratio_a_x_96, // lower_tick
            sqrt_ratio_b_x_96, // upper_tick
            amount_0,          // amount_0
            amount_1,          // amount_1
        )?
        .to_i128()
        .map_or_else(|| Err(Error::LiquidityAmountTooWide), |v| Ok(v))?;

        if giving {
            // If we're giving, then we need to take from the delta.
            delta = -delta;
        }

        #[cfg(feature = "testing-dbg")]
        dbg!((
            "inside adjust_position",
            current_test!(),
            sqrt_ratio_x_96.to_string(),
            sqrt_ratio_a_x_96.to_string(),
            sqrt_ratio_b_x_96.to_string(),
            amount_0.to_string(),
            amount_1.to_string(),
            delta
        ));

        // [update_position] should also ensure that we don't do this on a pool that's not currently
        // running

        self.update_position(id, delta)
    }

    /// Performs a swap on this pool.
    pub fn swap(
        &mut self,
        zero_for_one: bool,
        amount: I256,
        mut price_limit: U256,
    ) -> Result<(I256, I256, i32), Revert> {
        assert_or!(self.enabled.get(), Error::PoolDisabled);

        // ensure the price limit is within bounds
        match zero_for_one {
            true => {
                if price_limit == U256::MAX {
                    price_limit = tick_math::MIN_SQRT_RATIO + U256::one();
                }
                if price_limit >= self.sqrt_price.get() || price_limit <= tick_math::MIN_SQRT_RATIO
                {
                    Err(Error::PriceLimitTooLow)?;
                }
            }
            false => {
                if price_limit == U256::MAX {
                    price_limit = tick_math::MAX_SQRT_RATIO - U256::one();
                }
                if price_limit <= self.sqrt_price.get() || price_limit >= tick_math::MAX_SQRT_RATIO
                {
                    Err(Error::PriceLimitTooHigh)?;
                }
            }
        };
        // is the swap exact in or exact out
        let exact_in = amount > I256::zero();

        // select either the high or low 4 bits
        let fee_protocol = match zero_for_one {
            true => self.fee_protocol.get().sys() % 16,
            false => self.fee_protocol.get().sys() >> 4,
        };

        // group all our cached storage state into a struct
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
            tick: self.cur_tick.get().sys(),
            fee_growth_global: match zero_for_one {
                true => self.fee_growth_global_0.get(),
                false => self.fee_growth_global_1.get(),
            },
            protocol_fee: 0,
            liquidity: self.liquidity.get().sys(),
        };

        let fee = self.fee.get().sys();

        // continue swapping while there's tokens left to swap
        // and we haven't reached the price limit
        let mut iters = 0;
        while !state.amount_remaining.is_zero() && state.price != price_limit {
            iters += 1;
            debug_assert!(iters != 100, "swapping didn't resolve after 100 iters!");

            let step_initial_price = state.price;

            // find the next tick based on which direction we're swapping
            let (step_next_tick, step_next_tick_initialised) =
                tick_bitmap::next_initialized_tick_within_one_word(
                    &self.tick_bitmap.bitmap,
                    state.tick,
                    self.tick_spacing.get().sys().into(),
                    zero_for_one,
                )?;

            // make sure the next tick's within bounds
            let step_next_tick = step_next_tick.clamp(tick_math::MIN_TICK, tick_math::MAX_TICK);

            let step_next_price = tick_math::get_sqrt_ratio_at_tick(step_next_tick)?;

            // swap til the tick is reached or the price limit is reached or the in/out amount is
            // used
            // (price limits are checked in the while loop)
            let hit_limit = match zero_for_one {
                true => step_next_price < price_limit,
                false => step_next_price > price_limit,
            };
            let step_clamped_price = match hit_limit {
                true => price_limit,
                false => step_next_price,
            };

            // step_fee_amount is reduced by protocol fee later
            let (next_sqrt_price, step_amount_in, step_amount_out, mut step_fee_amount) =
                swap_math::compute_swap_step(
                    state.price,
                    step_clamped_price,
                    state.liquidity,
                    state.amount_remaining,
                    fee,
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
                    state.amount_calculated +=
                        I256::unchecked_from(step_amount_in + step_fee_amount);
                }
            }

            // set fees
            if fee_protocol > 0 {
                let delta = step_fee_amount.wrapping_div(U256::from(fee_protocol));
                step_fee_amount -= delta;
                state.protocol_fee += u128::try_from(delta).or(Err(Error::FeeTooHigh))?;
            }

            // update fees
            if state.liquidity > 0 {
                // normalise fee growth
                state.fee_growth_global += full_math::mul_div(
                    step_fee_amount,
                    full_math::Q128,
                    U256::from(state.liquidity),
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
                // recompute tick in case we've moved past ticks with no liquidity
                state.tick = tick_math::get_tick_at_sqrt_ratio(state.price)?;
            }
        }

        // write state
        // update price and tick
        self.sqrt_price.set(state.price);
        if state.tick != self.cur_tick.get().sys() {
            self.cur_tick.set(I32::unchecked_from(state.tick));
        }

        // update liquidity
        if self.liquidity.get().sys() != state.liquidity {
            self.liquidity.set(U128::lib(&state.liquidity));
        }

        // update fees
        if fee != 0 {
            match zero_for_one {
                true => {
                    self.fee_growth_global_0.set(state.fee_growth_global);
                    if state.protocol_fee > 0 {
                        let new_protocol_fee =
                            self.protocol_fee_0.get() + U128::lib(&state.protocol_fee);
                        self.protocol_fee_0.set(new_protocol_fee);
                    }
                }
                false => {
                    self.fee_growth_global_1.set(state.fee_growth_global);
                    if state.protocol_fee > 0 {
                        let new_protocol_fee =
                            self.protocol_fee_1.get() + U128::lib(&state.protocol_fee);
                        self.protocol_fee_1.set(new_protocol_fee);
                    }
                }
            }
        }

        let token0_is_input = (zero_for_one && exact_in) || (!zero_for_one && !exact_in);
        let (amount_0, amount_1) = match token0_is_input {
            true => (amount - state.amount_remaining, state.amount_calculated),
            false => (state.amount_calculated, amount - state.amount_remaining),
        };

        Ok((amount_0, amount_1, state.tick))
    }

    /// Collects protocol (admin) fees.
    pub fn collect_protocol(
        &mut self,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        assert_or!(self.enabled.get(), Error::PoolDisabled);

        let owed_0 = self.protocol_fee_0.get().sys();
        let owed_1 = self.protocol_fee_1.get().sys();

        let amount_0 = u128::min(amount_0, owed_0);
        let amount_1 = u128::min(amount_1, owed_1);

        if amount_0 > 0 {
            self.protocol_fee_0.set(U128::lib(&(owed_0 - amount_0)));
        }
        if amount_1 > 0 {
            self.protocol_fee_1.set(U128::lib(&(owed_1 - amount_1)));
        }

        Ok((amount_0, amount_1))
    }

    /// Collects fees earned by a liquidity provider.
    pub fn collect(&mut self, id: U256) -> Result<(u128, u128), Revert> {
        assert_or!(self.enabled.get(), Error::PoolDisabled);
        Ok(self.positions.collect_fees(id))
    }

    /// Returns the amount of liquidity in a position.
    pub fn get_position_liquidity(&self, id: U256) -> U128 {
        self.positions.positions.getter(id).liquidity.get()
    }

    /// Gets the current pool price.
    pub fn get_sqrt_price(&self) -> U256 {
        self.sqrt_price.get()
    }

    /// Get the current tick.
    pub fn get_cur_tick(&self) -> I32 {
        self.cur_tick.get()
    }

    ///! Get a position given. This is a helper function for testing.
    pub fn get_position(&self, id: U256) -> StorageGuard<'_, position::StoragePositionInfo> {
        self.positions.positions.get(id)
    }

    pub fn get_fees_owed(&self, id: U256) -> (u128, u128) {
        self.positions.fees_owed(id)
    }

    /// Get the tick spacing for the pool given.
    pub fn get_tick_spacing(&self) -> U8 {
        self.tick_spacing.get()
    }

    /// Get the global fee growth for token0.
    pub fn get_fee_growth_global_0(&self) -> U256 {
        self.fee_growth_global_0.get()
    }

    /// Get the current fee growth for token1 (fUSDC.)
    pub fn get_fee_growth_global_1(&self) -> U256 {
        self.fee_growth_global_1.get()
    }

    /// Enables or disables the pool.
    pub fn set_enabled(&mut self, enabled: bool) {
        self.enabled.set(enabled)
    }

    pub fn get_enabled(&self) -> bool {
        self.enabled.get()
    }
}

#[cfg(all(not(target_arch = "wasm32"), feature = "testing"))]
impl test_utils::StorageNew for StoragePool {
    fn new(i: U256, v: u8) -> Self {
        unsafe { <Self as stylus_sdk::storage::StorageType>::new(i, v) }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::test_utils;
    use ruint_macro::uint;

    #[test]
    fn test_update_position() {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |storage| {
            storage
                .init(test_utils::encode_sqrt_price(1, 10), 0, 1, u128::MAX)
                .unwrap();

            let id = uint!(2_U256);

            storage
                .create_position(id, tick_math::get_min_tick(1), tick_math::get_max_tick(1))
                .unwrap();

            assert_eq!(
                storage.update_position(id, 3161),
                Ok((I256::unchecked_from(9996), I256::unchecked_from(1000))),
            );
        });
    }

    #[test]
    fn test_update_position_2() {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |storage| {
            storage
                .init(test_utils::encode_sqrt_price(1, 10), 0, 1, u128::MAX)
                .unwrap();

            let id = uint!(2_U256);

            storage.create_position(id, -874753, -662914).unwrap();

            assert_eq!(
                storage.update_position(id, 24703680000000000000000),
                Ok((I256::unchecked_from(0), I256::unchecked_from(99649663))),
            );
        });
    }

    #[test]
    fn test_swap() -> Result<(), Revert> {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |storage| {
            storage.init(
                test_utils::encode_sqrt_price(100, 1), // price
                0,
                1,
                u128::MAX,
            )?;

            let id = uint!(2_U256);
            storage
                .create_position(
                    id,
                    tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(50, 1))?,
                    tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(150, 1))?,
                )
                .unwrap();
            storage.update_position(id, 100)?;

            let id = uint!(3_U256);
            storage
                .create_position(
                    id,
                    tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(80, 1))?,
                    tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(150, 1))?,
                )
                .unwrap();
            storage.update_position(id, 100)?;

            storage.swap(
                true,
                I256::unchecked_from(-10),
                test_utils::encode_sqrt_price(60, 1),
            )?;

            storage.swap(
                true,
                I256::unchecked_from(10),
                test_utils::encode_sqrt_price(50, 1),
            )?;

            storage.swap(
                false,
                I256::unchecked_from(10),
                test_utils::encode_sqrt_price(120, 1),
            )?;

            storage.swap(
                false,
                I256::unchecked_from(-10000),
                test_utils::encode_sqrt_price(120, 1),
            )?;

            Ok(())
        })
    }

    #[test]
    fn test_pool_init_state() -> Result<(), Revert> {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |pool| {
            let price = test_utils::encode_sqrt_price(100, 1);

            pool.init(price, 2, 1, u128::MAX)?;

            assert_eq!(pool.enabled.get(), true);
            assert_eq!(pool.sqrt_price.get(), price);

            assert_eq!(
                pool.cur_tick.get(),
                I32::lib(&tick_math::get_tick_at_sqrt_ratio(price)?)
            );

            assert_eq!(pool.fee.get(), U32::lib(&2));

            assert_eq!(pool.tick_spacing.get(), U8::lib(&1));

            assert_eq!(pool.max_liquidity_per_tick.get(), U128::lib(&u128::MAX));

            Ok(())
        })
    }

    #[test]
    fn test_pool_init_reverts() -> Result<(), Revert> {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |storage| {
            match storage.init(uint!(1_U256), 0, 0, 0_u128) {
                Err(r) => assert_eq!(Error::R.to_string(), String::from_utf8(r).unwrap()),
                _ => panic!("expected R"),
            }

            match storage.init(test_utils::encode_sqrt_price(100, 1), 0, 1, u128::MAX) {
                Err(r) => assert_eq!(
                    Error::PoolAlreadyInitialised.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PoolAlreadyInitialised"),
            }
            Ok(())
        })
    }

    #[test]
    fn test_pool_swaps_reverts() {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |pool| {
            let sqrt_price = test_utils::encode_sqrt_price(1, 1);

            match pool.swap(true, I256::unchecked_from(1), sqrt_price) {
                Err(r) => assert_eq!(
                    Error::PoolDisabled.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PoolDisabled"),
            }

            pool.init(sqrt_price, 1, 1, u128::MAX).unwrap();

            match pool.swap(true, I256::unchecked_from(1), sqrt_price + U256::from(1)) {
                Err(r) => assert_eq!(
                    Error::PriceLimitTooLow.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PriceLimitTooLow"),
            }

            match pool.swap(true, I256::unchecked_from(1), tick_math::MIN_SQRT_RATIO) {
                Err(r) => assert_eq!(
                    Error::PriceLimitTooLow.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PriceLimitTooLow"),
            }

            match pool.swap(false, I256::unchecked_from(1), tick_math::MAX_SQRT_RATIO) {
                Err(r) => assert_eq!(
                    Error::PriceLimitTooHigh.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PriceLimitTooHigh"),
            }

            match pool.swap(false, I256::unchecked_from(1), sqrt_price - U256::from(1)) {
                Err(r) => assert_eq!(
                    Error::PriceLimitTooHigh.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PriceLimitTooHigh"),
            }
        });
    }

    #[test]
    fn test_pool_position_create() -> Result<(), Revert> {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |pool| {
            let id = uint!(2_U256);
            let low = tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(50, 1))?;
            let up = tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(150, 1))?;

            match pool.create_position(id, low, up) {
                Err(r) => assert_eq!(
                    Error::PoolDisabled.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PoolDisabled"),
            }

            pool.init(
                test_utils::encode_sqrt_price(100, 1), // price
                0,
                10,
                u128::MAX,
            )?;

            match pool.create_position(id, 11, 17) {
                Err(r) => assert_eq!(
                    Error::InvalidTickSpacing.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected InvalidTickSpacing"),
            }

            pool.create_position(id, low - low % 10, up - up % 10)?;

            let position_saved = pool.positions.positions.get(id);

            assert_eq!(position_saved.lower.get().as_i32(), low - low % 10);
            assert_eq!(position_saved.upper.get().as_i32(), up - up % 10);

            Ok(())
        })
    }

    #[test]
    fn test_pool_update_position_reverts() {
        test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |pool| {
            pool.init(test_utils::encode_sqrt_price(1, 10), 0, 1, u128::MAX)
                .unwrap();

            let id = uint!(2_U256);

            pool.create_position(id, tick_math::get_min_tick(1), tick_math::get_max_tick(1))
                .unwrap();

            pool.set_enabled(false);

            match pool.update_position(id, 3161) {
                Err(r) => assert_eq!(
                    Error::PoolDisabled.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PoolDisabled"),
            }

            match pool.update_position(id, 0) {
                Err(r) => assert_eq!(
                    Error::PoolDisabled.to_string(),
                    String::from_utf8(r).unwrap()
                ),
                _ => panic!("expected PoolDisabled"),
            }
        });
    }

    #[test]
    fn test_pool_update_position_parametric() {
        let init_prices: [[i64; 2]; 9] = [
            [10, 10],
            [10, 33],
            [10, 171],
            [10, 16_381],
            [10, 1_048_572],
            [33, 10],
            [171, 10],
            [16_381, 10],
            [1_048_572, 10],
        ];

        let position_ranges: [[i64; 2]; 3] = [[-20, -10], [-10, 10], [10, 20]];

        let position_delta: Vec<i128> = (1..=20).map(|d| d * 10i128.pow(18)).collect();

        for price in init_prices.iter() {
            for delta in position_delta.iter() {
                for position_range in position_ranges.iter() {
                    test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |pool| {
                        let init_price = test_utils::encode_sqrt_price(
                            price[0].unsigned_abs(),
                            price[1].unsigned_abs(),
                        );

                        let position_prices = [
                            price[0] + price[0] * position_range[0] / 100,
                            price[0] + price[0] * position_range[1] / 100,
                        ];

                        let low = tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(
                            position_prices[0].unsigned_abs(),
                            price[1].unsigned_abs(),
                        ))
                        .unwrap();

                        let up = tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(
                            position_prices[1].unsigned_abs(),
                            price[1].unsigned_abs(),
                        ))
                        .unwrap();

                        pool.init(init_price, 3000, 60 as u8, u128::MAX).unwrap();

                        let id = uint!(2_U256);

                        let low_padded = low - low % 60;
                        let up_padded = up - up % 60;

                        pool.create_position(id, low_padded, up_padded).unwrap();

                        let liqudity = pool.liquidity.get().sys();

                        let (u0, u1) = pool.update_position(id, *delta).unwrap();

                        if position_prices[0] < price[0] && price[0] < position_prices[1] {
                            assert!(u0.gt(&I256::zero()));
                            assert!(u1.gt(&I256::zero()));
                            assert!(pool.liquidity.get().sys() - liqudity > 0);
                            pool.update_position(id, -delta).unwrap();
                            assert!(pool.liquidity.get().sys() == 0);
                        } else {
                            assert!(pool.liquidity.get().sys() - liqudity == 0);
                        }
                    });
                }
            }
        }
    }

    #[test]
    fn test_swap_inside_liq_range() -> Result<(), Revert> {
        let pos_id = uint!(777_U256);

        let delta = 10i128.pow(18);

        let init_price = test_utils::encode_sqrt_price(100_000, 1_000);

        let liq_price_inside = [50_000, 150_000];

        //Swap up to 1% of the liquidity
        let swap_amounts: Vec<i128> = (1..=10).map(|p| p * delta / 1_000).collect();

        for swap_amount in &swap_amounts {
            // Price inside liquidity range
            test_utils::with_storage::<_, StoragePool, _>(None, None, None, None, |pool| {
                pool.init(init_price, 3000, 60, u128::MAX).unwrap();

                let lower = tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(
                    liq_price_inside[0],
                    1_000,
                ))
                .unwrap();

                let upper = tick_math::get_tick_at_sqrt_ratio(test_utils::encode_sqrt_price(
                    liq_price_inside[1],
                    1_000,
                ))
                .unwrap();

                pool.create_position(pos_id, lower - lower % 60, upper - upper % 60)
                    .unwrap();

                pool.update_position(pos_id, delta).unwrap();

                let (a0, _a1, _final_tick) = pool
                    .swap(true, I256::unchecked_from(*swap_amount), U256::MAX)
                    .unwrap();

                assert!(a0 == I256::unchecked_from(*swap_amount));
            });
        }

        Ok(())
    }
}
