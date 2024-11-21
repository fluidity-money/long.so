use stylus_sdk::{
    abi::Bytes,
    alloy_primitives::{aliases::*, *},
    evm, msg,
};

use crate::{
    assert_or,
    error::Error,
    events, immutables, nft_manager, seawater,
    storage::{CampaignId, StorageLeo},
    utils::block_timestamp,
};

#[cfg_attr(feature = "contract-extras", stylus_sdk::prelude::public)]
impl StorageLeo {
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
        position.timestamp.set(U64::from(block_timestamp()));
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
        assert_or!(ending > starting, Error::BadCampaignConfig);

        // Make sure this campaign starts after the current timestamp.
        assert_or!(starting > block_timestamp(), Error::BadCampaignConfig);

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
        events::emit_campaign_updated(
            identifier,
            self.campaigns.getter(identifier).pool.get(),
            0,
            0,
            0,
            0,
            0,
        );
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

    // Divest LP positions from this contract, sending them back to the
    // original owner.
    pub fn divest_position(&mut self, position_id: U256) -> Result<(), Vec<u8>> {
        assert_or!(
            self.positions.getter(position_id).owner.get() == msg::sender(),
            Error::NotCampaignOwner
        );
        let pool = self.positions.getter(position_id).pool.get();
        let pool_liq = self.liquidity.getter(pool).get();
        self.liquidity
            .setter(pool)
            .set(pool_liq - self.positions.getter(position_id).liquidity.get());
        self.positions.setter(position_id).owner.set(Address::ZERO);
        evm::log(events::PositionDivested {
            positionId: position_id,
        });
        nft_manager::give_position(position_id)
    }
}
