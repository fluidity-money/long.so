
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use stylus_sdk::prelude::*;

sol_storage! {
    #[entrypoint]
    pub struct Erc1155Token {
        uint256 number;
    }
}

#[external]
impl Erc1155Token {
}
