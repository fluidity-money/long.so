#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

mod error;
mod maths;
mod position;
mod test_shims;
mod tick;
mod types;

use position::*;
use stylus_sdk::prelude::*;
use stylus_sdk::storage::*;
use types::{Address, I256, U256};

extern crate alloc;

type Revert = Vec<u8>;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[entrypoint]
#[solidity_storage]
pub struct StoragePool {
    positions: StorageMap<StoragePositionKey, StoragePositionInfo>,
}

#[external]
impl StoragePool {
    #[allow(unused)]
    pub fn update_position(
        &mut self,
        owner: Address,
        lower: i32,
        upper: i32,
        delta: i128,
    ) -> Result<(), Revert> {
        let position = self.positions.get(StoragePositionKey {
            address: owner,
            lower,
            upper,
        });

        todo!()
    }

    #[allow(unused)]
    pub fn swap(
        &mut self,
        zero_for_one: bool,
        amount: I256,
        price_limit: U256,
    ) -> Result<(I256, I256), Revert> {
        todo!()
    }
}
