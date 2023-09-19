use ruint_macro::uint;
use seawater::error::UniswapV3MathError;
use seawater::maths::tick_math::*;
use seawater::types::{U256Extension, I256, U256};
use std::ops::{BitOr, Neg, Shl, Shr};

pub fn get_tick_at_sqrt_ratio(sqrt_price_x_96: U256) -> Result<i32, UniswapV3MathError> {
    if !(sqrt_price_x_96 >= MIN_SQRT_RATIO && sqrt_price_x_96 < MAX_SQRT_RATIO) {
        return Err(UniswapV3MathError::R);
    }

    let ratio = sqrt_price_x_96.shl(32);
    let mut r = ratio;
    let mut msb = U256::zero();

    let mut f = if r > uint!(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF_U256) {
        U256::one().shl(7)
    } else {
        U256::zero()
    };
    msb = msb.bitor(f);
    r = r.shr(usize::try_from(f).unwrap());

    f = if r > uint!(0xFFFFFFFFFFFFFFFF_U256) {
        U256::one().shl(6)
    } else {
        U256::zero()
    };
    msb = msb.bitor(f);
    r = r.shr(usize::try_from(f).unwrap());

    f = if r > uint!(0xFFFFFFFF_U256) {
        U256::one().shl(5)
    } else {
        U256::zero()
    };
    msb = msb.bitor(f);
    r = r.shr(usize::try_from(f).unwrap());

    f = if r > uint!(0xFFFF_U256) {
        U256::one().shl(4)
    } else {
        U256::zero()
    };
    msb = msb.bitor(f);
    r = r.shr(usize::try_from(f).unwrap());

    f = if r > uint!(0xFF_U256) {
        U256::one().shl(3)
    } else {
        U256::zero()
    };
    msb = msb.bitor(f);
    r = r.shr(usize::try_from(f).unwrap());

    f = if r > uint!(0xF_U256) {
        U256::one().shl(2)
    } else {
        U256::zero()
    };
    msb = msb.bitor(f);
    r = r.shr(usize::try_from(f).unwrap());

    f = if r > uint!(0x3_U256) {
        U256::one().shl(1)
    } else {
        U256::zero()
    };
    msb = msb.bitor(f);
    r = r.shr(usize::try_from(f).unwrap());

    f = if r > uint!(0x1_U256) {
        U256::one()
    } else {
        U256::zero()
    };

    msb = msb.bitor(f);

    r = if msb >= U256::from(128) {
        ratio.shr(usize::try_from(msb - U256::from(127)).unwrap())
    } else {
        ratio.shl(usize::try_from(U256::from(127) - msb).unwrap())
    };

    let mut log_2: I256 = (I256::from_raw(msb) - I256::unchecked_from(128)).shl(64);

    for i in (51..=63).rev() {
        r = r.overflowing_mul(r).0.shr(127);
        let f = r.shr(128);
        log_2 = log_2.bitor(I256::from_raw(f.shl(i)));

        r = r.shr(usize::try_from(f).unwrap());
    }

    r = r.overflowing_mul(r).0.shr(127);
    let f = r.shr(128);
    log_2 = log_2.bitor(I256::from_raw(f.shl(50)));

    let log_sqrt10001 = log_2.wrapping_mul(I256::from_raw(uint!(255738958999603826347141_U256)));

    let tick_low = ((log_sqrt10001
        - I256::from_raw(uint!(3402992956809132418596140100660247210_U256)))
        >> 128_u8)
        .low_i32();

    let tick_high = ((log_sqrt10001
        + I256::from_raw(uint!(291339464771989622907027621153398088495_U256)))
        >> 128_u8)
        .low_i32();

    let tick = if tick_low == tick_high {
        tick_low
    } else if get_sqrt_ratio_at_tick(tick_high)? <= sqrt_price_x_96 {
        tick_high
    } else {
        tick_low
    };

    Ok(tick)
}
