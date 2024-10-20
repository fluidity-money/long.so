#![allow(dead_code)]

use stylus_sdk::alloy_primitives::{Address, U256};

use crate::calldata::*;

//collectSingleTo6D76575F(address,uint256,address)
const COLLECT_YIELD_SINGLE_TO_SELECTOR: [u8; 4] = [0x00, 0x00, 0x02, 0x87];

//positionTickLower2F77CCE1(address,uint256)
const TICK_LOWER_SELECTOR: [u8; 4] = [0x00, 0x00, 0x02, 0xec];

//positionTickUpper67FD55BA(address,uint256)
const TICK_UPPER_SELECTOR: [u8; 4] = [0x00, 0x00, 0x02, 0x4a];

//positionLiquidity8D11C045(address,uint256)
const POSITION_LIQUIDITY_SELECTOR: [u8; 4] = [0x00, 0x00, 0x02, 0x5b];

pub fn pack_collect_yield_single_to(
    pool: Address,
    id: U256,
    recipient: Address,
) -> [u8; 4 + 32 * 3] {
    let mut cd = [0_u8; 4 + 32 * 3];
    write_selector(&mut cd, &COLLECT_YIELD_SINGLE_TO_SELECTOR);
    write_address(&mut cd, 0, pool);
    write_u256(&mut cd, 1, id);
    write_address(&mut cd, 2, recipient);
    cd
}

pub fn pack_tick_lower(pool: Address, id: U256) -> [u8; 4 + 32 * 2] {
    let mut cd = [0_u8; 4 + 32 * 2];
    write_selector(&mut cd, &TICK_LOWER_SELECTOR);
    write_address(&mut cd, 0, pool);
    write_u256(&mut cd, 1, id);
    cd
}

pub fn pack_tick_upper(pool: Address, id: U256) -> [u8; 4 + 32 * 2] {
    let mut cd = [0_u8; 4 + 32 * 2];
    write_selector(&mut cd, &TICK_UPPER_SELECTOR);
    write_address(&mut cd, 0, pool);
    write_u256(&mut cd, 1, id);
    cd
}

pub fn pack_position_liquidity(pool: Address, id: U256) -> [u8; 4 + 32 * 2] {
    let mut cd = [0_u8; 4 + 32 * 2];
    write_selector(&mut cd, &POSITION_LIQUIDITY_SELECTOR);
    write_address(&mut cd, 0, pool);
    write_u256(&mut cd, 1, id);
    cd
}

#[test]
fn test_pack_collect_yield_single_to() {
    use stylus_sdk::alloy_primitives::address;

    assert_eq!(
        &pack_collect_yield_single_to(
            address!("feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5"),
            U256::from(123),
            address!("6221a9c005f6e47eb398fd867784cacfdcfff4e7")
        ),
        &[
            0x00, 0x00, 0x02, 0x87, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0xfe, 0xb6, 0x03, 0x4f, 0xc7, 0xdf, 0x27, 0xdf, 0x18, 0xa3, 0xa6, 0xba,
            0xd5, 0xfb, 0x94, 0xc0, 0xd3, 0xdc, 0xb6, 0xd5, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7b, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x62, 0x21, 0xa9, 0xc0,
            0x05, 0xf6, 0xe4, 0x7e, 0xb3, 0x98, 0xfd, 0x86, 0x77, 0x84, 0xca, 0xcf, 0xdc, 0xff,
            0xf4, 0xe7
        ]
    )
}

#[test]
fn test_pack_tick_lower() {
    use stylus_sdk::alloy_primitives::address;

    assert_eq!(
        &pack_tick_lower(
            address!("feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5"),
            U256::from(456),
        ),
        &[
            0x00, 0x00, 0x02, 0xec, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0xfe, 0xb6, 0x03, 0x4f, 0xc7, 0xdf, 0x27, 0xdf, 0x18, 0xa3, 0xa6, 0xba,
            0xd5, 0xfb, 0x94, 0xc0, 0xd3, 0xdc, 0xb6, 0xd5, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xc8,
        ]
    )
}

#[test]
fn test_pack_tick_upper() {
    use stylus_sdk::alloy_primitives::address;

    assert_eq!(
        &pack_tick_upper(
            address!("6221a9c005f6e47eb398fd867784cacfdcfff4e7"),
            U256::from(45645464),
        ),
        &[
            0x00, 0x00, 0x02, 0x4a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x62, 0x21, 0xa9, 0xc0, 0x05, 0xf6, 0xe4, 0x7e, 0xb3, 0x98, 0xfd, 0x86,
            0x77, 0x84, 0xca, 0xcf, 0xdc, 0xff, 0xf4, 0xe7, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xb8, 0x7e, 0x98,
        ]
    )
}

#[test]
fn test_pack_position_liquidity() {
    use stylus_sdk::alloy_primitives::address;

    assert_eq!(
        &pack_position_liquidity(
            address!("6221a9c005f6e47eb398fd867784cacfdcfff4e7"),
            U256::from(8888),
        ),
        &[
            0x00, 0x00, 0x02, 0x5b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x62, 0x21, 0xa9, 0xc0, 0x05, 0xf6, 0xe4, 0x7e, 0xb3, 0x98, 0xfd, 0x86,
            0x77, 0x84, 0xca, 0xcf, 0xdc, 0xff, 0xf4, 0xe7, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x22, 0xb8,
        ]
    )
}
