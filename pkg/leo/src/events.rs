use stylus_sdk::alloy_primitives::{Address, FixedBytes, U160, U256};

use stylus_sdk::{alloy_sol_types::sol, evm};

sol!("../sol/ILeoEvents.sol");

pub use ILeoEvents::*;

#[allow(clippy::too_many_arguments)]
pub fn emit_campaign_created(
    identifier: FixedBytes<8>,
    pool: Address,
    token: Address,
    owner: Address,
    tick_lower: i32,
    tick_upper: i32,
    starting: u64,
    ending: u64,
    per_second: u64,
) {
    evm::log(CampaignCreated {
        identifier: identifier.as_slice().try_into().unwrap(),
        pool,
        token,
        details: pack_details(tick_lower, tick_upper, owner),
        times: pack_times(starting, ending, per_second),
    });
}

#[allow(dead_code)]
fn pack_details(tick_lower: i32, tick_upper: i32, owner: Address) -> U256 {
    // This should be the same as coercing the bytes
    let mut packed = U256::from(tick_lower as u32) << (32 + 160);
    packed |= U256::from(tick_upper as u32) << 160;
    let owner: U160 = owner.into();
    packed | U256::from(owner)
}

#[allow(dead_code)]
fn pack_times(starting: u64, ending: u64, per_second: u64) -> U256 {
    let mut packed = U256::from(starting) << (64 * 2);
    packed |= U256::from(ending) << 64;
    packed | U256::from(per_second)
}

#[allow(dead_code)]
pub fn emit_campaign_updated(
    identifier: FixedBytes<8>,
    pool: Address,
    per_second: u64,
    tick_lower: i32,
    tick_upper: i32,
    starting: u64,
    ending: u64,
) {
    evm::log(CampaignUpdated {
        identifier: identifier.as_slice().try_into().unwrap(),
        perSecond: U256::from(per_second),
        pool,
        extras: pack_extras(tick_lower, tick_upper, starting, ending),
    });
}

#[allow(dead_code)]
fn pack_extras(tick_lower: i32, tick_upper: i32, starting: u64, ending: u64) -> U256 {
    let mut packed = U256::from(tick_lower as u32) << (32 + 64 + 64);
    packed |= U256::from(tick_upper as u32) << (64 + 64);
    packed |= U256::from(starting) << 64;
    packed | U256::from(ending)
}

#[test]
fn test_pack_details() {
    use crate::address;

    dbg!(pack_details(
        -20,
        100,
        address!("6221a9c005f6e47eb398fd867784cacfdcfff4e7")
    ));
}

#[test]
fn test_pack_times() {
    dbg!(pack_times(5000, 545464, 32));
}

#[test]
fn test_pack_extras() {
    dbg!(pack_extras(20, 199, 1888, 2889));
}
