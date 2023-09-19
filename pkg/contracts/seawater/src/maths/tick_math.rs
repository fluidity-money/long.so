use std::ops::{BitOr, Neg, Shl, Shr};

use crate::types::{U256Extension, I256, U256};

use crate::error::UniswapV3MathError;
use ruint_macro::uint;

pub const MIN_TICK: i32 = -887272;
pub const MAX_TICK: i32 = -MIN_TICK;

pub const MIN_SQRT_RATIO: U256 = U256::from_limbs([4295128739, 0, 0, 0]);
pub const MAX_SQRT_RATIO: U256 =
    U256::from_limbs([6743328256752651558, 17280870778742802505, 4294805859, 0]);

pub fn get_sqrt_ratio_at_tick(tick: i32) -> Result<U256, UniswapV3MathError> {
    let abs_tick = if tick < 0 {
        U256::from(tick.neg())
    } else {
        U256::from(tick)
    };

    if abs_tick > U256::from(MAX_TICK) {
        return Err(UniswapV3MathError::T);
    }

    let mut ratio = if abs_tick & (U256::from(0x1)) != U256::zero() {
        uint!(0xfffcb933bd6fad37aa2d162d1a594001_U256)
    } else {
        uint!(0x100000000000000000000000000000000_U256)
    };

    if !(abs_tick & (U256::from(0x2))).is_zero() {
        ratio = (ratio * uint!(0xfff97272373d413259a46990580e213a_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x4))).is_zero() {
        ratio = (ratio * uint!(0xfff2e50f5f656932ef12357cf3c7fdcc_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x8))).is_zero() {
        ratio = (ratio * uint!(0xffe5caca7e10e4e61c3624eaa0941cd0_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x10))).is_zero() {
        ratio = (ratio * uint!(0xffcb9843d60f6159c9db58835c926644_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x20))).is_zero() {
        ratio = (ratio * uint!(0xff973b41fa98c081472e6896dfb254c0_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x40))).is_zero() {
        ratio = (ratio * uint!(0xff2ea16466c96a3843ec78b326b52861_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x80))).is_zero() {
        ratio = (ratio * uint!(0xfe5dee046a99a2a811c461f1969c3053_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x100))).is_zero() {
        ratio = (ratio * uint!(0xfcbe86c7900a88aedcffc83b479aa3a4_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x200))).is_zero() {
        ratio = (ratio * uint!(0xf987a7253ac413176f2b074cf7815e54_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x400))).is_zero() {
        ratio = (ratio * uint!(0xf3392b0822b70005940c7a398e4b70f3_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x800))).is_zero() {
        ratio = (ratio * uint!(0xe7159475a2c29b7443b29c7fa6e889d9_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x1000))).is_zero() {
        ratio = (ratio * uint!(0xd097f3bdfd2022b8845ad8f792aa5825_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x2000))).is_zero() {
        ratio = (ratio * uint!(0xa9f746462d870fdf8a65dc1f90e061e5_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x4000))).is_zero() {
        ratio = (ratio * uint!(0x70d869a156d2a1b890bb3df62baf32f7_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x8000))).is_zero() {
        ratio = (ratio * uint!(0x31be135f97d08fd981231505542fcfa6_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x10000))).is_zero() {
        ratio = (ratio * uint!(0x9aa508b5b7a84e1c677de54f3e99bc9_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x20000))).is_zero() {
        ratio = (ratio * uint!(0x5d6af8dedb81196699c329225ee604_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x40000))).is_zero() {
        ratio = (ratio * uint!(0x2216e584f5fa1ea926041bedfe98_U256)) >> 128
    }
    if !(abs_tick & (U256::from(0x80000))).is_zero() {
        ratio = (ratio * uint!(0x48a170391f7dc42444e8fa2_U256)) >> 128
    }

    if tick > 0 {
        ratio = U256::MAX / ratio;
    }

    Ok((ratio >> 32)
        + if (ratio % (U256::one() << 32)).is_zero() {
            U256::zero()
        } else {
            U256::one()
        })
}

pub fn get_tick_at_sqrt_ratio(sqrt_price_x_96: U256) -> Result<i32, UniswapV3MathError> {
    if !(sqrt_price_x_96 >= MIN_SQRT_RATIO && sqrt_price_x_96 < MAX_SQRT_RATIO) {
        return Err(UniswapV3MathError::R);
    }

    // binary search
    let mut low_bound = MIN_TICK;
    let mut high_bound = MAX_TICK;

    let mut closest = low_bound;
    while low_bound <= high_bound {
        let mid = (low_bound + high_bound) / 2;
        let mid_price = get_sqrt_ratio_at_tick(mid)?;

        if mid_price > sqrt_price_x_96 {
            high_bound = mid - 1;
        }
        if mid_price < sqrt_price_x_96 {
            closest = mid;
            low_bound = mid + 1;
        }
        if mid_price == sqrt_price_x_96 {
            return Ok(mid);
        }
    }

    Ok(closest)
}

mod reference {
    use super::*;
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

        let log_sqrt10001 =
            log_2.wrapping_mul(I256::from_raw(uint!(255738958999603826347141_U256)));

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
}

pub fn get_min_tick(spacing: u8) -> i32 {
    let spacing = spacing as i32;
    (MIN_TICK / spacing) * spacing
}
pub fn get_max_tick(spacing: u8) -> i32 {
    let spacing = spacing as i32;
    (MAX_TICK / spacing) * spacing
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::types::U256;
    use std::ops::Sub;

    #[test]
    fn get_sqrt_ratio_at_tick_bounds() {
        // the function should return an error if the tick is out of bounds
        if let Err(err) = get_sqrt_ratio_at_tick(MIN_TICK - 1) {
            assert!(matches!(err, UniswapV3MathError::T));
        } else {
            panic!("get_qrt_ratio_at_tick did not respect lower tick bound")
        }
        if let Err(err) = get_sqrt_ratio_at_tick(MAX_TICK + 1) {
            assert!(matches!(err, UniswapV3MathError::T));
        } else {
            panic!("get_qrt_ratio_at_tick did not respect upper tick bound")
        }
    }

    #[test]
    fn get_sqrt_ratio_at_tick_values() {
        // test individual values for correct results
        assert_eq!(
            get_sqrt_ratio_at_tick(MIN_TICK).unwrap(),
            U256::from(4295128739u64),
            "sqrt ratio at min incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(MIN_TICK + 1).unwrap(),
            U256::from(4295343490u64),
            "sqrt ratio at min + 1 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(MAX_TICK - 1).unwrap(),
            U256::from_dec_str("1461373636630004318706518188784493106690254656249").unwrap(),
            "sqrt ratio at max - 1 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(MAX_TICK).unwrap(),
            U256::from_dec_str("1461446703485210103287273052203988822378723970342").unwrap(),
            "sqrt ratio at max incorrect"
        );
        // checking hard coded values against solidity results
        assert_eq!(
            get_sqrt_ratio_at_tick(50).unwrap(),
            U256::from(79426470787362580746886972461u128),
            "sqrt ratio at 50 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(100).unwrap(),
            U256::from(79625275426524748796330556128u128),
            "sqrt ratio at 100 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(250).unwrap(),
            U256::from(80224679980005306637834519095u128),
            "sqrt ratio at 250 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(500).unwrap(),
            U256::from(81233731461783161732293370115u128),
            "sqrt ratio at 500 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(1000).unwrap(),
            U256::from(83290069058676223003182343270u128),
            "sqrt ratio at 1000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(2500).unwrap(),
            U256::from(89776708723587163891445672585u128),
            "sqrt ratio at 2500 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(3000).unwrap(),
            U256::from(92049301871182272007977902845u128),
            "sqrt ratio at 3000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(4000).unwrap(),
            U256::from(96768528593268422080558758223u128),
            "sqrt ratio at 4000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(5000).unwrap(),
            U256::from(101729702841318637793976746270u128),
            "sqrt ratio at 5000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(50000).unwrap(),
            U256::from(965075977353221155028623082916u128),
            "sqrt ratio at 50000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(150000).unwrap(),
            U256::from(143194173941309278083010301478497u128),
            "sqrt ratio at 150000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(250000).unwrap(),
            U256::from(21246587762933397357449903968194344u128),
            "sqrt ratio at 250000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(500000).unwrap(),
            U256::from_dec_str("5697689776495288729098254600827762987878").unwrap(),
            "sqrt ratio at 500000 incorrect"
        );
        assert_eq!(
            get_sqrt_ratio_at_tick(738203).unwrap(),
            U256::from_dec_str("847134979253254120489401328389043031315994541").unwrap(),
            "sqrt ratio at 738203 incorrect"
        );
    }

    #[test]
    pub fn test_get_tick_at_sqrt_ratio() {
        //throws for too low
        let result = get_tick_at_sqrt_ratio(MIN_SQRT_RATIO.sub(U256::one()));
        assert_eq!(result.unwrap_err().to_string(), "Second inequality must be < because the price can never reach the price at the max tick");

        //throws for too high
        let result = get_tick_at_sqrt_ratio(MAX_SQRT_RATIO);
        assert_eq!(result.unwrap_err().to_string(), "Second inequality must be < because the price can never reach the price at the max tick");

        //ratio of min tick
        let result = get_tick_at_sqrt_ratio(MIN_SQRT_RATIO).unwrap();
        assert_eq!(result, MIN_TICK);

        //ratio of min tick + 1
        let result = get_tick_at_sqrt_ratio(U256::from_dec_str("4295343490").unwrap()).unwrap();
        assert_eq!(result, MIN_TICK + 1);
    }

    use rand::prelude::*;

    #[test]
    pub fn test_get_tick_at_sqrt_ratio_random() {
        let mut rng = rand::thread_rng();
        let mut errs: i64 = 0;
        for _ in 0..1000 {
            let ratio = U256::from_limbs([
                rng.gen_range(4295128739..=6743328256752651558),
                rng.gen_range(0..=17280870778742802505),
                rng.gen_range(0..=4294805859),
                0,
            ]);

            let tick = get_tick_at_sqrt_ratio(ratio);
            let reference = reference::get_tick_at_sqrt_ratio(ratio);
            if tick.is_err() {
                errs += 1;
            }
            assert!((tick.is_err() && reference.is_err()) || (tick.unwrap() == reference.unwrap()),);
        }
        // make sure that we're actually testing the function
        assert!(errs < 10);
    }
}
