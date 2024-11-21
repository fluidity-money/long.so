#![cfg_attr(target_arch = "wasm32", no_main, no_std)]

pub use libleo::user_entrypoint;

#[cfg(not(target_arch = "wasm32"))]
#[doc(hidden)]
fn main() {}
