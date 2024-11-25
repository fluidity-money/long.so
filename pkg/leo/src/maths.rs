use stylus_sdk::alloy_primitives::U256;

use crate::{error::Error, immutables::SCALING_FACTOR};

pub fn calc_rewards(
    pool_liq: U256,
    token_per_sec: U256,
    secs_since: U256,
    position_liq: U256,
) -> Result<U256, Error> {
    // (position lp token / global lp token) * campaign per sec * secs_since start
    let scaled_pos_liq = position_liq
        .checked_mul(SCALING_FACTOR)
        .ok_or(Error::CheckedMul)?;
    let share_of_campaign = scaled_pos_liq
        .checked_div(pool_liq)
        .ok_or(Error::CheckedMul)?;
    token_per_sec
        .checked_mul(share_of_campaign)
        .ok_or(Error::CheckedMul)?
        .checked_mul(secs_since)
        .ok_or(Error::CheckedMul)?
        .checked_div(SCALING_FACTOR)
        .ok_or(Error::CheckedDiv)
}
