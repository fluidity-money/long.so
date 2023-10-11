use crate::error::*;
use crate::maths::full_math;
use crate::maths::liquidity_math;
use crate::types::Wrap;
use crate::types::{U256Extension, U128, U256, I32};
use stylus_sdk::prelude::*;
use stylus_sdk::storage::*;

#[solidity_storage]
pub struct StoragePositions {
    pub positions: StorageMap<U256, StoragePositionInfo>,
}
impl StoragePositions {
    pub fn new(
        &mut self,
        id: U256,
        low: i32,
        up: i32,
    ) {
        let mut info = self.positions.setter(id);
        info.lower.set(I32::wrap(&low));
        info.upper.set(I32::wrap(&up));
    }

    pub fn update(
        &mut self,
        id: U256,
        delta: i128,
        fee_growth_inside_0: U256,
        fee_growth_inside_1: U256,
    ) -> Result<(), UniswapV3MathError> {
        let mut info = self.positions.setter(id);

        let liquidity_next = liquidity_math::add_delta(info.liquidity.get().unwrap(), delta)?;

        let owed_fees_0 = full_math::mul_div(
            fee_growth_inside_0
                .checked_sub(info.fee_growth_inside_0.get())
                .ok_or(UniswapV3MathError::FeeGrowthSub)?,
            U256::from(info.liquidity.get()),
            full_math::Q128,
        )?;

        let owed_fees_1 = full_math::mul_div(
            fee_growth_inside_1
                .checked_sub(info.fee_growth_inside_1.get())
                .ok_or(UniswapV3MathError::FeeGrowthSub)?,
            U256::from(info.liquidity.get()),
            full_math::Q128,
        )?;

        // update storage
        if delta != 0 {
            info.liquidity.set(U128::wrap(&liquidity_next));
        }
        info.fee_growth_inside_0.set(fee_growth_inside_0);
        info.fee_growth_inside_1.set(fee_growth_inside_1);
        if !owed_fees_0.is_zero() || !owed_fees_1.is_zero() {
            // overflow is the user's problem, they should withdraw earlier
            let new_fees_0 = info
                .token_owed_0
                .get()
                .wrapping_add(U128::wrapping_from(owed_fees_0));
            info.token_owed_0.set(new_fees_0);

            let new_fees_1 = info
                .token_owed_1
                .get()
                .wrapping_add(U128::wrapping_from(owed_fees_1));
            info.token_owed_1.set(new_fees_1);
        }

        Ok(())
    }
    pub fn collect_fees(
        &mut self,
        id: U256,
        amount_0: u128,
        amount_1: u128,
    ) -> (u128, u128) {
        let mut position = self.positions.setter(id);

        let owed_0 = position.token_owed_0.get().unwrap();
        let owed_1 = position.token_owed_1.get().unwrap();

        let amount_0 = u128::min(amount_0, owed_0);
        let amount_1 = u128::min(amount_1, owed_1);

        if amount_0 > 0 {
            position.token_owed_0.set(U128::wrap(&(owed_0 - amount_0)));
        }
        if amount_1 > 0 {
            position.token_owed_1.set(U128::wrap(&(owed_1 - amount_1)));
        }

        (amount_0, amount_1)
    }
}

#[solidity_storage]
pub struct StoragePositionInfo {
    pub lower: StorageI32,
    pub upper: StorageI32,
    pub liquidity: StorageU128,
    pub fee_growth_inside_0: StorageU256,
    pub fee_growth_inside_1: StorageU256,
    pub token_owed_0: StorageU128,
    pub token_owed_1: StorageU128,
}

