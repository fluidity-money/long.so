use stylus_sdk::{
    alloy_primitives::{Address, U256},
    call::RawCall,
    contract, msg,
};

use crate::calldata::*;

use crate::immutables::NFT_MANAGER_ADDR;

//transferFrom(address,address,uint256)
const TRANSFER_FROM_POSITION_SELECTOR: [u8; 4] = [0x23, 0xb8, 0x72, 0xdd];

fn pack_transfer_from(from: Address, to: Address, id: U256) -> [u8; 4 + 32 * 3] {
    let mut data = [0_u8; 4 + 32 * 3];
    write_selector(&mut data, &TRANSFER_FROM_POSITION_SELECTOR);
    write_address(&mut data, 0, from);
    write_address(&mut data, 1, to);
    write_u256(&mut data, 2, id);
    data
}

pub fn take_position(id: U256) -> Result<(), Vec<u8>> {
    if cfg!(target_arch = "wasm32") {
        RawCall::new().call(
            NFT_MANAGER_ADDR,
            &pack_transfer_from(msg::sender(), contract::address(), id),
        )?;
        Ok(())
    } else {
        Ok(())
    }
}

pub fn give_position(id: U256) -> Result<(), Vec<u8>> {
    if cfg!(target_arch = "wasm32") {
        RawCall::new().call(
            NFT_MANAGER_ADDR,
            &pack_transfer_from(contract::address(), msg::sender(), id),
        )?;
        Ok(())
    } else {
        Ok(())
    }
}
