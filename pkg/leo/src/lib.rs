pub mod calldata;
pub mod erc20;
pub mod error;
pub mod events;
pub mod maths;
pub mod nft_manager;

mod calldata_seawater;

#[cfg(not(feature = "testing"))]
mod wasm_seawater;

#[cfg(feature = "testing")]
mod host_seawater;

pub mod seawater;

mod immutables;

#[cfg(feature = "testing")]
pub mod host;

mod utils;

pub mod storage;

pub mod contract_collect;
pub mod contract_extras;

extern crate alloc;

pub use storage::StorageLeo;
