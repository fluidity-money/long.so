use std::collections::HashMap;

use std::cell::RefCell;
use std::ptr;
use std::time;

use crate::StorageNew;

use stylus_sdk::alloy_primitives::{Address, U256};

const WORD_BYTES: usize = 32;
pub type Word = [u8; WORD_BYTES];

thread_local! {
    pub static CURRENT_SENDER: RefCell<[u8; 20]> =
        const { RefCell::new([0; 20]) };

    pub static STORAGE: RefCell<HashMap<Word, Word>> = RefCell::new(HashMap::new());

    pub static POSITIONS: RefCell<HashMap<U256, (Address, i32, i32, u128)>> = RefCell::new(HashMap::new());

    pub static CURRENT_TIME: RefCell<u64> = const { RefCell::new(0) };
}

unsafe fn read_word(key: *const u8) -> Word {
    let mut res = Word::default();
    ptr::copy(key, res.as_mut_ptr(), WORD_BYTES);
    res
}

unsafe fn write_word(key: *mut u8, val: Word) {
    ptr::copy(val.as_ptr(), key, WORD_BYTES);
}

pub fn reset_storage() {
    STORAGE.with(|s| s.borrow_mut().clear())
}

/// # Safety
///
/// This will read the word from the bytes array, and should be fine as it uses
/// thread-local storage for storage access.
#[no_mangle]
pub unsafe extern "C" fn storage_store_bytes32(key: *const u8, value: *const u8) {
    let (key, value) = unsafe {
        // SAFETY - stylus insists these will both be valid words
        (read_word(key), read_word(value))
    };
    STORAGE.with(|storage| storage.borrow_mut().insert(key, value));
}

/// # Safety
///
/// This will call the code that will store the bytes, eliminating the caching step.
/// This should be fine since the cache flush code doesn't do anything.
#[no_mangle]
pub unsafe extern "C" fn storage_cache_bytes32(key: *const u8, value: *const u8) {
    // do the same as storage... for now. if the tests are more comprehensive
    // this may need to change.
    storage_store_bytes32(key, value);
}

/// # Safety
///
/// This will use tiny_keccak to do any keccak in lieu of the EVM being available!
#[no_mangle]
pub unsafe extern "C" fn native_keccak256(bytes: *const u8, len: usize, output: *mut u8) {
    // SAFETY
    // stylus promises `bytes` will have length `len`, `output` will have length one word
    use std::slice;
    use tiny_keccak::{Hasher, Keccak};

    let mut hasher = Keccak::v256();

    let data = unsafe { slice::from_raw_parts(bytes, len) };
    hasher.update(data);

    let output = unsafe { slice::from_raw_parts_mut(output, 32) };
    hasher.finalize(output);
}

#[no_mangle]
pub fn block_timestamp() -> u64 {
    CURRENT_TIME.with(|t| *t.borrow())
}

/// # Safety
///
/// This won't do anything, and should be safe to use.
#[no_mangle]
pub unsafe fn storage_flush_cache(_clear: bool) {}

/// # Safety
///
/// This won't do anything, and should be safe to use all the time.
#[no_mangle]
pub unsafe extern "C" fn emit_log(_pointer: *const u8, _len: usize, _: usize) {}

/// # Safety
///
/// This will copy a word from the hashmap into the pointer given, or blow up trying.
#[no_mangle]
pub unsafe extern "C" fn storage_load_bytes32(key: *const u8, out: *mut u8) {
    // SAFETY - stylus promises etc
    let key = unsafe { read_word(key) };

    let value = STORAGE.with(|storage| {
        storage
            .borrow()
            .get(&key)
            .map(Word::to_owned)
            .unwrap_or_default()
    });

    unsafe { write_word(out, value) };
}

/// # Safety
///
/// This won't do anything. Which should default to zero address.
#[no_mangle]
pub unsafe extern "C" fn msg_sender(_sender: *mut u8) {}

/// # Safety
///
/// This won't do anything. Which should default to zero address.
#[no_mangle]
pub unsafe extern "C" fn contract_address(_addr: *mut u8) {}

pub fn position_tick_lower(id: U256) -> Option<i32> {
    POSITIONS.with(|p| p.borrow().get(&id).map(|(_, t, _, _)| *t))
}

pub fn position_tick_upper(id: U256) -> Option<i32> {
    POSITIONS.with(|p| p.borrow().get(&id).map(|(_, _, t, _)| *t))
}

pub fn position_liquidity(id: U256) -> Option<u128> {
    POSITIONS.with(|p| p.borrow().get(&id).map(|(_, _, _, l)| *l))
}

// Helper function for getting the actual timestamp, not the cached value.
pub fn current_timestamp() -> u64 {
    time::SystemTime::now()
        .duration_since(time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

/// Set up the storage access.
pub fn with_storage<T, P: StorageNew, F: FnOnce(&mut P) -> T>(
    pos_info: &[(Address, U256, i32, i32, u128)],
    f: F,
) -> T {
    reset_storage();
    CURRENT_TIME.with(|t| {
        let mut ts = t.borrow_mut();
        *ts = current_timestamp();
    });
    POSITIONS.with(|positions| {
        let mut h = positions.borrow_mut();
        h.clear();
        for &(pool, lp_tokens, lower, upper, liq) in pos_info {
            h.insert(lp_tokens, (pool, lower, upper, liq));
        }
    });
    f(&mut P::new(U256::ZERO, 0))
}
