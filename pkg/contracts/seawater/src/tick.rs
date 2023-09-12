use crate::types::*;
use stylus_sdk::prelude::*;
use stylus_sdk::storage::*;

#[solidity_storage]
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

impl StorageTickInfo {
    pub fn update(
        &mut self,
        tick: i32,
        cur_tick: i32,
        liquidity_delta: i128,
        fee_growth_global_0: U256,
        fee_growth_global_1: U256,
        seconds_per_liquidity: U256,
        tick_cumulative: i64,
        time: u32,
        upper: bool,
        max_liquidity: u128,
    ) -> bool {
        todo!()
    }
}
