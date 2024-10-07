use stylus_sdk::alloy_primitives::{Address, U256};

use stylus_sdk::{call::RawCall, contract, msg};

use crate::calldata::*;

use crate::calldata::{write_address, write_selector, write_u256};

//transfer(address,uint256)
const TRANSFER_SELECTOR: [u8; 4] = [0xa9, 0x05, 0x9c, 0xbb];

pub fn take(token: Address, pool: Address, amount: U256) -> Result<(), Vec<u8>> {
    transfer_from(token, msg::sender(), contract::address(), amount)
}

pub fn give(token: Address, amount: U256) -> Result<(), Vec<u8>> {
    transfer(token, msg::sender(), amount)
}

fn transfer_from(
    token: Address,
    sender: Address,
    recipient: Address,
    amount: U256,
) -> Result<(), Vec<u8>> {
    if cfg!(target_arch = "wasm32") {
        unpack_bool_safe(
            &RawCall::new().call(token, &pack_transfer_from(sender, recipient, amount))?,
        )
    } else {
        Ok(())
    }
}

fn transfer(token: Address, recipient: Address, amount: U256) -> Result<(), Vec<u8>> {
    if cfg!(target_arch = "wasm32") {
        unpack_bool_safe(&RawCall::new().call(token, &pack_transfer(recipient, amount))?)
    } else {
        Ok(())
    }
}

fn pack_transfer(recipient: Address, amount: U256) -> [u8; 4 + 32 * 2] {
    let mut cd = [0_u8; 4 + 32 * 2];
    write_selector(&mut cd, &TRANSFER_SELECTOR);
    write_address(&mut cd, 0, recipient);
    write_u256(&mut cd, 1, amount);
    cd
}

#[test]
fn test_pack_transfer() {
    use stylus_sdk::alloy_primitives::address;

    let expected: &[u8] = &[
        //cast calldata 'transfer(address,uint256)' 0x6221a9c005f6e47eb398fd867784cacfdcfff4e7 100
        0xa9, 0x05, 0x9c, 0xbb, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x62, 0x21, 0xa9, 0xc0, 0x05, 0xf6, 0xe4, 0x7e, 0xb3, 0x98, 0xfd, 0x86, 0x77, 0x84,
        0xca, 0xcf, 0xdc, 0xff, 0xf4, 0xe7, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64,
    ];
    assert_eq!(
        &pack_transfer(
            address!("6221a9c005f6e47eb398fd867784cacfdcfff4e7"),
            U256::from(100)
        ),
        expected
    );
}

#[test]
fn test_unpack_bool() {
    assert!(unpack_bool_safe(&[
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x01,
    ])
    .is_ok());
    assert!(unpack_bool_safe(&[0_u8; 32]).is_err());
    assert!(unpack_bool_safe(&[]).is_ok());
}
