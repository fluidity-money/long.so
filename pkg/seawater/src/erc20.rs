//! Utilities for encoding and calling ERC20 operations.
//!
//! This module provides functions for encoding and calling ERC20 functions, including on contracts
//! with noncompliant boolean returns.

use crate::error::Error;
use crate::types::{I256, I256Extension};
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::call::RawCall;
use stylus_sdk::{contract, msg};
use crate::eth_serde::selector;

//pub trait Exchange = FnOnce(I256) -> Result<(), Error>;

/// Call a function on a possibly noncomplient erc20 token
/// (tokens that may return a boolean success value), classifying reverts correctly.
fn call_optional_return(contract: Address, data: &[u8]) -> Result<(), Error> {
    // the call reverted if there's return data and the return data is falsey
    match RawCall::new().call(contract, data) {
        // reverting calls revert
        Err(revert) => Err(Error::Erc20Revert(revert)),
        Ok(data) => {
            match data.get(32) { // first byte of a 32 byte word
                // nonreverting with no return data is okay
                None => Ok(()),
                // nonreverting with falsey return data reverts
                Some(0) => Err(Error::Erc20RevertNoData),
                // nonreverting with truthy return data is okay
                Some(_) => Ok(()),
            }
        }
    }
}

/// The selector for `transfer(address,uint256)`
const TRANSFER_SELECTOR: [u8; 4] = selector(b"transfer(address,uint256)");
/// The selector for `transferFrom(address,address,uint256)`
const TRANSFER_FROM_SELECTOR: [u8; 4] = selector(b"transferFrom(address,address,uint256)");
// erc20 calldata encoding functions

/// Encodes a call to `transfer(address to, uint256 amount)`
fn encode_transfer(to: Address, amount: U256) -> [u8; 4 + 32 + 32] {
    let mut data = [0_u8; 4 + 32 + 32];
    data[0..4].copy_from_slice(&TRANSFER_SELECTOR[0..4]);
    data[4 + 12..4 + 32].copy_from_slice(&to.0 .0);
    data[4 + 32..4 + 32 + 32].copy_from_slice(&amount.to_be_bytes::<32>());

    data
}

/// Encodes a call to `transferFrom(address from, address to, uint256 amount)`
fn encode_transfer_from(from: Address, to: Address, amount: U256) -> [u8; 4 + 32 + 32 + 32] {
    let mut data = [0_u8; 4 + 32 + 32 + 32];
    data[0..4].copy_from_slice(&TRANSFER_FROM_SELECTOR[0..4]);
    data[4 + 12..4 + 32].copy_from_slice(&from.0 .0);
    data[4 + 32 + 12..4 + 32 + 32].copy_from_slice(&to.0 .0);
    data[4 + 32 + 32..4 + 32 + 32 + 32].copy_from_slice(&amount.to_be_bytes::<32>());

    data
}

/// Calls the `transfer` function on a potentially noncomplient ERC20.
fn safe_transfer(token: Address, to: Address, amount: U256) -> Result<(), Error> {
    call_optional_return(token, &encode_transfer(to, amount))
}

/// Calls the `transferFrom` function on a potentially noncomplient ERC20.
fn safe_transfer_from(
    token: Address,
    from: Address,
    to: Address,
    amount: U256,
) -> Result<(), Error> {
    call_optional_return(token, &encode_transfer_from(from, to, amount))
}

/// Sends or takes a token delta to/from the transaction sender.
///
/// # Arguments
/// * `token` - The token to transfer.
/// * `amount` - The delta to transfer. If this is positive, takes tokens from the user. If this is
/// negative, sends tokens to the user.
///
/// # Side effects
/// Performs an ERC20 `transfer` or `transferFrom`. Requires the user's allowance to be set correctly.
pub fn exchange(token: Address, amount: I256) -> Result<(), Error> {
    if amount.is_negative() {
        // send tokens to the user
        send(token, amount.abs_neg()?)
    } else if amount.is_positive() {
        // take tokens from the user
        take(token, amount.abs_pos()?)
    } else {
        // no amount, do nothing
        Ok(())
    }
}

pub fn exchange_permit2(token: Address, amount: I256, signature: Vec<u8>) -> Result<(), Error> {
    if amount.is_negative() {
        // send tokens to the user
        send(token, amount.abs_neg()?)
    } else if amount.is_positive() {
        // take tokens from the user
        take_permit2(token, amount.abs_pos()?, signature)
    } else {
        // no amount, do nothing
        Ok(())
    }
}

/// Sends ERC20 tokens to the transaction sender.
///
/// # Side effects
/// Transfers ERC20 tokens to the transaction sender.
pub fn send(token: Address, amount: U256) -> Result<(), Error> {
    safe_transfer(token, msg::sender(), amount)
}

/// Takes ERC20 tokens from the transaction sender using `transferFrom`.
///
/// # Side effects
/// Transfers ERC20 tokens from the transaction sender. Requires the user's allowance to be set
/// correctly.
pub fn take(token: Address, amount: U256) -> Result<(), Error> {
    safe_transfer_from(token, msg::sender(), contract::address(), amount)
}

pub fn take_permit2(token: Address, amount: U256, signature: Vec<u8>) -> Result<(), Error> {

    todo!()
}

#[cfg(test)]
mod test {
    use ruint::uint;
    use stylus_sdk::alloy_primitives::{address, bytes};

    #[test]
    fn test_encode_transfer() {
        let encoded = super::encode_transfer(
            address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            uint!(0x7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4_U256),
        );
        // generated with
        // `cast cd "transfer(address,uint256)" 0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6 (cast keccak "big number wow")`
        let expected = bytes!(
            "a9059cbb"
            "000000000000000000000000737b7865f84bdc86b5c8ca718a5b7a6d905776f6"
            "7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4"
        )
        .0;

        assert_eq!(encoded, *expected);
    }

    #[test]
    fn test_encode_transfer_from() {
        let encoded = super::encode_transfer_from(
            address!("6221A9c005F6e47EB398fD867784CacfDcFFF4E7"),
            address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            uint!(0x7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4_U256),
        );
        // generated with
        // `cast cd "transferFrom(address,address,uint256)" 0x6221A9c005F6e47EB398fD867784CacfDcFFF4E7 0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6 (cast keccak "big number wow")`
        let expected = bytes!(
            "23b872dd"
            "0000000000000000000000006221a9c005f6e47eb398fd867784cacfdcfff4e7"
            "000000000000000000000000737b7865f84bdc86b5c8ca718a5b7a6d905776f6"
            "7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4"
        )
        .0;

        assert_eq!(encoded, *expected);
    }
}
