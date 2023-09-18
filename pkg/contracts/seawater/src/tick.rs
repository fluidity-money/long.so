use crate::error::*;
use crate::maths::liquidity_math;
use crate::types::*;
use stylus_sdk::prelude::*;
use stylus_sdk::storage::*;

#[solidity_storage]
pub struct StorageTicks {
    pub ticks: StorageMap<i32, StorageTickInfo>,
}

#[solidity_storage]
pub struct StorageTickBitmap {
    pub bitmap: StorageMap<i16, StorageU256>,
}
impl StorageTickBitmap {
    pub fn flip(&mut self, tick: i32, spacing: u8) {
        todo!()
    }
}

#[solidity_storage]
#[derive(Erase)]
#[allow(unused)]
pub struct StorageTickInfo {
    liquidity_gross: StorageU128,
    liquidity_net: StorageI128,
    fee_growth_outside_0: StorageU256,
    fee_growth_outside_1: StorageU256,
    tick_cumulative_outside: StorageI64,
    seconds_per_liquidity_outside: StorageU160,
    seconds_outside: StorageU32,
    initialised: StorageBool,
}

impl StorageTicks {
    #[allow(unused)]
    pub fn update(
        &mut self,
        tick: i32,
        cur_tick: i32,
        liquidity_delta: i128,
        fee_growth_global_0: U256,
        fee_growth_global_1: U256,
        seconds_per_liquidity: U160,
        tick_cumulative: i64,
        time: u32,
        upper: bool,
        max_liquidity: u128,
    ) -> Result<bool, UniswapV3MathError> {
        let mut info = self.ticks.setter(tick);

        let liquidity_gross_before = info.liquidity_gross.get().unwrap();
        let liquidity_gross_after =
            liquidity_math::add_delta(liquidity_gross_before, liquidity_delta)?;

        if liquidity_gross_after > max_liquidity {
            return Err(UniswapV3MathError::LiquidityTooHigh);
        }

        // if we moved to or from 0 liquidity, flip the tick
        let tick_flipped = (liquidity_gross_after == 0) != (liquidity_gross_before == 0);

        if liquidity_gross_before == 0 {
            // initialise ourself

            if tick <= cur_tick {
                info.fee_growth_outside_0.set(fee_growth_global_0);
                info.fee_growth_outside_1.set(fee_growth_global_1);
                info.seconds_per_liquidity_outside
                    .set(seconds_per_liquidity);
                info.tick_cumulative_outside
                    .set(I64::unchecked_from(tick_cumulative));
                info.seconds_outside.set(U32::from_limbs([time.into()]));
            }
            info.initialised.set(true);
        }

        info.liquidity_gross.set(U128::wrap(&liquidity_gross_after));

        let new_liquidity_net = match upper {
            true => info
                .liquidity_net
                .get()
                .checked_sub(I128::wrap(&liquidity_delta))
                .ok_or(UniswapV3MathError::LiquiditySub),
            false => info
                .liquidity_net
                .get()
                .checked_add(I128::wrap(&liquidity_delta))
                .ok_or(UniswapV3MathError::LiquidityAdd),
        }?;

        info.liquidity_net.set(new_liquidity_net);

        Ok(tick_flipped)
    }

    // the fee growth inside this tick is the total fee
    // growth, minus the fee growth outside this tick
    pub fn get_fee_growth_inside(
        &mut self,
        lower_tick: i32,
        upper_tick: i32,
        cur_tick: i32,
        fee_growth_global_0: U256,
        fee_growth_global_1: U256,
    ) -> Result<(U256, U256), UniswapV3MathError> {
        let lower = self.ticks.get(lower_tick);
        let upper = self.ticks.get(upper_tick);

        let (fee_growth_below_0, fee_growth_below_1) = if cur_tick >= lower_tick {
            (
                lower.fee_growth_outside_0.get(),
                lower.fee_growth_outside_1.get(),
            )
        } else {
            (
                fee_growth_global_0
                    .checked_sub(lower.fee_growth_outside_0.get())
                    .ok_or(UniswapV3MathError::FeeGrowthSub)?,
                fee_growth_global_1
                    .checked_sub(lower.fee_growth_outside_1.get())
                    .ok_or(UniswapV3MathError::FeeGrowthSub)?,
            )
        };

        let (fee_growth_above_0, fee_growth_above_1) = if cur_tick < upper_tick {
            (
                upper.fee_growth_outside_0.get(),
                upper.fee_growth_outside_1.get(),
            )
        } else {
            (
                fee_growth_global_0
                    .checked_sub(upper.fee_growth_outside_0.get())
                    .ok_or(UniswapV3MathError::FeeGrowthSub)?,
                fee_growth_global_1
                    .checked_sub(upper.fee_growth_outside_1.get())
                    .ok_or(UniswapV3MathError::FeeGrowthSub)?,
            )
        };

        Ok((
            fee_growth_global_0
                .checked_sub(fee_growth_below_0)
                .and_then(|x| x.checked_sub(fee_growth_above_0))
                .ok_or(UniswapV3MathError::FeeGrowthSub)?,
            fee_growth_global_1
                .checked_sub(fee_growth_below_1)
                .and_then(|x| x.checked_sub(fee_growth_above_1))
                .ok_or(UniswapV3MathError::FeeGrowthSub)?,
        ))
    }

    pub fn cross(
        &mut self,
        tick: i32,
        fee_growth_global_0: U256,
        fee_growth_global_1: U256,
     ) -> i128 {
        let mut info = self.ticks.setter(tick);

        let new_fee_growth_outside_0 = fee_growth_global_0 - info.fee_growth_outside_0.get();
        info.fee_growth_outside_0.set(new_fee_growth_outside_0);


        let new_fee_growth_outside_1 = fee_growth_global_1 - info.fee_growth_outside_1.get();
        info.fee_growth_outside_1.set(new_fee_growth_outside_1);

        // update secondsPerLiquidityOutside
        // update tickCumulativeOutside
        // update secondsOutside

        info.liquidity_net.unwrap()
    }

    pub fn clear(&mut self, tick: i32) {
        // delete a tick
        self.ticks.delete(tick);
    }
}
