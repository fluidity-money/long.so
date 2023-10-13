#![cfg_attr(target_arch = "wasm32", no_main, no_std)]

use libseawater::user_entrypoint as stylus_entrypoint;

pub extern "C" fn user_entrypoint(len: usize) -> usize {
    stylus_entrypoint(len)
}

#[cfg(not(target_arch = "wasm32"))]
fn main() {}
