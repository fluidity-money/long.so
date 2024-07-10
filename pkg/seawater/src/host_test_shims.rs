//! Shim module to provide normally stylus-provided functions to link to in an unhosted
//! environment.
//!
//! Functions here are gated on tests, since normal contract execution should have the hosted
//! stylus environment.

use crate::U256;

static DEFAULT_SENDER: [u8; 20] = [
    //0x59e8db5c2e506ddd395d58a1dd8cd02b81ecbd6c
    0x59, 0xe8, 0xdb, 0x5c, 0x2e, 0x50, 0x6d, 0xdd, 0x39, 0x5d, 0x58, 0xa1, 0xdd, 0x8c, 0xd0, 0x2b,
    0x81, 0xec, 0xbd, 0x6c,
];

#[no_mangle]
pub extern "C" fn native_keccak256(bytes: *const u8, len: usize, output: *mut u8) {
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

pub mod storage {
    use std::collections::HashMap;
    use std::ptr;
    use std::sync::LazyLock;
    use std::sync::Mutex;

    use crate::types::U256;

    const WORD_BYTES: usize = 32;
    pub type Word = [u8; WORD_BYTES];
    pub type WordHashMap = HashMap<Word, Word>;

    pub static STORAGE_EXTERNAL: Mutex<()> = Mutex::new(());

    pub static CURRENT_SENDER: LazyLock<Mutex<Option<[u8; 20]>>> =
        LazyLock::new(|| Mutex::new(None));

    pub static STORAGE: LazyLock<Mutex<WordHashMap>> = LazyLock::new(|| Mutex::new(HashMap::new()));

    pub static DEFAULT_CALLER_BAL: U256 = U256::MAX;

    pub static DEFAULT_AMM_BAL: U256 = U256::MAX;

    pub static CALLER_BAL: LazyLock<Mutex<U256>> = LazyLock::new(|| Mutex::new(DEFAULT_CALLER_BAL));

    pub static AMM_BAL: LazyLock<Mutex<U256>> = LazyLock::new(|| Mutex::new(DEFAULT_AMM_BAL));

    pub unsafe fn read_word(key: *const u8) -> Word {
        let mut res = Word::default();
        ptr::copy(key, res.as_mut_ptr(), WORD_BYTES);
        res
    }

    pub unsafe fn write_word(key: *mut u8, val: Word) {
        ptr::copy(val.as_ptr(), key, WORD_BYTES);
    }
}

#[no_mangle]
pub extern "C" fn storage_store_bytes32(key: *const u8, value: *const u8) {
    let (key, value) = unsafe {
        // SAFETY - stylus insists these will both be valid words
        (storage::read_word(key), storage::read_word(value))
    };

    storage::STORAGE.lock().unwrap().insert(key, value);
}

#[no_mangle]
pub extern "C" fn storage_cache_bytes32(key: *const u8, value: *const u8) {
    // do the same as storage... for now. if the tests are more comprehensive
    // this may need to change.
    storage_store_bytes32(key, value);
}

#[no_mangle]
pub extern "C" fn storage_flush_cache(_clear: bool) {
    // do nothing
}

#[no_mangle]
pub extern "C" fn storage_load_bytes32(key: *const u8, out: *mut u8) {
    use crate::current_test;

    // SAFETY - stylus promises etc
    let key = unsafe { storage::read_word(key) };

    let value = storage::STORAGE
        .lock()
        .unwrap()
        .get(&key)
        .map(storage::Word::to_owned)
        .unwrap_or_default(); // defaults to zero value

    #[cfg(feature = "testing")]
    #[cfg(feature = "testing-dbg-pool-storage")]
    dbg!((
        "read word",
        current_test!(),
        const_hex::const_encode::<32, false>(&key).as_str(),
        const_hex::const_encode::<32, false>(&value).as_str(),
    ));

    unsafe { storage::write_word(out, value) };
}

#[no_mangle]
pub unsafe extern "C" fn msg_sender(sender: *mut u8) {
    // copy the currently defined sender and return the pointer, or default
    let addr = match storage::CURRENT_SENDER.lock().unwrap().clone() {
        Some(a) => a,
        None => DEFAULT_SENDER,
    };
    std::ptr::copy(addr.as_ptr(), sender, 20);
}

#[no_mangle]
pub unsafe extern "C" fn emit_log(_: *const u8, _: usize, _: usize) {
    // do nothing, we just don't create logs on the host
}

pub fn set_sender(new_sender: [u8; 20]) {
    let mut sender = storage::CURRENT_SENDER.lock().unwrap();
    *sender = Some(new_sender);
}

pub fn set_caller_bal(amount: U256) {
    let mut bal = storage::CALLER_BAL.lock().unwrap();
    *bal = amount;
}

pub fn set_amm_bal(amount: U256) {
    let mut bal = storage::AMM_BAL.lock().unwrap();
    *bal = amount;
}

pub fn insert_word(key: storage::Word, value: storage::Word) {
    // insert a word for testing reasons
    let _ = storage::STORAGE.lock().unwrap().insert(key, value);
}

pub fn reset_storage() {
    storage::STORAGE.lock().unwrap().clear();
    let mut sender = storage::CURRENT_SENDER.lock().unwrap();
    *sender = None;
    let mut caller_bal = storage::CALLER_BAL.lock().unwrap();
    *caller_bal = storage::DEFAULT_CALLER_BAL;
    let mut amm_bal = storage::AMM_BAL.lock().unwrap();
    *amm_bal = storage::DEFAULT_AMM_BAL;
}

pub fn take_caller_bal(amt: U256) -> Result<(), U256> {
    let mut caller_bal = storage::CALLER_BAL.lock().unwrap();
    let (leftover, overflow) = caller_bal.overflowing_sub(amt);
    if overflow {
        Err(amt - amt)
    } else {
        *caller_bal = leftover;
        Ok(())
    }
}

pub fn take_amm_bal(amt: U256) -> Result<(), U256> {
    let mut amm_bal = storage::AMM_BAL.lock().unwrap();
    let (leftover, overflow) = amm_bal.overflowing_sub(amt);
    if overflow {
        Err(amt - amt)
    } else {
        *amm_bal = leftover;
        Ok(())
    }
}

pub fn acquire_storage() -> std::sync::MutexGuard<'static, ()> {
    storage::STORAGE_EXTERNAL.lock().unwrap()
}
