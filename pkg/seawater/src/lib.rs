//! Implementation of the seawater AMM
//!
//! Seawater is an AMM designed for arbitrum's stylus environment based on uniswap v3.

#![feature(split_array, new_uninit, never_type, core_panic)]
#![cfg_attr(not(target_arch = "wasm32"), feature(lazy_cell, const_trait_impl))]
#![deny(clippy::unwrap_used)]

pub mod eth_serde;
pub mod erc20;
#[macro_use]
pub mod error;
pub mod events;

pub mod maths;
pub mod pool;
pub mod position;
pub mod test_shims;
pub mod tick;
pub mod types;

use crate::types::{Address, I256Extension, I256, U256};
use error::Error;
use maths::tick_math;

use types::{U256Extension, WrappedNative};

use stylus_sdk::{evm, msg, prelude::*, storage::*};

// aliased for simplicity
type Revert = !;

extern crate alloc;
// only set a custom allocator if we're deploying on wasm
#[cfg(target_arch = "wasm32")]
mod allocator {
    use lol_alloc::{AssumeSingleThreaded, FreeListAllocator};
    // SAFETY: This application is single threaded, so using AssumeSingleThreaded is allowed.
    #[global_allocator]
    static ALLOCATOR: AssumeSingleThreaded<FreeListAllocator> =
        unsafe { AssumeSingleThreaded::new(FreeListAllocator::new()) };
}

// we split our entrypoint functions into three sets, and call them via diamond proxies, to
// save on binary size

/*
#[cfg(not(any(feature = "swaps", feature = "positions", feature = "admin",)))]
mod shim {
    #[cfg(target_arch = "wasm32")]
    compile_error!(
        "Either `swaps` or `positions` or `admin` must be enabled when building for wasm."
    );
    #[stylus_sdk::prelude::external]
    impl crate::Pools {}
}
*/

/// The root of seawater's storage. Stores variables needed globally, as well as the map of AMM
/// pools.
#[solidity_storage]
pub struct Pools {
    seawater_admin: StorageAddress,
    // the nft manager is a privileged account that can transfer NFTs!
    nft_manager: StorageAddress,

    fusdc: StorageAddress,
    pools: StorageMap<Address, pool::StoragePool>,
    // position NFTs
    next_position_id: StorageU256,
    // ID => owner
    position_owners: StorageMap<U256, StorageAddress>,
    // owner => count
    owned_positions: StorageMap<Address, StorageU256>,
}

/// SAFETY - we promise
unsafe impl stylus_sdk::storage::TopLevelStorage for Pools {}

#[no_mangle]
pub unsafe fn mark_used() {
    stylus_sdk::evm::memory_grow(0);
    ::core::panicking::panic("explicit panic");
}

// mostly inlined from the #entrypoint attr
#[no_mangle]
pub extern "C" fn user_entrypoint(len: usize) -> usize {
    if stylus_sdk::msg::reentrant() {
        return 1;
    }
    let input = {
        unsafe {
            let mut input = Box::<[u8]>::new_uninit_slice(len);
            stylus_sdk::hostio::read_args(input.as_mut_ptr() as *mut u8);
            input.assume_init()
        }
    };
    entrypoint(&input);
    stylus_sdk::storage::StorageCache::flush();
    0
}

fn take_word(data: &[u8]) -> (&[u8; 32], &[u8]) {
    data.split_array_ref::<32>()
}
macro_rules! gen_parse {
    ($parsename:ident, $typename:ident, $type:ty, $bytes:expr, $ctor:expr) => {
        fn $parsename(data: &[u8]) -> ($type, &[u8]) {
            let ($typename, data) = take_word(data);
            let (_, $typename) = $typename.rsplit_array_ref::<$bytes>();
            ($ctor, data)
        }
    }
}

macro_rules! gen_parse_int {
    ($parsename:ident, $int:ty) => {
        gen_parse!($parsename, num, $int, {<$int>::BITS as usize / 8}, {<$int>::from_be_bytes(*num)});
    }
}

gen_parse!(parse_addr, address, Address, 20, Address{0: address.into()});
gen_parse_int!(parse_i32, i32);
gen_parse_int!(parse_i128, i128);
gen_parse!(parse_u256, u256, U256, 32, U256::from_be_bytes::<32>(*u256));
fn parse_selector(data: &[u8]) -> (u32, &[u8]) {
    let (selector, data) = data.split_array_ref::<4>();
    (u32::from_be_bytes(*selector), data)
}
fn parse_bytes(data: &[u8]) -> (&[u8], &[u8]) {
    let (len, data) = parse_u256(data);
    let len: usize = len.try_into().unwrap();
    // padded_len is the total length
    let padded_len = len.next_multiple_of(32);

    let (padded_bytes, data) = data.split_at(padded_len);
    let bytes = &padded_bytes[0..len];

    (bytes, data)
}

fn entrypoint(data: &[u8]) {
    let (selector, data) = parse_selector(data);
    let mut storage = &mut unsafe { <Pools as StorageType>::new(U256::ZERO, 0) };

    const MINT_POSITION: u32 = u32::from_be_bytes(eth_serde::selector(b"mintPosition(address,int32,int32)"));
    const BURN_POSITION: u32 = u32::from_be_bytes(eth_serde::selector(b"burnPosition(int32)"));
    const TRANSFER_POSITION: u32 = u32::from_be_bytes(eth_serde::selector(b"transferPosition(uint256,address,address)"));
    const POSITION_OWNER: u32 = u32::from_be_bytes(eth_serde::selector(b"positionOwner(uint256)"));
    const POSITION_BALANCE: u32 = u32::from_be_bytes(eth_serde::selector(b"positionBalance(address)"));
    const POSITION_LIQUIDITY: u32 = u32::from_be_bytes(eth_serde::selector(b"positionLiquidity(address,uint256)"));
    const UPDATE_POSITION_PERMIT2: u32 = u32::from_be_bytes(eth_serde::selector(b"updatePositionPermite2(address,uint256,int128,bytes,bytes)"));

    match selector {
        MINT_POSITION => {
            let (pool, data) = parse_addr(data);
            let (lower, data) = parse_i32(data);
            let (upper, _) = parse_i32(data);
            let _res = Pools::mint_position(
                core::borrow::BorrowMut::borrow_mut(storage),
                pool,
                lower,
                upper,
                ).unwrap();
            stylus_sdk::contract::output(&[0; 0]);
        },
        BURN_POSITION => {
            let (id, _) = parse_u256(data);
            let _res = Pools::burn_position(
                core::borrow::BorrowMut::borrow_mut(storage),
                id,
                ).unwrap();
            stylus_sdk::contract::output(&[0; 0]);
        },
        TRANSFER_POSITION => {
            let (id, data) = parse_u256(data);
            let (from, data) = parse_addr(data);
            let (to, _) = parse_addr(data);
            let _res = Pools::transfer_position(
                core::borrow::BorrowMut::borrow_mut(storage),
                id,
                from,
                to,
                ).unwrap();
            stylus_sdk::contract::output(&[0; 0]);
        },
        POSITION_OWNER => {
            let (id, _) = parse_u256(data);
            let res = Pools::position_owner(
                core::borrow::Borrow::borrow(storage),
                id,
                ).unwrap();
            let mut rtn = [0; 32];
            rtn[12..32].copy_from_slice(&res.0.0);
            stylus_sdk::contract::output(&rtn);
        },
        POSITION_BALANCE => {
            let (addr, _) = parse_addr(data);
            let res = Pools::position_balance(
                core::borrow::Borrow::borrow(storage),
                addr,
                ).unwrap();
            let rtn = &res.to_be_bytes::<32>();
            stylus_sdk::contract::output(rtn);
        },
        POSITION_LIQUIDITY => {
            let (addr, data) = parse_addr(data);
            let (id, _) = parse_u256(data);
            let res = Pools::position_liquidity(
                core::borrow::Borrow::borrow(storage),
                addr,
                id,
                ).unwrap();
            let mut rtn = [0; 32];
            rtn[17..32].copy_from_slice(&res.to_be_bytes());
            stylus_sdk::contract::output(&rtn);
        },
        UPDATE_POSITION_PERMIT2 => {
            let (pool, data) = parse_addr(data);
            let (id, data) = parse_u256(data);
            let (delta, data) = parse_i128(data);
            let (token0_sig, data) = parse_bytes(data);
            let (token1_sig, _) = parse_bytes(data);
            let res = Pools::update_position_permit2(
                core::borrow::BorrowMut::borrow_mut(storage),
                pool,
                id,
                delta,
                token0_sig,
                token1_sig,
                ).unwrap();
            let mut rtn = [0; 64];
            rtn[0..32].copy_from_slice(&res.0.to_be_bytes::<32>());
            rtn[33..64].copy_from_slice(&res.1.to_be_bytes::<32>());
            stylus_sdk::contract::output(&rtn);
        },
        _ => {
            panic!()
        }
    }
}

/// Internal functions for position management.
impl Pools {
    /// Makes the user the owner of a position. The position must not have an owner.
    fn grant_position(&mut self, owner: Address, id: U256) {
        // set owner
        self.position_owners.setter(id).set(owner);

        // increment count
        let owned_positions_count = self.owned_positions.get(owner) + U256::one();
        self.owned_positions
            .setter(owner)
            .set(owned_positions_count);
    }

    /// Removes the user as the owner of a position. The position must have an owner.
    fn remove_position(&mut self, owner: Address, id: U256) {
        // remove owner
        self.position_owners.setter(id).erase();

        // decrement count
        let owned_positions_count = self.owned_positions.get(owner) - U256::one();
        self.owned_positions
            .setter(owner)
            .set(owned_positions_count);
    }
}

impl Pools {
    pub fn update_position_raw(
        &mut self,
        pool: Address,
        id: U256,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        assert_eq_or!(msg::sender(), self.position_owners.get(id), Error::PositionOwnerOnly);

        let (token_0, token_1) = self.pools.setter(pool).update_position(id, delta)?;

        evm::log(events::UpdatePositionLiquidity { id, delta });

        Ok((token_0, token_1))
    }
}

impl Pools {
    /// Creates a new, empty position, owned by a user.
    ///
    /// # Errors
    /// Requires the pool to exist and be enabled.
    #[inline(never)]
    pub fn mint_position(&mut self, pool: Address, lower: i32, upper: i32) -> Result<(), Revert> {
        let id = self.next_position_id.get();
        self.pools.setter(pool).create_position(id, lower, upper)?;

        self.next_position_id.set(id + U256::one());

        let owner = msg::sender();

        self.grant_position(owner, id);

        evm::log(events::MintPosition {
            owner,
            id,
            pool,
            lower,
            upper,
        });

        Ok(())
    }

    /// Burns a position. Only usable by the position owner.
    ///
    /// Calling this function leaves any liquidity or fees left in the position inaccessible.
    ///
    /// # Errors
    /// Requires the position be owned by the caller. Requires the pool to be enabled.
    pub fn burn_position(&mut self, id: U256) -> Result<(), Revert> {
        let owner = msg::sender();
        assert_eq_or!(self.position_owners.get(id), owner, Error::PositionOwnerOnly);

        self.remove_position(owner, id);

        evm::log(events::BurnPosition { owner, id });

        Ok(())
    }

    /// Transfers a position's ownership from one address to another. Only usable by the NFT
    /// manager account.
    ///
    /// # Calling requirements
    /// Requires that the `from` address is the current owner of the position.
    ///
    /// # Errors
    /// Requires the caller be the NFT manager.
    pub fn transfer_position(
        &mut self,
        id: U256,
        from: Address,
        to: Address,
    ) -> Result<(), Revert> {
        assert_eq_or!(msg::sender(), self.nft_manager.get(), Error::NftManagerOnly);

        self.remove_position(from, id);
        self.grant_position(to, id);

        evm::log(events::TransferPosition { from, to, id });

        Ok(())
    }

    /// Returns the current owner of a position.
    pub fn position_owner(&self, id: U256) -> Result<Address, Revert> {
        Ok(self.position_owners.get(id))
    }

    /// Returns the number of positions owned by an account.
    pub fn position_balance(&self, user: Address) -> Result<U256, Revert> {
        Ok(self.owned_positions.get(user))
    }

    /// Returns the amount of liquidity in a position.
    pub fn position_liquidity(&self, pool: Address, id: U256) -> Result<u128, Revert> {
        let liquidity = self.pools.getter(pool).get_position_liquidity(id);

        Ok(liquidity.sys())
    }

    /// Refreshes the amount of liquidity in a position, and adds or removes liquidity. Only usable
    /// by the position's owner.
    ///
    /// # Arguments
    /// * `pool` - The pool the position belongs to.
    /// * `id` - The ID of the position.
    /// * `delta` - The change to apply to the liquidity in the position.
    ///
    /// # Side effects
    /// Adding or removing liquidity will transfer tokens from or to the caller. Tokens are
    /// transfered with ERC20's `transferFrom`, so approvals must be set before calling.
    ///
    /// # Errors
    /// Requires token approvals to be set if adding liquidity. Requires the caller to be the
    /// position owner. Requires the pool to be enabled unless removing liquidity.
    /*
    pub fn update_position(
        &mut self,
        pool: Address,
        id: U256,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        let (amount0, amount1) = self.update_position_raw(pool, id, delta)?;

        erc20::exchange(pool, amount0)?;
        erc20::exchange(self.fusdc.get(), amount1)?;

        Ok((amount0, amount1))
    }
    */

    #[inline(never)]
    pub fn update_position_permit2(
        &mut self,
        pool: Address,
        id: U256,
        delta: i128,
        token0_signature: &[u8],
        token1_signature: &[u8],
    ) -> Result<(I256, I256), Revert> {
        let (amount0, amount1) = self.update_position_raw(pool, id, delta)?;
        //erc20::exchange_permit2(pool, amount0, token0_signature)?;
        //erc20::exchange_permit2(self.fusdc.get(), amount1, token1_signature)?;

        Ok((amount0, amount1))
    }

    /// Collects AMM fees from a position, and triggers a release of fluid LP rewards.
    /// Only usable by the position's owner.
    ///
    /// # Arguments
    /// * `pool` - The pool the position belongs to.
    /// * `id` - The ID of the position.
    /// * `amount_0` - The maximum amount of token 0 (the pool token) to collect.
    /// * `amount_1` - The maximum amount of token 1 (the fluid token) to collect.
    ///
    /// # Side effects
    /// Transfers tokens to the caller, and triggers a release of fluid LP rewards.
    ///
    /// # Errors
    /// Requires the caller to be the position owner. Requires the pool to be enabled.
    pub fn collect(
        &mut self,
        pool: Address,
        id: U256,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        assert_eq_or!(msg::sender(), self.position_owners.get(id), Error::PositionOwnerOnly);

        let (token_0, token_1) = self.pools.setter(pool).collect(id, amount_0, amount_1)?;

        erc20::send(pool, U256::from(token_0))?;
        erc20::send(self.fusdc.get(), U256::from(token_1))?;

        evm::log(events::CollectFees {
            id,
            pool,
            to: msg::sender(),
            amount0: token_0,
            amount1: token_1,
        });
        Ok((token_0, token_1))
    }
}

