//! Per-deployment constants, intended to be used the same way `immutable` variables are in
//! solidity
//!
//! (These should probably be implemented through the [std::env!] macro, but it's annoyingly
//! difficult to do hex decoding in a const context, so for now they're implemented here.)

use stylus_sdk::alloy_primitives::address;

use crate::types::Address;

macro_rules! addr {
    ("0000000000000000000000000000000000000000") => {
        if cfg!(target_arch = "wasm32") {
            panic!("Addresses must be set in `immutables.rs`!")
        } else {
            address!("0000000000000000000000000000000000000000")
        }
    };
    ($addr:literal) => {
        address!($addr)
    };
}
/// The address of the permit2 contract.
pub const PERMIT2_ADDR: Address = addr!("0000000000000000000000000000000000000001");

/// The address of the fluid token, to be used as token 1 for every pool.
pub const FUSDC_ADDR: Address = addr!("0000000000000000000000000000000000000001");
