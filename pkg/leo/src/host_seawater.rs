use stylus_sdk::alloy_primitives::{Address, U256};

use crate::host;

/// Collect yield, using the [collect_single_to_6_D_76575_F] function in Longtail.
pub fn collect_yield_single_to(
    _pool: Address,
    _id: U256,
    _recipient: Address,
) -> Result<(u128, u128), Vec<u8>> {
    Ok((0, 0))
}

pub fn tick_lower(_pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    Ok(host::position_tick_lower(id).unwrap())
}

pub fn tick_upper(_pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    Ok(host::position_tick_upper(id).unwrap())
}

pub fn position_liquidity(_pool: Address, id: U256) -> Result<u128, Vec<u8>> {
    Ok(host::position_liquidity(id).unwrap())
}
