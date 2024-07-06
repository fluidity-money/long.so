//! Utilities for pretending to call ERC20 on a host environment. Also
//! supports optionally controlling the amount of tokens that are sent
//! with configuration in the `with_storage` function with host shims.

pub use crate::permit2_types;

use crate::error::Error;

use stylus_sdk::alloy_primitives::{Address, U256};

use permit2_types::*;

#[allow(unused_imports)]
use crate::current_test;

pub fn decimals(_token: Address) -> Result<u8, Error> {
    #[cfg(feature = "testing-dbg-erc20")]
    dbg!(("decimals", _token));
    Ok(6)
}

/// Pretends to take tokens from the user. Only useful for testing.
pub fn take_transfer_from(_token: Address, _amount: U256) -> Result<(), Error> {
    #[cfg(feature = "testing-dbg-erc20")]
    dbg!(("take_transfer_from", current_test!(), _token, _amount));
    Ok(())
}

/// Pretends to give users tokens. Only useful for testing.
pub fn give(_token: Address, _amount: U256) -> Result<(), Error> {
    #[cfg(feature = "testing-dbg-erc20")]
    dbg!(("give", current_test!(), _token, _amount));
    Ok(())
}

/// Pretends to take ERC20 tokens from the user, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn take_permit2(
    _token: Address,
    _transfer_amount: U256,
    _details: Permit2Args,
) -> Result<(), Error> {
    #[cfg(feature = "testing-dbg-erc20")]
    dbg!((
        "take_permit2",
        current_test!(),
        _token,
        _transfer_amount,
        _details
    ));
    Ok(())
}

/// Pretends to take ERC20 tokens from the user, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn take(
    _token: Address,
    _amount: U256,
    _permit2_details: Option<Permit2Args>,
) -> Result<(), Error> {
    #[cfg(feature = "testing-dbg-erc20")]
    dbg!(("take", current_test!(), _token, _amount, _permit2_details));
    Ok(())
}

/// Pretends to construct a revert string from a message, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn revert_from_msg(_msg: &str) -> Vec<u8> {
    #[cfg(feature = "testing-dbg-erc20")]
    dbg!(("revert_from_msg", current_test!(), _msg));
    Vec::new()
}
