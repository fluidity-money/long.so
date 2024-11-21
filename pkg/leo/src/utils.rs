pub fn block_timestamp() -> u64 {
    #[cfg(all(feature = "testing", not(target_arch = "wasm32")))]
    return crate::host::block_timestamp();
    #[cfg(not(feature = "testing"))]
    return stylus_sdk::block::timestamp();
}
