#![feature(split_array)]
#![allow(unused_variables)]

use stylus_sdk::{
    alloy_primitives::{aliases::*, *},
    block, msg,
    prelude::*,
    storage::*,
};

pub mod erc20;
pub mod longtail;
pub mod maths;
pub mod nft_manager;

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
pub struct Leo {
    emergency_council: StorageAddress,

    // pool => campaign id => campaign[]
    campaigns: StorageMap<Address, StorageCampaigns>,

    // position id => position
    positions: StorageMap<U256, StoragePosition>,

    // pool address => LP token count
    liquidity: StorageMap<Address, StorageU256>,
}

#[solidity_storage]
pub struct StorageCampaigns {
    // Ongoing campaigns. We don't use a map since the seconds will
    // default to 0 so it'll return 0 for amounts calculated.
    ongoing: StorageMap<B8, StorageMap<U256, StorageCampaign>>,
}

#[solidity_storage]
pub struct StorageCampaign {
    // The lower tick that the position should be LP'd in for them to be eligible.
    tick_lower: StorageI32,

    // The upper tick that the position should be LP'd in for eligibility.
    tick_upper: StorageI32,

    // Amount of token emitted per second.
    per_second: StorageU256,

    // Token to distribute with this campaign.
    token: StorageAddress,

    // Maximum amount of the asset to distribute.
    pool_amount: StorageU256,

    // Distributed amount.
    distributed: StorageU256,

    // The timestamp of when this campaign started.
    started: StorageU64,

    // The timestamp of when this campaign ended. May be modified
    // if updates are made to the existing campaign.
    ending: StorageU64,
}

#[solidity_storage]
pub struct StoragePosition {
    owner: StorageAddress,

    timestamp: StorageU64,

    token: StorageAddress,

    tick_lower: StorageI32,
    tick_upper: StorageI32,

    amount: StorageU256,

    // Indexes of the position of the current status per campaign that's updated
    offsets: StorageMap<B8, StorageU256>,
}

#[external]
impl Leo {
    // Take a user's LP NFT using the NFT Manager, also recording the
    // pool they LP'd, including the timestamp when they deposited it
    // here. This also serves as the time it was last updated.
    pub fn vest_position(&mut self, pool: Address, id: U256) -> Result<(), Vec<u8>> {
        // Just to be safe, check if we already have this position tracked.
        assert!(self.positions.get(id).timestamp.get().is_zero());
        nft_manager::take_position(id)?;
        let mut position = self.positions.setter(id);
        position.owner.set(msg::sender());
        position.timestamp.set(U64::from(block::timestamp()));
        position.token.set(pool);
        position.tick_lower.set(longtail::tick_lower(pool, id)?);
        position.tick_upper.set(longtail::tick_upper(pool, id)?);
        // Also increase the global count for LP available for this pool.
        let position_liq = longtail::position_liquidity(pool, id)?;
        position.amount.set(position_liq);
        let existing_liq = self.liquidity.getter(pool).get();
        self.liquidity
            .setter(pool)
            .set(existing_liq + U256::from(position_liq));
        Ok(())
    }

    // Create a campaign, setting its current iteration to these parameters,
    // taking the maximum balance of tokens to distribute into this
    // contract for later distribution.
    pub fn create_campaign(
        &mut self,
        identifier: B8,
        pool: Address,
        tick_lower: i32,
        tick_upper: i32,
        per_second: U256,
        token: Address,
        maximum: U256,
        starting: u64,
        ending: u64,
    ) -> Result<(), Vec<u8>> {
        // Take the ERC20 from the user for the maximum run of the campaign.
        let mut pool_campaigns = self.campaigns.setter(pool);
        let mut pool_campaigns_ongoing = pool_campaigns.ongoing.setter(identifier);
        let mut campaign = pool_campaigns_ongoing.setter(U256::ZERO);
        // Make sure this campaign doesn't exist already.
        assert!(campaign.per_second.is_zero());
        campaign.tick_lower.set(I32::try_from(tick_lower).unwrap());
        campaign.tick_upper.set(I32::try_from(tick_upper).unwrap());
        campaign.token.set(token);
        campaign.pool_amount.set(maximum);
        campaign.started.set(U64::try_from(starting).unwrap());
        campaign.ending.set(U64::try_from(ending).unwrap());
        // Take the token's amounts for the campaign.
        erc20::take(pool, maximum)
    }

    // Collect the token rewards paid by Seawater for LP'ing in this
    // position, then send to the user.
    pub fn collect_pool_rewards(&self, pool: Address, id: U256) -> Result<(u128, u128), Vec<u8>> {
        assert!(self.positions.get(id).owner.get() == msg::sender());
        let (amount_0, amount_1) = longtail::collect_yield_single_to(pool, id, msg::sender())?;
        Ok((amount_0, amount_1))
    }

    // Return the LP rewards paid by Leo for vesting this NFT position.
    // Update the current position of the user per campaign that's
    // ongoing, and send them rewards using the time that was spent in
    // each campaign setting before the update occured. An update to a
    // campaign is tracked by updating its end date to earlier so the lp
    // rewards code attempts to roll over. In doing so, update the
    // timestamp to reset the rewards they've earned so far, and set them
    // to the latest version of each campaign update.
    pub fn collect_lp_rewards(
        &mut self,
        pool: Address,
        position_id: U256,
        campaign_ids: Vec<B8>,
    ) -> Result<Vec<(Address, U256)>, Vec<u8>> {
        assert!(self.positions.getter(position_id).owner.get() == msg::sender());
        // Take the current position, then check if they're eligible for the campaigns
        // they included.
        Ok(campaign_ids
            .iter()
            .map(|&campaign_id| {
                // We can assume the campaign exists due to the later
                // check for 0 amounts sent, and the seconds being 0 if
                // this is empty causing that. Mutable so we can bump the amount distributed
                // for the campaign and error out if we've sent too much later.
                let mut position = self.positions.setter(position_id);
                let offset = position.offsets.setter(campaign_id).get();
                let ongoing_campaigns = &mut self.campaigns.setter(pool).ongoing;
                let mut campaign_versions = ongoing_campaigns.setter(campaign_id);
                let mut campaign = campaign_versions.setter(offset);
                // Did we start our position after this campaign ended? If we have, we must
                // bump the offset so we can be eligible for its next iteration.
                // We can assume the campaign started because of the consistency
                // in the campaign creation.
                loop {
                    // We need to iterate through this to be sure.
                    if campaign.ending.get() < position.timestamp.get() {
                        campaign = campaign_versions.setter(offset + U256::from(1));
                        position
                            .offsets
                            .setter(campaign_id)
                            .set(offset + U256::from(1));
                    } else {
                        break;
                    }
                }
                // Does the campaign apply to the token that this position is for?
                assert!(campaign.token.get() == position.token.get());
                // If the campaign is non-existent, then the amount per second should be 0,
                // so we will earn 0 with the math.
                // Are we in the valid tick range?
                assert!(campaign.tick_lower.get() < position.tick_lower.get());
                assert!(campaign.tick_upper.get() > position.tick_upper.get());
                // Looks like we're eligible! Calculate the rewards the user is owed, then use a
                // erc20 send. Then adjust the timestamp for the user for this
                // campaign so they can't claim this again and receive the same rewards.
                let global_liq = self.liquidity.getter(pool).get();
                let base_rewards = maths::calc_base_rewards(
                    global_liq,
                    position.amount.get(),
                    campaign.per_second.get(),
                );
                let seconds_since = U64::from(block::timestamp()) - campaign.started.get();
                let rewards = base_rewards * U256::from(seconds_since);
                // Track what's sent, and do a last-minute sanity check to make sure we don't
                // send more than we should.
                let new_distributed = campaign.distributed.get() + rewards;
                campaign.distributed.set(new_distributed);
                assert!(campaign.pool_amount.get() > new_distributed);
                // Now send the actual rewards, and return.
                let token = campaign.token.get();
                erc20::give(token, rewards).unwrap();
                (token, rewards)
            })
            .collect())
    }

    // Divest LP positions from this contract, sending them back to the
    // original owner.
    pub fn divest_positions(&mut self, position_ids: Vec<U256>) -> Result<(), Vec<u8>> {
        for id in position_ids {
            // Check if the user owns this position.
            assert!(self.positions.getter(id).owner.get() == msg::sender());
            nft_manager::give_position(id).unwrap();
        }
        Ok(())
    }
}
