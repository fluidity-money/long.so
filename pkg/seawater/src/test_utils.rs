use std::collections::HashMap;

use stylus_sdk::{alloy_primitives::address, storage::StorageCache};

use crate::{maths::sqrt_price_math::Q96, types::*, vm_hooks};

// hack to get the name of the current test running
#[macro_export]
macro_rules! current_test {
    () => {
        // the rust test framework usually names the thread the same as the running test, as long as
        // tests are configured to run multithreaded
        std::thread::current().name().unwrap()
    };
}

const DEFAULT_SENDER: Address = address!("feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5");

pub fn decode_sqrt_price_num(sqrt_price_x96: U256, denom: u64) -> U256 {
    let numerator = sqrt_price_x96.pow(U256::from(2)) * U256::from(denom);
    numerator >> 192
}

// encodes a a/b price as a sqrt.q96 price
pub fn encode_sqrt_price(num: u64, denom: u64) -> U256 {
    let num = U256::from(num);
    let denom = U256::from(denom);

    let ratio = num * Q96 / denom;

    // newton's method
    let mut g = U256::one() * Q96;
    let two = U256::from(2);
    for _ in 0..1000000 {
        let g_new = (g + (ratio * Q96 / g)) / two;
        if g_new == g {
            return g;
        }
        g = g_new;
    }

    panic!("encode_sqrt_price did not converge after 1000000 iters")
}

// encode a price as tick (log_1.0001(num/denom))
pub fn encode_tick(price: u64) -> i32 {
    ((price as f64).ln() / 1.0001f64.ln()).floor() as i32
}

// splits a q96 fixed point into whole and fractional components
pub fn split_q96(val: U256) -> (U256, U256) {
    (val >> 96, val % Q96)
}

pub trait StorageNew {
    fn new(i: U256, v: u8) -> Self;
}

/// Set up the storage access, controlling for parallel use.
pub fn with_storage<T, P: StorageNew, F: FnOnce(&mut P) -> T>(
    slots: Option<HashMap<&str, &str>>,
    caller_bals: Option<HashMap<Address, U256>>,
    amm_bals: Option<HashMap<Address, U256>>,
    f: F,
) -> T {
    StorageCache::clear();
    vm_hooks::reset_storage();
    vm_hooks::set_sender(DEFAULT_SENDER.into_array());
    if let Some(items) = caller_bals {
        vm_hooks::set_caller_bals(items);
    }
    if let Some(items) = amm_bals {
        vm_hooks::set_amm_bals(items);
    }
    if let Some(items) = slots {
        set_storage(items);
    }
    f(&mut P::new(U256::ZERO, 0))
}

/// Set the slot storage with a hashmap for the current thread.
pub fn set_storage(items: HashMap<&str, &str>) {
    for (key, value) in items {
        vm_hooks::insert_word(
            const_hex::const_decode_to_array::<32>(key.as_bytes())
                .unwrap_or_else(|_| panic!("failed to decode key: {:?}", key)),
            const_hex::const_decode_to_array::<32>(value.as_bytes())
                .unwrap_or_else(|_| panic!("failed to decode value: {:?}", value)),
        );
    }
}

#[test]
fn test_encode_sqrt_price() {
    let price = encode_sqrt_price(16, 1);
    assert_eq!(split_q96(price), (U256::from(4), U256::from(0)));

    let price = encode_sqrt_price(4, 1);
    assert_eq!(split_q96(price), (U256::from(2), U256::from(0)));

    let price = encode_sqrt_price(10, 1);
    assert_eq!(split_q96(price).0, U256::from(3));
}
