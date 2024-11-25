use stylus_sdk::{alloy_primitives::*, prelude::*, storage::*};

pub type CampaignId = FixedBytes<8>;

#[storage]
pub struct StorageCampaign {
    // The lower tick that the position should be LP'd in for them to be eligible.
    pub tick_lower: StorageI32,

    // The upper tick that the position should be LP'd in for eligibility.
    pub tick_upper: StorageI32,

    // Amount of token emitted per second.
    pub per_sec: StorageU64,

    // The timestamp of when this campaign is starting.
    pub starting: StorageU64,

    // The timestamp of when this campaign ended. May be modified
    // if updates are made to the existing campaign.
    pub ending: StorageU64,

    // Owner of the campaign balance so we don't have any abuse.
    pub owner: StorageAddress,

    // Token being distributed.
    pub token: StorageAddress,

    // Pool that this campaign is eligible for.
    pub pool: StorageAddress,

    // Amount that can be distributed.
    pub maximum: StorageU256,

    // Amount that was already distributed.
    pub distributed: StorageU256,
}

#[storage]
pub struct StoragePosition {
    pub owner: StorageAddress,

    // Internal state of the user's timestamp position, specifically when
    // it was claimed last. This is updated across the board so the user
    // needs to be careful they don't forget to claim from campaigns!
    pub timestamp: StorageU64,

    // Pool that this position was created for in Longtail.
    pub pool: StorageAddress,

    pub tick_lower: StorageI32,
    pub tick_upper: StorageI32,

    pub liquidity: StorageU256,
}

#[storage]
#[cfg_attr(
    any(feature = "contract-collect", feature = "contract-extras"),
    entrypoint
)]
pub struct StorageLeo {
    /// Version of the contract. Set during initialisation.
    pub version: StorageU8,

    /// Is the contract disabled?
    pub enabled: StorageBool,

    /// The emergency operator can activate the not emergency field.
    pub emergency_council: StorageAddress,

    /// Ongoing token distribution "campaigns".
    // campaign id => campaign
    pub campaigns: StorageMap<CampaignId, StorageCampaign>,

    /// Positions vested by users.
    // position id => position
    pub positions: StorageMap<U256, StoragePosition>,

    /// Tracked liquidity amount that should be updated on request.
    /// pool address => LP token count
    pub liquidity: StorageMap<Address, StorageU256>,
}

pub trait StorageNew {
    fn new(i: U256, v: u8) -> Self;
}

impl StorageNew for StorageLeo {
    fn new(i: U256, v: u8) -> Self {
        unsafe { <Self as stylus_sdk::storage::StorageType>::new(i, v) }
    }
}
