#![cfg_attr(not(feature = "export-abi"), no_main, no_std)]

use libseawater::user_entrypoint as stylus_entrypoint;
use libseawater::*;

pub extern "C" fn user_entrypoint(len: usize) -> usize {
    stylus_entrypoint(len)
}

// for whatever reason, even with `#![no_main]` or `#[cfg(test)] fn main(){}` this crate fails to
// build for tests without this
//#[cfg(not(target_arch = "wasm32"))]
fn main() {}
