#![feature(split_array)]

use stylus_sdk::{alloy_primitives::*, prelude::*};

extern crate alloc;
#[cfg(target_arch = "wasm32")]
mod allocator {
    use lol_alloc::{AssumeSingleThreaded, FreeListAllocator};
    // SAFETY: This application is single threaded, so using AssumeSingleThreaded is allowed.
    #[global_allocator]
    static ALLOCATOR: AssumeSingleThreaded<FreeListAllocator> =
        unsafe { AssumeSingleThreaded::new(FreeListAllocator::new()) };
}

#[solidity_storage]
#[entrypoint]
pub struct Leo {}

#[external]
impl Leo {
    // Take a user's LP NFT using the NFT Manager, recording the yield that's
    // accumulated thus far, recording which pools they LP'd with this
    // position, then tracking the position in a map to be collected on
    // weight change.
    pub fn vest_positions(&mut self, positions: Vec<U256>) -> Result<(), Vec<u8>> {
        Ok(())
    }

    // Collect rewards owed to a position, and update the cursor tracking
    // how much they've been owed thus far.
    pub fn collect_rewards(&mut self, positions: Vec<U256>) -> Result<(), Vec<u8>> {
        Ok(())
    }

    // Adjust pool weights for the calculation to determine how much
    // users are owed.
    pub fn set_pool_configs(&mut self, configs: Vec<(Address, U256)>) -> Result<(), Vec<u8>> {
        Ok(())
    }

    // Return the token rewards paid by Seawater for LP'ing in this
    // position.
    pub fn pool_rewards(&self, position: U256) -> Result<(U256, U256), Vec<u8>> {
        Ok((U256::ZERO, U256::ZERO))
    }

    // Return the LP rewards paid by Leo for vesting this NFT position.
    pub fn lp_rewards(&self, position: U256) -> Result<Vec<(Address, U256)>, Vec<u8>> {
        panic!("not implemented");
    }

    // Divest LP positions from this contract, sending them back to the
    // original owner.
    pub fn divest_positions(&mut self, positions: Vec<U256>) -> Result<(), Vec<u8>> {
        Ok(())
    }
}
