// provide the native_keccak256 function for alloy to link to

#[cfg(test)]
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

// TODO this api is bad, just construct a map inline
#[cfg(test)]
mod storage {
    use std::collections::HashMap;
    use std::ptr;
    use std::sync::LazyLock;
    use std::sync::Mutex;

    const WORD_BYTES: usize = 32;
    pub type Word = [u8; WORD_BYTES];

    pub static STORAGE_EXTERNAL: Mutex<()> = Mutex::new(());

    pub static STORAGE: LazyLock<Mutex<HashMap<Word, Word>>> =
        LazyLock::new(|| Mutex::new(HashMap::new()));

    pub unsafe fn read_word(key: *const u8) -> Word {
        let mut res = Word::default();
        ptr::copy(key, res.as_mut_ptr(), WORD_BYTES);
        res
    }

    pub unsafe fn write_word(key: *mut u8, val: Word) {
        ptr::copy(val.as_ptr(), key, WORD_BYTES);
    }
}

#[cfg(test)]
#[no_mangle]
pub extern "C" fn storage_store_bytes32(key: *const u8, value: *const u8) {
    let (key, value) = unsafe {
        // SAFETY - stylus insists these will both be valid words
        (storage::read_word(key), storage::read_word(value))
    };

    storage::STORAGE.lock().unwrap().insert(key, value);
}

#[cfg(test)]
#[no_mangle]
pub extern "C" fn storage_load_bytes32(key: *const u8, out: *mut u8) {
    // SAFETY - stylus promises etc
    let key = unsafe { storage::read_word(key) };

    let value = storage::STORAGE
        .lock()
        .unwrap()
        .get(&key)
        .map(storage::Word::to_owned)
        .unwrap_or_default(); // defaults to zero value

    unsafe { storage::write_word(out, value) };
}

#[cfg(test)]
pub fn log_storage() {
    println!("{:?}", storage::STORAGE.lock().unwrap());
}

#[cfg(test)]
pub fn reset_storage() {
    storage::STORAGE.lock().unwrap().clear();
}

#[cfg(test)]
pub fn acquire_storage() -> std::sync::MutexGuard<'static, ()> {
    storage::STORAGE_EXTERNAL.lock().unwrap()
}
