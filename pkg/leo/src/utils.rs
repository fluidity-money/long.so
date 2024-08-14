use stylus_sdk::alloy_primitives::{aliases::B8, Address, U256};

pub fn emit_campaign_created(
    identifier: B8,
    pool: Address,
    token: Address,
    owner: Address,
    extra_max: U256,
    starting: u64,
    ending: u64,
) {
}
