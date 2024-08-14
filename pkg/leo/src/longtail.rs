use stylus_sdk::alloy_primitives::{Address, I32, U256};

/// Collect yield, using the [collect_7_F21947_C] function in Longtail.
pub fn collect_yield_single_to(
    pool: Address,
    id: U256,
    recipient: Address,
) -> Result<(u128, u128), Vec<u8>> {
    Ok((0, 0))
}

pub fn tick_lower(pool: Address, id: U256) -> Result<I32, Vec<u8>> {
    panic!("shit")
}

pub fn tick_upper(pool: Address, id: U256) -> Result<I32, Vec<u8>> {
    panic!("shit")
}

pub fn position_liquidity(pool: Address, id: U256) -> Result<U256, Vec<u8>> {
    Ok(U256::ZERO)
}
