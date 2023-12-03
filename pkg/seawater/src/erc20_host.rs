//! Utilities for pretending to call ERC20 on a host environment.

pub use crate::permit2_types;

use crate::error::Error;

use stylus_sdk::alloy_primitives::{Address, U256};

use permit2_types::*;

/// Pretends to take tokens from the user. Only useful for testing.
pub fn take_transfer_from(_token: Address, _amount: U256) -> Result<(), Error> {
    Ok(())
}

/// Pretends to give users tokens. Only useful for testing.
pub fn give(_token: Address, _amount: U256) -> Result<(), Error> {
    Ok(())
}

/// Pretends to take ERC20 tokens from the user, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn take_permit2(
    _token: Address,
    _transfer_amount: U256,
    _details: Permit2Args,
) -> Result<(), Error> {
    Ok(())
}

/// Pretends to take ERC20 tokens from the user, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn take(
    _token: Address,
    _amount: U256,
    _permit2_details: Option<Permit2Args>,
) -> Result<(), Error> {
    Ok(())
}
