use std::collections::HashMap;

use crate::test_utils::StorageNew;

use stylus_sdk::alloy_primitives::{Address, U256};

pub fn with_storage<T, P: StorageNew, F: FnOnce(&mut P) -> T>(
    _sender: Option<[u8; 20]>,
    _slots: Option<HashMap<&str, &str>>,
    _caller_bals: Option<HashMap<Address, U256>>,
    _amm_bals: Option<HashMap<Address, U256>>,
    f: F,
) -> T {
    f(&mut P::new(U256::ZERO, 0))
}
