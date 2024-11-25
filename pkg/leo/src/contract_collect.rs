use stylus_sdk::{
    alloy_primitives::{aliases::*, *},
    msg,
};

use num_traits::cast::ToPrimitive;

use std::{
    cmp::{max, min},
    collections::HashMap,
};

use crate::{assert_or, erc20, error::Error, maths, seawater, utils::block_timestamp};

pub use crate::storage::*;

#[cfg_attr(feature = "contract-collect", stylus_sdk::prelude::public)]
impl StorageLeo {
    // Return the LP and pool rewards paid by Leo for vesting this NFT position.
    #[allow(clippy::type_complexity)]
    pub fn collect(
        &mut self,
        mut positions: Vec<U256>,
        mut campaign_ids: Vec<CampaignId>,
        recipient: Address,
    ) -> Result<(Vec<(Address, u128, u128)>, Vec<(U256, Address, U256)>), Vec<u8>> {
        assert_or!(self.enabled.get(), Error::NotEnabled);
        // For each address and position id, go into each campaign id,
        // check if it's eligible, and if it is, check if they exceed the
        // time spent and they're after the beginning date. If the
        // campaign hasn't started yet, then we revert with an error as a
        // precaution to prevent users from spending too much gas.
        // The accumulated tokens to send, ready to iterate through.
        positions.sort();
        positions.dedup();
        campaign_ids.sort();
        campaign_ids.dedup();
        let mut tokens_to_send: HashMap<Address, U256> = HashMap::new();
        // The pool rewards that we send to users.
        let mut pool_rewards = vec![];
        // The Leo rewards that we send to users.
        let mut campaign_rewards = vec![];
        for position_id in positions {
            let mut position = self.positions.setter(position_id);
            // Ensure that the sender owns this position to prevent griefing.
            assert_or!(
                position.owner.get() == msg::sender(),
                Error::NotPositionOwner
            );
            // Before we get into the Leo distribution, let's try to collect on their behalf
            // using Longtail.
            let position_pool = position.pool.get();
            let (pool_rewards_token0, pool_rewards_token1) =
                seawater::collect_yield_single_to(position_pool, position_id, recipient)?;
            pool_rewards.push((position_pool, pool_rewards_token0, pool_rewards_token1));
            let position_last_updated = position.timestamp.get().to_u64().unwrap();
            for campaign_id in campaign_ids.iter() {
                let campaign = self.campaigns.getter(*campaign_id);
                let campaign_starting = campaign.starting.get().to_u64().unwrap();
                let campaign_ending = campaign.ending.get().to_u64().unwrap();
                assert_or!(
                    block_timestamp() > campaign_starting,
                    Error::CampaignHasntBegun
                );
                // Check if the position is eligible for this campaign.
                let campaign_pool = campaign.pool.get();
                let is_eligible = campaign_pool == position.pool.get()
                    && campaign.tick_lower.get() >= position.tick_lower.get()
                    || campaign.tick_upper.get() <= position.tick_upper.get();
                // If they're not eligible, we need to skip them.
                if !is_eligible {
                    continue;
                }
                // When the position either was created for the first
                // time, or the last time that they chose to collect from
                // this code.
                let current_start = max(campaign_starting, position_last_updated);
                let current_end = min(campaign_ending, block_timestamp());
                let secs_since = U256::from(current_end - current_start);
                if secs_since.is_zero() {
                    continue;
                }
                let campaign_token = campaign.token.get();
                let campaign_liq = self.liquidity.get(campaign_pool);
                let position_liq = position.liquidity.get();
                let campaign_per_sec = campaign.per_sec.get();
                // This is the amount of token rewards that we're sending to the user.
                let token_amt =
                    maths::calc_rewards(campaign_liq, campaign_per_sec, secs_since, position_liq)?;
                campaign_rewards.push((position_id, campaign_token, token_amt));
                // Track that we have to sent some rewards for this position.
                tokens_to_send.insert(
                    campaign_token,
                    tokens_to_send[&campaign_token]
                        .checked_add(token_amt)
                        .ok_or(Error::CheckedAdd)?,
                );
            }
            position.timestamp.set(U64::from(block_timestamp()));
        }
        for (token_addr, token_amt) in tokens_to_send {
            erc20::transfer(token_addr, recipient, token_amt)?;
        }
        Ok((pool_rewards, campaign_rewards))
    }
}
