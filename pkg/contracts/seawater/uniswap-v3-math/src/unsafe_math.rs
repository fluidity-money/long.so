use crate::types::{U256, U256Extension};

pub fn div_rounding_up(a: U256, b: U256) -> U256 {
    let (quotient, remainder) = a.div_rem(b);
    if remainder.is_zero() {
        quotient
    } else {
        quotient + U256::one()
    }
}
