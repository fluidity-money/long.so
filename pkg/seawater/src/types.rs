// reexports and extension traits

// reexport so we can keep the types the same
pub use stylus_sdk;

use crate::error::Error;

pub type U256 = stylus_sdk::alloy_primitives::U256;
pub trait U256Extension: Sized {
    fn is_zero(&self) -> bool;
    fn zero() -> Self;
    fn one() -> Self;

    #[cfg(test)]
    fn from_hex_str(value: &str) -> Self;
    #[cfg(test)]
    fn from_dec_str(value: &str) -> Option<Self>;
}

impl U256Extension for U256 {
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
}

pub type I256 = stylus_sdk::alloy_primitives::I256;

pub trait I256Extension: Sized {
    fn zero() -> Self;
    fn one() -> Self;
    fn abs_neg(self) -> Result<U256, Error>;
    fn abs_pos(self) -> Result<U256, Error>;
}

impl I256Extension for I256 {
    fn zero() -> Self {
        Self::ZERO
    }

    fn one() -> Self {
        Self::ONE
    }

    fn abs_neg(self) -> Result<U256, Error> {
        if self.is_positive() {
            return Err(Error::CheckedAbsIsNegative);
        }
        Ok(self.checked_abs().ok_or(Error::AbsTooLow)?.into_raw())
    }
    fn abs_pos(self) -> Result<U256, Error> {
        if self.is_negative() {
            return Err(Error::CheckedAbsIsPositive);
        }
        Ok(self.checked_abs().ok_or(Error::AbsTooLow)?.into_raw())
    }
}

pub type U128 = stylus_sdk::alloy_primitives::U128;
pub type I128 = stylus_sdk::alloy_primitives::I128;
pub type I32 = stylus_sdk::alloy_primitives::I32;
pub type U8 = stylus_sdk::alloy_primitives::U8;

// ersatz From and Into
// wraps into W
pub trait WrappedNative<W> {
    // system type
    fn sys(&self) -> W;
    // library type
    fn lib(arg: &W) -> Self;
}

impl WrappedNative<i128> for I128 {
    fn sys(&self) -> i128 {
        i128::from_le_bytes(self.to_le_bytes())
    }

    fn lib(arg: &i128) -> Self {
        I128::from_le_bytes(arg.to_le_bytes())
    }
}
impl WrappedNative<u128> for U128 {
    fn sys(&self) -> u128 {
        u128::from_le_bytes(self.to_le_bytes())
    }

    fn lib(arg: &u128) -> Self {
        U128::from_le_bytes(arg.to_le_bytes())
    }
}
impl WrappedNative<i32> for I32 {
    fn sys(&self) -> i32 {
        self.as_i32()
    }

    fn lib(arg: &i32) -> Self {
        I32::unchecked_from(*arg)
    }
}
impl WrappedNative<u8> for U8 {
    fn sys(&self) -> u8 {
        self.as_limbs()[0] as u8
    }

    fn lib(arg: &u8) -> Self {
        Self::from_limbs([*arg as u64])
    }
}

impl WrappedNative<u32> for U32 {
    fn sys(&self) -> u32 {
        self.as_limbs()[0] as u32
    }

    fn lib(arg: &u32) -> Self {
        Self::from_limbs([*arg as u64])
    }
}

pub type U160 = stylus_sdk::alloy_primitives::U160;

pub type U32 = stylus_sdk::alloy_primitives::U32;
pub type I64 = stylus_sdk::alloy_primitives::I64;

pub type Address = stylus_sdk::alloy_primitives::Address;
