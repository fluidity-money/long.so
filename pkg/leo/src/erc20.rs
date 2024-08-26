use stylus_sdk::alloy_primitives::{Address, U256};

use stylus_sdk::{call::RawCall, contract, msg};

use crate::{
    calldata::{write_address, write_selector, write_u256},
    error::Error,
};

//transfer(address,uint256)
const TRANSFER_SELECTOR: [u8; 4] = [0xa9, 0x05, 0x9c, 0xbb];

//transferFrom(address,address,uint256)
const TRANSFER_FROM_SELECTOR: [u8; 4] = [0x23, 0xb8, 0x72, 0xdd];

pub fn take(token: Address, pool: Address, amount: U256) -> Result<(), Vec<u8>> {
    transfer_from(token, msg::sender(), contract::address(), amount)
}

pub fn give(token: Address, amount: U256) -> Result<(), Vec<u8>> {
    transfer(token, msg::sender(), amount)
}

fn transfer(token: Address, recipient: Address, amount: U256) -> Result<(), Vec<u8>> {
    let mut cd = [0_u8; 4 + 32 * 3];
    write_selector(&mut cd, &TRANSFER_SELECTOR);
    write_address(&mut cd, 0, recipient);
    write_u256(&mut cd, 1, amount);
    if cfg!(target_arch = "wasm32") {
        match RawCall::new().call(token, &cd)?.get(31) {
            None | Some(1) => Ok(()),
            Some(0) | _ => Err(Error::ReturnedFalse.into()),
        }
    } else {
        Ok(())
    }
}

fn transfer_from(
    token: Address,
    sender: Address,
    recipient: Address,
    amount: U256,
) -> Result<(), Vec<u8>> {
    let mut cd = [0_u8; 4 + 32 * 3];
    write_selector(&mut cd, &TRANSFER_FROM_SELECTOR);
    write_address(&mut cd, 0, sender);
    write_address(&mut cd, 1, recipient);
    write_u256(&mut cd, 2, amount);
    if cfg!(target_arch = "wasm32") {
        match RawCall::new().call(token, &cd)?.get(31) {
            None | Some(1) => Ok(()),
            Some(0) | _ => Err(Error::ReturnedFalse.into()),
        }
    } else {
        Ok(())
    }
}
