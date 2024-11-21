pub mod calldata;
pub mod erc20;
pub mod error;
pub mod events;
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

#[cfg(all(
    target_arch = "wasm32",
    not(any(feature = "contract-collect", feature = "contract-extras"))
))]
compile_error!("contract-collect or contract-extras feature must be enabled.");

#[cfg(all(
    target_arch = "wasm32",
    feature = "contract-collect",
    feature = "contract-extras"
))]
compile_error!("contract-collect and contract-extras cannot both be enabled");

#[cfg(feature = "contract-collect")]
pub use contract_collect::user_entrypoint;

#[cfg(feature = "contract-extras")]
pub use contract_extras::user_entrypoint;
