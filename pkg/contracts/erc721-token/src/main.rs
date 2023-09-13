#![cfg_attr(
    not(
        any(test, feature = "export-abi")),
        no_main
    )
]

extern crate alloc;
extern crate seawater;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use stylus_sdk::prelude::*;

sol_interface! {
    interface ISeawaterLpTokens {
        function balanceOfLP(address owner, address token) view returns (uint256);
        function transfer(address owner, address token, uint256 amount);
    }
}

#[entrypoint]
#[solidity_storage]
pub struct ERC721Token {
    contract: ISeawaterLpTokens
}

#[external]
impl ERC721Token {
}
