#![cfg_attr(target_arch = "wasm32", no_main, no_std)]

#[cfg(feature = "contract-collect")]
pub use libleo::contract_collect::user_entrypoint as user_entrypoint;

#[cfg(feature = "contract-extras")]
pub use libleo::contract_extras::user_entrypoint as user_entrypoint;

#[cfg(all(
    target_arch = "wasm32",
    not(any(feature = "contract-collect", feature = "contract-extras"))
))]
compile_error!("factory-1, factory-2, trading-mint, or trading-extras feature must be enabled.");

#[cfg(not(target_arch = "wasm32"))]
#[doc(hidden)]
fn main() {}
