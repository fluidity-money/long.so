use alloc::vec::Vec;
use thiserror::Error;

// asserts that return an error instead of panicking, since panics don't give us good error
// messages
#[macro_export]
macro_rules! assert_or {
    ($cond:expr, $err:expr) => {
        if !($cond) {
            Err($err)?; // question mark forces coercion
        }
    };
}

#[macro_export]
macro_rules! assert_eq_or {
    ($a:expr, $b:expr, $err:expr) => {
        if !($a == $b) {
            Err($err)?;
        }
    };
}

#[macro_export]
macro_rules! assert_neq_or {
    ($a:expr, $b:expr, $err:expr) => {
        if !($a != $b) {
            Err($err)?;
        }
    };
}

// TODO: make these errors better, some errors in univ3 libs are just require(condition) without a message.
#[derive(Error, Debug)]
#[repr(u8)]
pub enum Error {
    // 0
    #[error("Denominator is 0")]
    DenominatorIsZero,
    #[error("Result is U256::MAX")]
    ResultIsU256MAX,
    #[error("Sqrt price is 0")]
    SqrtPriceIsZero,
    #[error("Sqrt price is less than or equal to quotient")]
    SqrtPriceIsLteQuotient,
    #[error("Can not get most significant bit or least significant bit on zero value")]
    ZeroValue,
    #[error("Liquidity is 0")]
    LiquidityIsZero,
    //TODO: Update this, shield your eyes for now
    #[error(
        "require((product = amount * sqrtPX96) / amount == sqrtPX96 && numerator1 > product);"
    )]
    ProductDivAmount,
    #[error("Denominator is less than or equal to prod_1")]
    DenominatorIsLteProdOne,
    #[error("Liquidity Sub")]
    LiquiditySub,
    #[error("Liquidity Add")]
    LiquidityAdd,

    // 10
    #[error("The given tick must be less than, or equal to, the maximum tick")]
    T,
    #[error(
        "Second inequality must be < because the price can never reach the price at the max tick"
    )]
    R,
    #[error("Overflow when casting to U160")]
    SafeCastToU160Overflow,
    //#[error("Middleware error when getting next_initialized_tick_within_one_word")]
    //MiddlewareError(String),
    #[error("Liquidity higher than max")]
    LiquidityTooHigh,

    #[error("Fee growth sub overflow")]
    FeeGrowthSub,

    #[error("ERC20 call reverted")]
    Erc20Revert(Vec<u8>),
    #[error("ERC20 call reverted with no data")]
    Erc20RevertNoData,

    #[error("Pool is already initialised")]
    PoolAlreadyInitialised,
    #[error("Contract is already initialised")]
    ContractAlreadyInitialised,
    #[error("Price limit too high")]
    PriceLimitTooHigh,
    // 20
    #[error("Price limit too high")]
    PriceLimitTooLow,

    #[error("Checked abs called on an unexpected positive number")]
    CheckedAbsIsNegative,
    #[error("Checked abs called on an unexpected negative number")]
    CheckedAbsIsPositive,
    #[error("Checked abs called on uint.min")]
    AbsTooLow,

    #[error("Fee result too high")]
    FeeTooHigh,

    #[error("Swap result too high")]
    SwapResultTooHigh,

    #[error("Internal swap amounts not matched")]
    InterimSwapNotEq,

    #[error("Internal swap result was positive")]
    InterimSwapPositive,

    #[error("Minimum out not reached")]
    MinOutNotReached,

    #[error("Only the position owner can use this")]
    PositionOwnerOnly,
    #[error("Only the NFT manager can use this")]
    NftManagerOnly,
    #[error("Only the Seawater admin can use this")]
    SeawaterAdminOnly,
}

impl From<Error> for Vec<u8> {
    // tests return the message
    #[cfg(not(target_arch = "wasm32"))]
     fn from(val: Error) -> Self {
         val.to_string().into()
     }

    // runtime returns the message code to save binary size
    // TODO - once errors are mostly finalised we should find a way to return actual solidity
    // errors
    #[cfg(target_arch = "wasm32")]
    fn from(val: Error) -> Self {
        let id = unsafe { *<*const _>::from(&val).cast::<u8>() };

        let mut e = vec![id];

        if let Error::Erc20Revert(mut err) = val {
           e.append(&mut err);
        }

        e
    }
}
