#![allow(unused_variables)]

pub mod calldata;
pub mod erc20;
pub mod error;
pub mod events;
pub mod maths;
pub mod nft_manager;

mod calldata_seawater;

#[cfg(not(feature = "testing"))]
mod wasm_seawater;

#[cfg(feature = "testing")]
mod host_seawater;

pub mod seawater;

mod immutables;

#[cfg(feature = "testing")]
pub mod host;

use stylus_sdk::{
    abi::Bytes,
    alloy_primitives::{aliases::*, *},
    block, evm, msg,
    prelude::*,
    storage::*,
};

use num_traits::cast::ToPrimitive;

use std::{
    cmp::{max, min},
    collections::HashMap,
};

use immutables::SCALING_FACTOR;

use error::Error;

extern crate alloc;

type CampaignId = FixedBytes<8>;

#[storage]
#[entrypoint]
pub struct Leo {
    version: StorageU8,

    enabled: StorageBool,

    emergency_council: StorageAddress,

    // campaign id => campaign
    campaigns: StorageMap<CampaignId, StorageCampaign>,

    // position id => position
    positions: StorageMap<U256, StoragePosition>,

    // pool address => LP token count
    liquidity: StorageMap<Address, StorageU256>,
}

#[storage]
pub struct StorageCampaign {
    // The lower tick that the position should be LP'd in for them to be eligible.
    tick_lower: StorageI32,

    // The upper tick that the position should be LP'd in for eligibility.
    tick_upper: StorageI32,

    // Amount of token emitted per second.
    per_sec: StorageU256,

    // The timestamp of when this campaign is starting.
    starting: StorageU64,

    // The timestamp of when this campaign ended. May be modified
    // if updates are made to the existing campaign.
    ending: StorageU64,

    // Owner of the campaign balance so we don't have any abuse.
    owner: StorageAddress,

    // Token being distributed.
    token: StorageAddress,

    // Pool that this campaign is eligible for.
    pool: StorageAddress,

    // Amount that can be distributed.
    maximum: StorageU256,

    // Amount that was already distributed.
    distributed: StorageU256,
}

#[storage]
pub struct StoragePosition {
    owner: StorageAddress,

    // Internal state of the user's timestamp position, specifically when
    // it was claimed last. This is updated across the board so the user
    // needs to be careful they don't forget to claim from campaigns!
    timestamp: StorageU64,

    // Pool that this position was created for in Longtail.
    pool: StorageAddress,

    tick_lower: StorageI32,
    tick_upper: StorageI32,

    liquidity: StorageU256,
}

#[public]
impl Leo {
    pub fn ctor(&mut self, emergency: Address) -> Result<(), Vec<u8>> {
        assert_or!(self.version.get().is_zero(), Error::AlreadySetUp);
        self.emergency_council.set(emergency);
        self.version.set(U8::from(1));
        self.enabled.set(true);
        Ok(())
    }

    // Take a user's LP NFT using the NFT Manager, also recording the
    // pool they LP'd, including the timestamp when they deposited it
    // here. This also serves as the time it was last updated.
    pub fn vest_position(
        &mut self,
        pool: Address,
        id: U256,
        recipient: Address,
    ) -> Result<(), Vec<u8>> {
        // Just to be safe, check if we already have this position tracked.
        assert_or!(
            self.positions.get(id).timestamp.get().is_zero(),
            Error::PositionAlreadyExists
        );

        let position_liq = seawater::position_liquidity(pool, id)?;
        assert_or!(position_liq > 0, Error::PositionHasNoLiquidity);

        nft_manager::take_position(id)?;

        // Start to set everything related to the position.
        let mut position = self.positions.setter(id);
        position.owner.set(recipient);
        position.timestamp.set(U64::from(block::timestamp()));
        position.pool.set(pool);
        position.tick_lower.set(I32::from_le_bytes(
            seawater::tick_lower(pool, id)?.to_le_bytes(),
        ));
        position.tick_upper.set(I32::from_le_bytes(
            seawater::tick_upper(pool, id)?.to_le_bytes(),
        ));

        // Also increase the global count for LP available for this pool.
        position.liquidity.set(U256::from(position_liq));
        let existing_liq = self.liquidity.getter(pool).get();
        self.liquidity
            .setter(pool)
            .set(existing_liq + U256::from(position_liq));

        evm::log(events::PositionVested2 {
            positionId: id,
            owner: recipient,
        });

        Ok(())
    }

    // Create a campaign, setting its current iteration to these parameters,
    // taking the maximum balance of tokens to distribute into this
    // contract for later distribution.
    #[allow(clippy::type_complexity, clippy::too_many_arguments)]
    pub fn create_campaign(
        &mut self,
        identifier: CampaignId,
        pool: Address,
        tick_lower: i32,
        tick_upper: i32,
        per_sec: u64,
        token: Address,
        maximum: U256,
        starting: u64,
        ending: u64,
    ) -> Result<(), Vec<u8>> {
        assert_or!(self.enabled.get(), Error::NotEnabled);

        // Sanity checks to prevent junk campaigns from being made.
        assert_or!(per_sec > 0, Error::BadCampaignConfig);

        // Take the ERC20 from the user for the maximum run of the campaign.
        let mut campaign = self.campaigns.setter(identifier);

        // Make sure this campaign doesn't exist already.
        assert_or!(campaign.token.get().is_zero(), Error::CampaignAlreadyExists);

        // Make sure that this campaign's end is after the starting.
        assert_or!(starting < ending, Error::BadCampaignConfig);

        // Make sure this campaign starts after the current timestamp.
        assert_or!(starting > block::timestamp(), Error::BadCampaignConfig);

        // Set everything related to the pool.
        campaign
            .tick_lower
            .set(I32::from_le_bytes(tick_lower.to_le_bytes()));
        campaign
            .tick_upper
            .set(I32::from_le_bytes(tick_upper.to_le_bytes()));
        campaign.per_sec.set(U256::from(per_sec));
        campaign
            .starting
            .set(U64::from_le_bytes(starting.to_le_bytes()));
        campaign
            .ending
            .set(U64::from_le_bytes(ending.to_le_bytes()));
        campaign.maximum.set(maximum);
        campaign.token.set(token);
        campaign.pool.set(pool);

        // Pack the words for CampaignCreated, and then emit that event.
        events::emit_campaign_created(
            identifier,
            pool,
            token,
            msg::sender(),
            tick_lower,
            tick_upper,
            starting,
            ending,
            per_sec,
        );

        Ok(())
    }

    pub fn cancel_campaign(&mut self, identifier: CampaignId) -> Result<(), Vec<u8>> {
        assert_or!(self.enabled.get(), Error::NotEnabled);
        assert_eq!(self.campaigns.getter(identifier).owner.get(), msg::sender());
        // Cancel this campaign by setting its ending date to the current
        // time, and set the "cancelled" field to true.
        let pool = self.campaigns.getter(identifier).pool.get();

        events::emit_campaign_updated(identifier, pool, 0, 0, 0, 0, 0);
        Ok(())
    }

    /// Return campaign details, of the form the lower tick, the upper tick,
    /// the amount sent per second in the campaign, the token that's being
    /// distributed, and the amount distributed so far, as well as the maximum
    /// amount, and the starting and ending timestamp.
    // Complex type so we don't have to do custom abi encoding.
    #[allow(clippy::type_complexity)]
    pub fn campaign_details(
        &self,
        pool: Address,
        id: CampaignId,
    ) -> Result<(i32, i32, u64, Address, U256, U256, u64, u64), Vec<u8>> {
        let campaign = self.campaigns.getter(id);
        Ok((
            i32::from_le_bytes(campaign.tick_lower.get().to_le_bytes()),
            i32::from_le_bytes(campaign.tick_upper.get().to_le_bytes()),
            u64::from_le_bytes(campaign.per_sec.get().to_le_bytes()),
            campaign.token.get(),
            campaign.distributed.get(),
            campaign.maximum.get(),
            u64::from_le_bytes(campaign.starting.get().to_le_bytes()),
            u64::from_le_bytes(campaign.ending.get().to_le_bytes()),
        ))
    }

    pub fn pool_lp(&self, pool: Address) -> Result<U256, Vec<u8>> {
        Ok(self.liquidity.getter(pool).get())
    }

    #[allow(non_snake_case)]
    pub fn on_E_R_C_721_received(
        _operator: Address,
        _from: Address,
        _token_id: U256,
        _data: Bytes,
    ) -> Result<FixedBytes<4>, Vec<u8>> {
        assert_or!(
            msg::sender() == immutables::NFT_MANAGER_ADDR,
            Error::OnlyNftManager
        );
        //bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))
        Ok(FixedBytes::new([0x15, 0x0b, 0x7a, 0x02]))
    }

    // Return the LP and pool rewards paid by Leo for vesting this NFT position.
    #[allow(clippy::type_complexity)]
    pub fn collect(
        &mut self,
        mut positions: Vec<(Address, U256)>,
        mut campaign_ids: Vec<CampaignId>,
        recipient: Address,
    ) -> Result<(Vec<(Address, u128, u128)>, Vec<(U256, Address, U256)>), Vec<u8>> {
        // For each address and position id, go into each campaign id,
        // check if it's eligible, and if it is, check if they exceed the
        // time spent and they're after the beginning date. If the
        // campaign hasn't started yet, then we revert with an error as a
        // precaution to prevent users from spending too much gas.
        positions.sort();
        campaign_ids.sort();
        positions.dedup();
        campaign_ids.dedup();
        // The accumulated tokens to send, ready to iterate through.
        let mut tokens_to_send: HashMap<Address, U256> = HashMap::new();
        // The pool rewards that we send to users.
        let mut pool_rewards = vec![];
        // The Leo rewards that we send to users.
        let mut campaign_rewards = vec![];
        for (position_pool, position_id) in positions {
            let position = self.positions.getter(position_id);
            // Ensure that the sender owns this position to prevent griefing.
            assert_or!(
                position.owner.get() == msg::sender(),
                Error::NotPositionOwner
            );
            // Before we get into the Leo distribution, let's try to collect on their behalf
            // using Longtail.
            let (pool_rewards_token0, pool_rewards_token1) =
                seawater::collect_yield_single_to(position_pool, position_id, recipient)?;
            pool_rewards.push((position_pool, pool_rewards_token0, pool_rewards_token1));
            for campaign_id in campaign_ids.iter() {
                let campaign = self.campaigns.getter(*campaign_id);
                let campaign_starting = campaign.starting.get().to_u64().unwrap();
                let campaign_ending = campaign.ending.get().to_u64().unwrap();
                assert_or!(
                    campaign_starting > block::timestamp(),
                    Error::CampaignHasntBegun
                );
                // Check if the position is eligible for this campaign.
                let is_eligible = campaign.pool.get() == position.pool.get()
                    && campaign.tick_lower.get() >= position.tick_lower.get()
                    || campaign.tick_upper.get() <= position.tick_upper.get();
                // If they're not eligible, we need to skip them.
                if !is_eligible {
                    continue;
                }
                let current_start = max(campaign_starting, block::timestamp());
                let current_end = min(campaign_ending, block::timestamp());
                let secs_since = U256::from(current_end - current_start);
                if secs_since.is_zero() {
                    continue;
                }
                // Scale the token amount by 1e12, by ((secs_since *
                // SCALING_FACTOR) * campaign_per_sec) / SCALING_FACTOR
                let token_amt = secs_since
                    .checked_mul(SCALING_FACTOR)
                    .ok_or(Error::CheckedMul)?
                    .checked_mul(campaign.per_sec.get())
                    .ok_or(Error::CheckedMul)?
                    .checked_div(SCALING_FACTOR)
                    .ok_or(Error::CheckedDiv)?;
                let campaign_token = campaign.token.get();
                campaign_rewards.push((position_id, campaign_token, token_amt));
                // Track that we have to sent some rewards for this position.
                tokens_to_send.insert(
                    campaign_token,
                    tokens_to_send[&campaign_token]
                        .checked_add(token_amt)
                        .ok_or(Error::CheckedAdd)?,
                );
            }
        }
        for (token_addr, token_amt) in tokens_to_send {
            erc20::transfer(token_addr, recipient, token_amt)?;
        }
        Ok((pool_rewards, campaign_rewards))
    }

    // Divest LP positions from this contract, sending them back to the
    // original owner.
    pub fn divest_position(&mut self, pool: Address, position_id: U256) -> Result<(), Vec<u8>> {
        Ok(())
    }
}

pub trait StorageNew {
    fn new(i: U256, v: u8) -> Self;
}

impl StorageNew for Leo {
    fn new(i: U256, v: u8) -> Self {
        unsafe { <Self as stylus_sdk::storage::StorageType>::new(i, v) }
    }
}
