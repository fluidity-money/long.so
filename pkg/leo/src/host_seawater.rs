use stylus_sdk::alloy_primitives::{Address, U256};

use crate::host;

/// Collect yield, using the [collect_single_to_6_D_76575_F] function in Longtail.
pub fn collect_yield_single_to(
    pool: Address,
    id: U256,
    recipient: Address,
) -> Result<(u128, u128), Vec<u8>> {
    Ok((0, 0))
}

pub fn tick_lower(pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    Ok(host::position_tick_lower(id).unwrap())
}

pub fn tick_upper(pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    Ok(host::position_tick_upper(id).unwrap())
}

pub fn position_liquidity(pool: Address, id: U256) -> Result<u128, Vec<u8>> {
    Ok(host::position_liquidity(id).unwrap())
}
