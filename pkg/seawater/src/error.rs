//! The [enum@Error] enum.

use alloc::{vec, vec::Vec};

/// Asserts that a boolean value is true at runtime, returning an Err if not.
///
/// # Uses
/// This must be used in a function that returns an appropriate [Result], since it uses `?` to
/// coerce the return value.
///
/// This should be used over [assert] in general, since panics don't give us good error messages in
/// stylus.
///
/// # Examples
///
/// ```
/// use libseawater::assert_or;
/// fn normal() -> Result<(), i32> {
///     assert_or!(true, 123);
///     Ok(())
/// }
/// fn fail() -> Result<(), i32> {
///     assert_or!(false, 123);
///     Ok(())
/// }
/// assert_eq!(normal(), Ok(()));
/// assert_eq!(fail(), Err(123));
/// ```
#[macro_export]
macro_rules! assert_or {
    ($cond:expr, $err:expr) => {
        if !($cond) {
            Err($err)?; // question mark forces coercion
        }
    };
}

/// Asserts that two values are equal at runtime, returning an Err if not.
/// See [assert_or].
#[macro_export]
macro_rules! assert_eq_or {
    ($a:expr, $b:expr, $err:expr) => {
        if !($a == $b) {
            Err($err)?;
        }
    };
}

/// Asserts that two values are not equal at runtime, returning an Err if not.
/// See [assert_or].
#[macro_export]
macro_rules! assert_neq_or {
    ($a:expr, $b:expr, $err:expr) => {
        if !($a != $b) {
            Err($err)?;
        }
    };
}

/// The list of possible errors the contract can return.
#[derive(Debug)]
#[repr(u8)]
pub enum Error {
    // 0 (0x00)
    DenominatorIsZero,

    // 1 (0x01)
    ResultIsU256MAX,

    // 2 (0x02)
    SqrtPriceIsZero,

    // 3 (0x03)
    SqrtPriceIsLteQuotient,

    // 4 (0x04)
    ZeroValue,

    // 5 (0x05)
    LiquidityIsZero,

    // 6 (0x06)
    ProductDivAmount,

    // 7 (0x07)
    DenominatorIsLteProdOne,

    // 8 (0x08)
    LiquiditySub,

    // 9 (0x09)
    LiquidityAdd,

    // 10 (0x0a)
    T,

    // 11 (0x0b)
    R,

    // 12 (0x0c)
    SafeCastToU160Overflow,

    // 13 (0x0d)
    LiquidityTooHigh,

    // 14 (0x0e)
    FeeGrowthSubPos,

    // 15 (0x0f)
    Erc20Revert(Vec<u8>),

    // 16 (0x10)
    Erc20RevertNoData,

    // 17 (0x11)
    PoolAlreadyInitialised,

    // 18 (0x012)
    ContractAlreadyInitialised,

    // 19 (0x13)
    PriceLimitTooHigh,

    // 20 (0x14)
    PriceLimitTooLow,

    // 21 (0x15)
    CheckedAbsIsNegative,

    // 22 (0x16)
    CheckedAbsIsPositive,

    // 23 (0x17)
    AbsTooLow,

    // 24 (0x18)
    FeeTooHigh,

    // 25 (0x19)
    SwapResultTooHigh,

    // 26 (0x1a) UNUSED
    InterimSwapNotEq,

    // 27 (0x1b)
    InterimSwapPositive,

    // 28 (0x1c)
    MinOutNotReached,

    // 29 (0x1d)
    PositionOwnerOnly,

    // 30 (0x1e)
    NftManagerOnly,

    // 31 (0x1f)
    SeawaterAdminOnly,

    // 32 (0x20)
    PoolDisabled,

    // 33 (0x21)
    InvalidTickSpacing,

    // 34 (0x22)
    SwapResultTooLow,

    // 35 (0x23)
    LiquidityAmountTooWide,

    // 36 (0x24)
    InvalidTick,

    // 37 (0x25)
    PoolEnabled,

    // 38 (0x26)
    EmptyPosition,

    // 39 (0x27)
    LiqResultTooLow,

    // 40 (0x28)
    SeawaterEmergencyOnlyDisable,

    // 41 (0x29)
    AmountRemainingSub,

    // 42 (0x2a)
    AmountRemainingAdd,

    // 43 (0x2b)
    SamePool,

    // 44 (0x2c)
    TransferToSenderSub,

    // 45 (0x2d)
    BadFeeProtocol,

    // 46 (0x2e)
    BadFee,

    // 47 (0x2f)
    SwapIsZero,

    // 48 (0x30)
    PoolIsNotInitialised,

    // 49 (0x31)
    PositionConvFail,

    // 50 (0x32)
    DebugAssert,

    // 51 (0x33)
    BadPrice,

    // 52 (0x34)
    ReserveSub,

    // 53 (0x35)
    ReserveAdd,
}

impl From<Error> for Vec<u8> {
    // runtime returns the message code to save binary size
    // TODO - once errors are mostly finalised we should find a way to return actual solidity
    // errors
    fn from(val: Error) -> Self {
        // cast the enum to its descriminant
        // https://doc.rust-lang.org/std/mem/fn.discriminant.html
        let id = unsafe { *<*const _>::from(&val).cast::<u8>() };

        let mut e = vec![id];

        if let Error::Erc20Revert(mut err) = val {
            e.append(&mut err);
        }

        e
    }
}
