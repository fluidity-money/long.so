//! Utilities for calling ERC20 operations on a WASM environment.
//!
//! This module provides functions for encoding and calling ERC20 functions, including on contracts
//! with noncompliant boolean returns.

use crate::{
    calldata_erc20,
    error::Error,
    types::{I256Extension, I256},
};

use stylus_sdk::alloy_primitives::{Address, U256};

use stylus_sdk::{contract, msg};

use crate::immutables::PERMIT2_ADDR;

use stylus_sdk::call::RawCall;

use crate::permit2_types::*;

pub use calldata_erc20::*;

/// Call a function on a possibly noncomplient erc20 token
/// (tokens that may return a boolean success value), classifying reverts correctly.
/// On a WASM environment, this will actually make calls using a raw_call.
fn call_optional_return(contract: Address, data: &[u8]) -> Result<(), Error> {
    // the call reverted if there's return data and the return data is falsey
    match RawCall::new().call(contract, data) {
        // reverting calls revert
        Err(revert) => Err(Error::Erc20Revert(revert)),
        Ok(data) => {
            match data.get(31) {
                // first byte of a 32 byte word
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
    if amount.is_zero() {
        Ok(()) // we don't need to take anything!
    } else if amount.is_negative() {
        // send tokens to the user (giving)
        transfer_to_sender(token, amount.abs_neg()?)
    } else {
        // take tokens from the user
        take_transfer_from(token, amount.abs_pos()?)
    }
}

/// Sends ERC20 tokens to the transaction sender.
///
/// # Side effects
/// Transfers ERC20 tokens to the transaction sender.
pub fn transfer_to_sender(token: Address, amount: U256) -> Result<(), Error> {
    safe_transfer(token, msg::sender(), amount)
}

/// Sends ERC20 tokens to a specific recipient.
///
/// # Side effects
/// Transfers ERC20 tokens to a recipient.
pub fn transfer_to_addr(token: Address, recipient: Address, amount: U256) -> Result<(), Error> {
    safe_transfer(token, recipient, amount)
}

/// Send ERC20 tokens to a specific address.
///
/// # Side effects
/// Transfers ERC20 tokens to the address given.
pub fn take_from_to(token: Address, recipient: Address, amount: U256) -> Result<(), Error> {
    safe_transfer_from(token, msg::sender(), recipient, amount)
}

/// Takes ERC20 tokens from the transaction sender using `transferFrom`.
///
/// # Side effects
/// Transfers ERC20 tokens from the transaction sender. Requires the user's allowance to be set
/// correctly.
pub fn take_transfer_from(token: Address, amount: U256) -> Result<(), Error> {
    safe_transfer_from(token, msg::sender(), contract::address(), amount)
}

/// Takes ERC20 tokens from the sender, using the Permit router.
///
/// # Side effects
/// Transfers ERC20 tokens from the transaction sender using the Permit args.
pub fn take_permit2(
    token: Address,
    transfer_amount: U256,
    details: Permit2Args,
) -> Result<(), Error> {
    let data = encode_permit2(
        token,
        details.max_amount,
        details.nonce,
        details.deadline,
        contract::address(),
        transfer_amount,
        msg::sender(),
        details.sig,
    );

    match RawCall::new().call(PERMIT2_ADDR, &data) {
        Ok(_) => Ok(()),
        Err(v) => Err(Error::Erc20Revert(v)),
    }
}

/// Takes ERC20 tokens from the sender, using the Permit router if the
/// permit2_details field is set to Some. If not, then it will use
/// `Self::take_transfer_from`.
///
/// # Side effects
pub fn take(
    token: Address,
    amount: U256,
    permit2_details: Option<Permit2Args>,
) -> Result<(), Error> {
    match permit2_details {
        Some(details) => take_permit2(token, amount, details),
        None => take_transfer_from(token, amount),
    }
}

/// Get the decimals of the token given using the "decimals" function.
pub fn decimals(address: Address) -> Result<u8, Error> {
    match RawCall::new().call(address, &DECIMALS_SELECTOR) {
        Err(revert) => Err(Error::Erc20Revert(revert)),
        Ok(data) => {
            match data.get(31) {
                // no decimals were returned to us!
                None => Err(Error::Erc20RevertNoData),
                // the rightmost byte is the decimal number, so we can just return this.
                Some(decimal) => Ok(*decimal),
            }
        }
    }
}

#[cfg(test)]
mod test {
    use ruint::uint;
    use stylus_sdk::alloy_primitives::{address, bytes, U256};

    use super::*;

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

    #[test]
    fn test_encode_permit2() {
        let encoded = super::encode_permit2(
            address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            uint!(0x10000000_U256),
            uint!(0x50_U256),
            uint!(0x655c1000_U256),
            address!("837B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            uint!(0x1234_U256),
            address!("937B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            &bytes!("abcdabcdabcdabcdabcdabcdabcd").0,
        );

        // generated with
        // `cast cd "permitTransferFrom(((address,uint256),uint256,uint256),(address,uint256),address,bytes memory)" "((0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6,268435456),80,1700532224)" "(0x837B7865f84bDc86B5c8ca718a5B7a6d905776F6,4660)" "0x937B7865f84bDc86B5c8ca718a5B7a6d905776F6" "0xabcdabcdabcdabcdabcdabcdabcd"`
        let expected = bytes!(
            "30f28b7a"
            "000000000000000000000000737b7865f84bdc86b5c8ca718a5b7a6d905776f6"
            "0000000000000000000000000000000000000000000000000000000010000000"
            "0000000000000000000000000000000000000000000000000000000000000050"
            "00000000000000000000000000000000000000000000000000000000655c1000"
            "000000000000000000000000837b7865f84bdc86b5c8ca718a5b7a6d905776f6"
            "0000000000000000000000000000000000000000000000000000000000001234"
            "000000000000000000000000937b7865f84bdc86b5c8ca718a5b7a6d905776f6"
            "0000000000000000000000000000000000000000000000000000000000000100"
            "000000000000000000000000000000000000000000000000000000000000000e"
            "abcdabcdabcdabcdabcdabcdabcd000000000000000000000000000000000000"
        )
        .0;

        assert_eq!(encoded, *expected);
    }

    #[test]
    fn test_revert_from_msg() {
        use crate::types::U256Extension;

        let revert = super::revert_from_msg("Not enough Ether provided.");
        // generated by prepending the Error selector to `cast abi-encode 'Error(string)' 'Not enough Ether provided.'`
        let mut expected = Vec::new();
        expected.extend(ERROR_SELECTOR);
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x0000000000000000000000000000000000000000000000000000000000000020",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x000000000000000000000000000000000000000000000000000000000000001a",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x4e6f7420656e6f7567682045746865722070726f76696465642e000000000000",
            )
            .to_be_bytes(),
        );

        assert_eq!(revert, expected);

        let revert = super::revert_from_msg("123456789123456789123456789123456789");
        let mut expected = Vec::new();
        expected.extend(ERROR_SELECTOR);
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x0000000000000000000000000000000000000000000000000000000000000020",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x0000000000000000000000000000000000000000000000000000000000000024",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x3132333435363738393132333435363738393132333435363738393132333435",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x3637383900000000000000000000000000000000000000000000000000000000",
            )
            .to_be_bytes(),
        );

        assert_eq!(revert, expected);

        let revert = super::revert_from_msg(
            "123456789123456789123456789123456789123456789123456789123456789123456789",
        );
        let mut expected = Vec::new();
        expected.extend(ERROR_SELECTOR);
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x0000000000000000000000000000000000000000000000000000000000000020",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x0000000000000000000000000000000000000000000000000000000000000048",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x3132333435363738393132333435363738393132333435363738393132333435",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x3637383931323334353637383931323334353637383931323334353637383931",
            )
            .to_be_bytes(),
        );
        expected.extend::<[u8; 32]>(
            U256::from_hex_str(
                "0x3233343536373839000000000000000000000000000000000000000000000000",
            )
            .to_be_bytes(),
        );

        assert_eq!(revert, expected);
    }
}
