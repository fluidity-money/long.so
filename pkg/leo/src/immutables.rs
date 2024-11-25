use stylus_sdk::alloy_primitives::{U256, Address};

// test only implementation that returns a dummy value (so you can pick it from logs)
#[cfg(feature = "testing")]
macro_rules! addr {
    ($_input:literal) => {
        // this says "fluidity_1" if you squint
        Address::new([
            0xf1, 0x01, 0xd1, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        ])
    };
}

#[cfg(all(target_arch = "wasm32", not(feature = "testing")))]
macro_rules! addr {
    ($input:literal) => {
        Address::new(
            match const_hex::const_decode_to_array::<20>(env!($input).as_bytes()) {
                Ok(res) => res,
                Err(_) => panic!(),
            },
        )
    };
}

/// Scaling factor that's used to scale the distribution of the token per second.
pub const SCALING_FACTOR: U256 = U256::from_limbs([1000000000000, 0, 0, 0]);

#[allow(dead_code)]
pub const SEAWATER_ADDR: Address = addr!("FLU_SEAWATER_ADDR");

#[allow(dead_code)]
pub const NFT_MANAGER_ADDR: Address = addr!("FLU_NFT_MANAGER_ADDR");

/// Minimum tick to gate for using Seawater.
pub const MIN_TICK: i32 = -887272;

/// Maximum tick to gate for using Seawater.
pub const MAX_TICK: i32 = -MIN_TICK;
