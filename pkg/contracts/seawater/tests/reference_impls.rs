// rng based tests of rewritten functions against their reference implementations

use rand::prelude::*;
mod reference;
use ruint::aliases::U256;
use seawater::maths::full_math;
use seawater::maths::tick_math;

fn rand_u256<R: Rng + ?Sized>(rng: &mut R) -> U256 {
    U256::from_limbs([rng.gen(), rng.gen(), rng.gen(), rng.gen()])
}

#[test]
fn test_mul_div() {
    let mut rng = rand::thread_rng();
    let mut errs: i64 = 0;
    for _ in 0..1000 {
        let a = rand_u256(&mut rng);
        let b = rand_u256(&mut rng);
        let denom = rand_u256(&mut rng);

        let res = full_math::mul_div(a, b, denom);
        let reference = reference::full_math::mul_div(a, b, denom);
        if res.is_err() {
            errs += 1;
        }
        assert!((res.is_err() && reference.is_err()) || (res.unwrap() == reference.unwrap()),);

        let res = full_math::mul_div_rounding_up(a, b, denom);
        let reference = reference::full_math::mul_div_rounding_up(a, b, denom);
        assert!((res.is_err() && reference.is_err()) || (res.unwrap() == reference.unwrap()),);
    }
    // make sure that we're actually testing the function
    assert!(errs < 500);
}

#[test]
fn test_get_tick_at_sqrt_ratio() {
    let mut rng = rand::thread_rng();
    let mut errs: i64 = 0;
    for _ in 0..1000 {
        let ratio = U256::from_limbs([
            rng.gen_range(4295128739..=6743328256752651558),
            rng.gen_range(0..=17280870778742802505),
            rng.gen_range(0..=4294805859),
            0,
        ]);

        let tick = tick_math::get_tick_at_sqrt_ratio(ratio);
        let reference = reference::tick_math::get_tick_at_sqrt_ratio(ratio);
        if tick.is_err() {
            errs += 1;
        }
        assert!((tick.is_err() && reference.is_err()) || (tick.unwrap() == reference.unwrap()),);
    }
    // make sure that we're actually testing the function
    assert!(errs < 10);
}
