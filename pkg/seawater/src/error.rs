use alloc::vec::Vec;
use thiserror::Error;

// TODO: make these errors better, some errors in univ3 libs are just require(condition) without a message.
#[derive(Error, Debug)]
pub enum UniswapV3MathError {
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
}

impl From<UniswapV3MathError> for Vec<u8> {
    // tests panic with the message - this is a hack to get debuginfo
    #[cfg(test)]
    fn from(val: UniswapV3MathError) -> Self {
        panic!("{}", val);
    }

    // runtime panics with no message - this lets us optimise the strings away
    #[cfg(not(test))]
    fn from(_val: UniswapV3MathError) -> Self {
        panic!()
    }
}