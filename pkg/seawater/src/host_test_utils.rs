///! Functions for testing including the setup function for storage.
use std::collections::HashMap;

use stylus_sdk::storage::StorageCache;

use crate::test_utils::StorageNew;

use crate::{
    test_shims::{self},
    types::*,
};

///! Set up the storage access, controlling for parallel use.
pub fn with_storage<T, P: StorageNew, F: FnOnce(&mut P) -> T>(
    sender: Option<[u8; 20]>,
    slots: Option<HashMap<&str, &str>>,
    caller_bals: Option<HashMap<Address, U256>>,
    amm_bals: Option<HashMap<Address, U256>>,
    f: F,
) -> T {
    StorageCache::clear();
    test_shims::reset_storage();
    if let Some(v) = sender {
        test_shims::set_sender(v);
    }
    if let Some(items) = caller_bals {
        test_shims::set_caller_bals(items);
    }
    if let Some(items) = amm_bals {
        test_shims::set_amm_bals(items);
    }
    if let Some(items) = slots {
        set_storage(items);
    }
    f(&mut P::new(U256::ZERO, 0))
}

///! Set the slot storage with a hashmap for the current thread.
pub fn set_storage(items: HashMap<&str, &str>) {
    for (key, value) in items {
        test_shims::insert_word(
            const_hex::const_decode_to_array::<32>(key.as_bytes())
                .unwrap_or_else(|_| panic!("failed to decode key: {:?}", key)),
            const_hex::const_decode_to_array::<32>(value.as_bytes())
                .unwrap_or_else(|_| panic!("failed to decode value: {:?}", value)),
        );
    }
}
