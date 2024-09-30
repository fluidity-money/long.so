use proptest::prelude::*;

use libseawater::maths::liquidity_math;

#[test]
fn test_add_delta_weird() {
    assert_eq!(
        liquidity_math::add_delta(0, 53524466837499715685).unwrap(),
        53524466837499715685
    );
}
