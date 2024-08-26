#[cfg(target_arch = "wasm32")]
pub use crate::wasm_seawater::*;

#[cfg(not(target_arch = "wasm32"))]
pub use crate::host_seawater::*;
