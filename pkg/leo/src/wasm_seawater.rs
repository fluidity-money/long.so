use stylus_sdk::{
    alloy_primitives::{Address, U256},
    call::RawCall,
};

use crate::{calldata::*, calldata_seawater::*, error::Error, immutables::SEAWATER_ADDR};

/// Collect yield, using the [collect_single_to_6_D_76575_F] function in Longtail.
pub fn collect_yield_single_to(
    pool: Address,
    id: U256,
    recipient: Address,
) -> Result<(u128, u128), Vec<u8>> {
    unpack_u128_double(&RawCall::new().call(
        SEAWATER_ADDR,
        &pack_collect_yield_single_to(pool, id, recipient),
    )?)
    .ok_or(Error::SeawaterDecode.into())
}

pub fn tick_lower(pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    unpack_i32(&RawCall::new().call(SEAWATER_ADDR, &pack_tick_lower(pool, id))?)
        .ok_or(Error::SeawaterDecode.into())
}

pub fn tick_upper(pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    unpack_i32(&RawCall::new().call(SEAWATER_ADDR, &pack_tick_upper(pool, id))?)
        .ok_or(Error::SeawaterDecode.into())
}

pub fn position_liquidity(pool: Address, id: U256) -> Result<u128, Vec<u8>> {
    unpack_u128(&RawCall::new().call(SEAWATER_ADDR, &pack_position_liquidity(pool, id))?)
        .ok_or(Error::SeawaterDecode.into())
}
