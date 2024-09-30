use std::{
    fs::File,
    io::{self, BufRead},
    str::FromStr,
};

use stylus_sdk::alloy_primitives::U256;

use libseawater::maths::sqrt_price_math::get_liquidity_for_amounts;

#[test]
fn test_get_liq_for_amounts_high_failure_rate() {
    let f = File::open("tests/get-liq-for-amounts.lst").unwrap();
    for (i, line) in io::BufReader::new(f).lines().flatten().enumerate() {
        if line.is_empty() {
            continue;
        }
        let [sqrt_price, low, up, amount0, amount1, expected]: [_; 6] =
            line.split(",").collect::<Vec<_>>().try_into().unwrap();
        let sqrt_price = U256::from_str(sqrt_price).unwrap();
        let low = U256::from_str(low).unwrap();
        let up = U256::from_str(up).unwrap();
        let amount0 = U256::from_str(amount0).unwrap();
        let amount1 = U256::from_str(amount1).unwrap();
        match (
            expected,
            get_liquidity_for_amounts(sqrt_price, low, up, amount0, amount1),
        ) {
            ("FAILED", Ok(v)) => panic!("NOTFAILED line {}, {v}", i + 1),
            (_, Ok(v)) => {
                let expected = u128::from_str(expected).unwrap();
                assert_eq!(v, expected)
            }
            ("FAILED", Err(_)) => (),
            (_, err) => panic!(
                "UNEXPECTED FAIL line {}, expected {}, {:?}",
                i + 1,
                expected,
                err
            ),
        }
    }
}
