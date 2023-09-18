// provide the native_keccak256 function for alloy to link to

#[cfg(test)]
#[no_mangle]
pub extern "C" fn native_keccak256(bytes: *const u8, len: usize, output: *mut u8) {
    // # Safety
    // `bytes` must have length of at least `len`, `output` must have length of at least 32

    use std::slice;
    use tiny_keccak::{Hasher, Keccak};

    let mut hasher = Keccak::v256();

    let data = unsafe { slice::from_raw_parts(bytes, len) };
    hasher.update(data);

    let output = unsafe { slice::from_raw_parts_mut(output, 32) };
    hasher.finalize(output);
}
