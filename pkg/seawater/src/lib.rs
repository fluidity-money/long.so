//#![cfg_attr(test, feature(lazy_cell, const_trait_impl))]
#![feature(const_trait_impl)]
#![feature(slice_as_chunks)]

pub mod error;
pub mod erc20;
pub mod maths;
pub mod pool;
pub mod position;
pub mod test_shims;
pub mod tick;
pub mod types;

extern crate alloc;

use crate::types::{Address, I256Extension, I256, U256};
use error::UniswapV3MathError;
use maths::tick_math;
use stylus_sdk::{prelude::*, storage::*, msg};
use types::U256Extension;

type Revert = Vec<u8>;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(not(any(feature = "swaps", feature = "positions", feature = "admin",)))]
mod shim {
    #[cfg(target_arch = "wasm32")]
    compile_error!(
        "Either `swaps` or `positions` or `admin` must be enabled when building for wasm."
    );
    #[stylus_sdk::prelude::external]
    impl crate::Pools {}
}

#[solidity_storage]
#[entrypoint]
pub struct Pools {
    seawater_admin: StorageAddress,
    // the nft manager is a privileged account that can transfer NFTs!
    nft_manager: StorageAddress,

    usdc: StorageAddress,
    pools: StorageMap<Address, pool::StoragePool>,
    // position NFTs
    next_position_id: StorageU256,
    // ID => owner
    position_owners: StorageMap<U256, StorageAddress>,
    // owner => count
    owned_positions: StorageMap<Address, StorageU256>,
}

#[cfg_attr(feature = "swaps", external)]
impl Pools {
    // raw swap function
    pub fn swap(
        &mut self,
        pool: Address,
        zero_for_one: bool,
        amount: I256,
        price_limit: U256,
    ) -> Result<(I256, I256), Revert> {
        let (amount_0, amount_1) = self.pools
            .setter(pool)
            .swap(zero_for_one, amount, price_limit)?;

        erc20::exchange(pool, amount_0)?;
        erc20::exchange(self.usdc.get(), amount_1)?;

        Ok((amount_0, amount_1))
    }

    pub fn swap_2_exact_in(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
        min_out: U256,
    ) -> Result<(U256, U256), Revert> {
        let amount = I256::unchecked_from(amount);
        // swap in -> usdc
        let (amount_in, interim_usdc_out) =
            self.pools
                .setter(from)
                .swap(true, amount, tick_math::MIN_SQRT_RATIO + U256::one())?;

        // swap usdc -> out
        let (interim_usdc_in, amount_out) = self.pools.setter(to).swap(
            false,
            interim_usdc_out,
            tick_math::MAX_SQRT_RATIO - U256::one(),
        )?;

        let amount_in = amount_in.abs_neg();
        let amount_out = amount_out.abs_neg();

        assert_eq!(interim_usdc_out, interim_usdc_in);
        assert!(amount_out >= min_out);

        erc20::take(from, amount_in)?;
        erc20::send(to, amount_out)?;

        // return amount - amount_in to the user
        // send amount_out to the user
        Ok((amount_in, amount_out))
    }
}

impl Pools {
    pub fn grant_position(&mut self, owner: Address, id: U256) {
        // set owner
        self.position_owners.setter(id).set(owner);

        // increment count
        let owned_positions_count = self.owned_positions.get(owner) + U256::one();
        self.owned_positions.setter(owner).set(owned_positions_count);
    }

    pub fn remove_position(&mut self, owner: Address, id: U256) {
        // remove owner
        self.position_owners.setter(id).erase();

        // decrement count
        let owned_positions_count = self.owned_positions.get(owner) - U256::one();
        self.owned_positions.setter(owner).set(owned_positions_count);
    }
}

#[cfg_attr(feature = "positions", external)]
impl Pools {
    pub fn mint_position(
        &mut self,
        pool: Address,
        lower: i32,
        upper: i32,
    ) -> Result<(), Revert> {
        let id = self.next_position_id.get();
        self.pools.setter(pool)
            .create_position(id, lower, upper);

        self.next_position_id.set(id + U256::one());

        self.grant_position(msg::sender(), id);

        Ok(())
    }

    pub fn burn_position(
        &mut self,
        id: U256,
    ) -> Result<(), Revert> {
        assert_eq!(self.position_owners.get(id), msg::sender());

        self.remove_position(msg::sender(), id);

        Ok(())
    }

    // this is a privileged method!!
    pub fn transfer_position(
        &mut self,
        id: U256,
        from: Address,
        to: Address,
    ) -> Result<(), Revert> {
        assert_eq!(msg::sender(), self.nft_manager.get());

        self.remove_position(from, id);
        self.grant_position(to, id);

        Ok(())
    }

    pub fn position_owner(
        &mut self,
        id: U256,
    ) -> Result<Address, Revert> {
        Ok(self.position_owners.get(id))
    }

    pub fn position_balance(
        &self,
        user: Address,
    ) -> Result<U256, Revert> {
        Ok(self.owned_positions.get(user))
    }

    pub fn update_position(
        &mut self,
        pool: Address,
        id: U256,
        delta: i128,
    ) -> Result<(I256, I256), Revert> {
        assert_eq!(msg::sender(), self.position_owners.get(id));

        let (token_0, token_1) = self
            .pools
            .setter(pool)
            .update_position(id, delta)?;

        erc20::exchange(pool, token_0)?;
        erc20::exchange(self.usdc.get(), token_1)?;

        Ok((token_0, token_1))
    }

    pub fn collect(
        &mut self,
        pool: Address,
        id: U256,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        // TODO permissions?
        let (token_0, token_1) = self
            .pools
            .setter(pool)
            .collect(id, amount_0, amount_1);

        erc20::send(pool, U256::from(token_0))?;
        erc20::send(self.usdc.get(), U256::from(token_1))?;

        Ok((token_0, token_1))
    }
}

#[cfg_attr(feature = "admin", external)]
impl Pools {
    pub fn ctor(
        &mut self,
        usdc: Address,
        seawater_admin: Address,
        nft_manager: Address,
    ) -> Result<(), Revert> {
        if self.usdc.get() != Address::ZERO {
            Err(UniswapV3MathError::ContractAlreadyInitialised)?
        }

        self.usdc.set(usdc);
        self.seawater_admin.set(seawater_admin);
        self.nft_manager.set(nft_manager);

        Ok(())
    }

    pub fn init(
        &mut self,
        pool: Address,
        price: U256,
        fee: u32,
        tick_spacing: u8,
        max_liquidity_per_tick: u128,
    ) -> Result<(), Revert> {
        assert_eq!(msg::sender(), self.seawater_admin.get());

        self.pools
            .setter(pool)
            .init(price, fee, tick_spacing, max_liquidity_per_tick)?;

        Ok(())
    }

    pub fn collect_protocol(
        &mut self,
        pool: Address,
        amount_0: u128,
        amount_1: u128,
    ) -> Result<(u128, u128), Revert> {
        assert_eq!(msg::sender(), self.seawater_admin.get());
        let (token_0, token_1) = self.pools.setter(pool).collect_protocol(amount_0, amount_1);

        erc20::send(pool, U256::from(token_0))?;
        erc20::send(self.usdc.get(), U256::from(token_1))?;

        // transfer tokens
        Ok((token_0, token_1))
    }
}
