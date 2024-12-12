use stylus_sdk::{
    alloy_primitives::{Address, U256},
    alloy_sol_types::{sol, SolCall},
    call::RawCall,
};

use crate::{calldata::*, error::Error, immutables::SEAWATER_ADDR};

sol! {
    function collectSingleTo6D76575F(address pool, uint256 id, address recipient);
    function positionLiquidity8D11C045(address pool, uint256 id);
}

/// Collect yield, using the [collect_single_to_6_D_76575_F] function in Longtail.
pub fn collect_yield_single_to(
    pool: Address,
    id: U256,
    recipient: Address,
) -> Result<(u128, u128), Vec<u8>> {
    unpack_u128_double(
        &RawCall::new().call(
            SEAWATER_ADDR,
            &collectSingleTo6D76575FCall {
                pool,
                id,
                recipient,
            }
            .abi_encode(),
        )?,
    )
    .ok_or(Error::SeawaterDecode.into())
}

pub fn tick_lower(pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    Ok(0) // TODO
}

pub fn tick_upper(pool: Address, id: U256) -> Result<i32, Vec<u8>> {
    Ok(0) // TODO
}

pub fn position_liquidity(pool: Address, id: U256) -> Result<u128, Vec<u8>> {
    unpack_u128(&RawCall::new().call(
        SEAWATER_ADDR,
        &positionLiquidity8D11C045Call { pool, id }.abi_encode(),
    )?)
    .ok_or(Error::SeawaterDecode.into())
}
