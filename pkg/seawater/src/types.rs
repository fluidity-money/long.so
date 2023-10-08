// reexports and extension traits

// reexport so we can keep the types the same
pub use stylus_sdk;

pub type TickBitmap = stylus_sdk::storage::StorageMap<i16, stylus_sdk::storage::StorageU256>;


pub type U256 = stylus_sdk::alloy_primitives::U256;
pub trait U256Extension: Sized {
    #[cfg(test)]
    fn from_hex_str(value: &str) -> Self;
    #[cfg(test)]
    fn from_dec_str(value: &str) -> Option<Self>;
    fn is_zero(&self) -> bool;
    fn zero() -> Self;
    fn one() -> Self;
}

impl U256Extension for U256 {
    #[cfg(test)]
    fn from_hex_str(value: &str) -> Self {
        debug_assert!(value.starts_with("0x"));
        value.parse().unwrap()
    }

    #[cfg(test)]
    fn from_dec_str(value: &str) -> Option<Self> {
        debug_assert!(!value.starts_with("0x"));
        value.parse().ok()
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
}

pub type I256 = stylus_sdk::alloy_primitives::I256;

pub trait I256Extension: Sized {
    fn zero() -> Self;
    fn one() -> Self;
    fn abs_neg(self) -> U256;
}

impl I256Extension for I256 {
    fn zero() -> Self {
        Self::ZERO
    }

    fn one() -> Self {
        Self::ONE
    }

    fn abs_neg(self) -> U256 {
        assert!(self.is_negative());
        self
            .checked_abs().unwrap()
            .into_raw()
    }

}

pub type U128 = stylus_sdk::alloy_primitives::U128;
pub type I128 = stylus_sdk::alloy_primitives::I128;
pub type I32 = stylus_sdk::alloy_primitives::I32;
pub type U8 = stylus_sdk::alloy_primitives::U8;

// ersatz From and Into
// wraps into W
pub trait Wrap<W> {
    fn unwrap(&self) -> W;
    fn wrap(arg: &W) -> Self;
}

impl Wrap<i128> for I128 {
    fn unwrap(&self) -> i128 {
        i128::from_le_bytes(self.to_le_bytes())
    }

    fn wrap(arg: &i128) -> Self {
        I128::from_le_bytes(arg.to_le_bytes())
    }
}
impl Wrap<u128> for U128 {
    fn unwrap(&self) -> u128 {
        u128::from_le_bytes(self.to_le_bytes())
    }

    fn wrap(arg: &u128) -> Self {
        U128::from_le_bytes(arg.to_le_bytes())
    }
}
impl Wrap<i32> for I32 {
    fn unwrap(&self) -> i32 {
        self.as_i32()
    }

    fn wrap(arg: &i32) -> Self {
        I32::unchecked_from(*arg)
    }
}
impl Wrap<u8> for U8 {
    fn unwrap(&self) -> u8 {
        self.as_limbs()[0] as u8
    }

    fn wrap(arg: &u8) -> Self {
        Self::from_limbs([*arg as u64])
    }
}

impl Wrap<u32> for U32 {
    fn unwrap(&self) -> u32 {
        self.as_limbs()[0] as u32
    }

    fn wrap(arg: &u32) -> Self {
        Self::from_limbs([*arg as u64])
    }
}

pub type U160 = stylus_sdk::alloy_primitives::U160;

pub type U32 = stylus_sdk::alloy_primitives::U32;
pub type I64 = stylus_sdk::alloy_primitives::I64;

pub type Address = stylus_sdk::alloy_primitives::Address;
