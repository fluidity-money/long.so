// reexports and extension traits

// reexport so we can keep the types the same
pub use stylus_sdk;

pub type TickBitmap = stylus_sdk::storage::StorageMap<i16, stylus_sdk::storage::StorageU256>;

pub type U256 = stylus_sdk::alloy_primitives::U256;
pub trait U256Extension: Sized {
    fn from_hex_str(value: &str) -> Self;
    fn from_dec_str(value: &str) -> Option<Self>;
    fn is_zero(&self) -> bool;
    fn zero() -> Self;
    fn one() -> Self;
}

impl U256Extension for U256 {
    fn from_hex_str(value: &str) -> Self {
        debug_assert!(value.starts_with("0x"));
        value.parse().unwrap()
    }

    fn is_zero(&self) -> bool {
        self == &Self::zero()
    }

    fn zero() -> Self {
        Self::ZERO
    }

    fn one() -> Self {
        // little endian
        Self::from_limbs([1, 0, 0, 0])
    }

    fn from_dec_str(value: &str) -> Option<Self> {
        debug_assert!(!value.starts_with("0x"));
        value.parse().ok()
    }

}

pub type I256 = stylus_sdk::alloy_primitives::I256;

pub trait I256Extension: Sized {
    fn zero() -> Self;
    fn one() -> Self;
}

impl I256Extension for I256 {
    fn zero() -> Self {
        Self::ZERO
    }

    fn one() -> Self {
        Self::ONE
    }

}

