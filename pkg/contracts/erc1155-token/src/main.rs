#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

extern crate alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use stylus_sdk::prelude::*;

#[entrypoint]
#[solidity_storage]
pub struct ERC1155Token {}

#[external]
impl ERC1155Token {}
