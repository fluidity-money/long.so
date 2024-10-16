#![cfg(all(not(target_arch = "wasm32"), feature = "testing"))]

use proptest::prelude::*;

use libseawater::maths::tick_math::{get_tick_at_sqrt_ratio, get_sqrt_ratio_at_tick};

proptest! {
  #[test]
  fn test_get_sqrt_ratio_at_tick_to_back(tick in -887272..=887272) {
    assert_eq!(get_tick_at_sqrt_ratio(get_sqrt_ratio_at_tick(tick).unwrap()).unwrap(), tick);
  }
}
