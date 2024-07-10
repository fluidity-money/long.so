//! Utilities for pretending to call ERC20 on a host environment. Also
//! supports optionally controlling the amount of tokens that are sent
//! with configuration in the `with_storage` function with host shims.

pub use crate::permit2_types;

use crate::error::Error;

use stylus_sdk::alloy_primitives::{Address, U256};

use permit2_types::*;

#[allow(unused_imports)]
use crate::{current_test, host_test_shims};

///! Decimals function used in event mocking for pool creation.
pub fn decimals(_token: Address) -> Result<u8, Error> {
    #[cfg(feature = "testing")]
    dbg!(("decimals", _token));
    Ok(6)
}

///! Pretends to take tokens from the user. Only useful for testing.
///! Assumes a single token is in use for the life of this test.
pub fn take_transfer_from(token: Address, amount: U256) -> Result<(), Error> {
    #[cfg(feature = "testing")]
    {
        dbg!(("take_transfer_from", current_test!(), token, amount));
        return host_test_shims::take_caller_bal(token, amount).map_err(
            |_| Error::Erc20RevertNoData, // follow the trace!
        );
    }
    #[allow(unreachable_code)]
    Ok(())
}

/// Pretends to give users tokens. Only useful for testing.
pub fn give(token: Address, amount: U256) -> Result<(), Error> {
    #[cfg(feature = "testing")]
    {
        dbg!(("give", current_test!(), token, amount));
        return host_test_shims::take_amm_bal(token, amount).map_err(
            |_| Error::Erc20RevertNoData, // follow the trace!
        );
    }
    #[allow(unreachable_code)]
    Ok(())
}

/// Pretends to take ERC20 tokens from the user, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn take_permit2(token: Address, amount: U256, _details: Permit2Args) -> Result<(), Error> {
    #[cfg(feature = "testing")]
    {
        dbg!(("take_permit2", current_test!(), token, amount, _details));
        return host_test_shims::take_caller_bal(token, amount).map_err(
            |_| Error::Erc20RevertNoData, // follow the trace!
        );
    }
    #[allow(unreachable_code)]
    Ok(())
}

/// Pretends to take ERC20 tokens from the user, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn take(
    token: Address,
    amount: U256,
    _permit2_details: Option<Permit2Args>,
) -> Result<(), Error> {
    #[cfg(feature = "testing")]
    {
        dbg!(("take", current_test!(), token, amount, _permit2_details));
        return host_test_shims::take_caller_bal(token, amount).map_err(
            |_| Error::Erc20RevertNoData, // follow the trace!
        );
    }
    #[allow(unreachable_code)]
    Ok(())
}

/// Pretends to construct a revert string from a message, only happening if the underlying
/// environment is not WASM. Only useful for testing.
pub fn revert_from_msg(_msg: &str) -> Vec<u8> {
    #[cfg(feature = "testing")]
    dbg!(("revert_from_msg", current_test!(), _msg));
    Vec::new()
}
