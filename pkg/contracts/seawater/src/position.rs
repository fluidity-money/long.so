use crate::error::*;
use crate::maths::full_math;
use crate::maths::liquidity_math;
use crate::types::Wrap;
use crate::types::{Address, U256Extension, U128, U256};
use stylus_sdk::alloy_primitives::aliases::B256;
use stylus_sdk::crypto;
use stylus_sdk::prelude::*;
use stylus_sdk::storage::*;

#[solidity_storage]
pub struct StoragePositions {
    pub positions: StorageMap<StoragePositionKey, StoragePositionInfo>,
}
impl StoragePositions {
    pub fn update(
        &mut self,
        position: StoragePositionKey,
        delta: i128,
        fee_growth_inside_0: U256,
        fee_growth_inside_1: U256,
    ) -> Result<(), UniswapV3MathError> {
        let mut info = self.positions.setter(position);

        let liquidity_next = liquidity_math::add_delta(info.liquidity.get().unwrap(), delta)?;

        let owed_fees_0 = full_math::mul_div(
            fee_growth_inside_0
                .checked_sub(info.fee_growth_inside_0.get())
                .ok_or(UniswapV3MathError::FeeGrowthSub)?,
            U256::from(info.liquidity.get()),
            full_math::Q128,
        )?;

        let owed_fees_1 = full_math::mul_div(
            fee_growth_inside_1
                .checked_sub(info.fee_growth_inside_1.get())
                .ok_or(UniswapV3MathError::FeeGrowthSub)?,
            U256::from(info.liquidity.get()),
            full_math::Q128,
        )?;

        // update storage
        if delta != 0 {
            info.liquidity.set(U128::wrap(&liquidity_next));
        }
        info.fee_growth_inside_0.set(fee_growth_inside_0);
        info.fee_growth_inside_1.set(fee_growth_inside_1);
        if !owed_fees_0.is_zero() || !owed_fees_1.is_zero() {
            // overflow is the user's problem, they should withdraw earlier
            let new_fees_0 = info
                .token_owed_0
                .get()
                .wrapping_add(U128::wrapping_from(owed_fees_0));
            info.token_owed_0.set(new_fees_0);

            let new_fees_1 = info
                .token_owed_1
                .get()
                .wrapping_add(U128::wrapping_from(owed_fees_1));
            info.token_owed_1.set(new_fees_1);
        }

        Ok(())
    }
    pub fn collect_fees(
        &mut self,
        key: StoragePositionKey,
        amount_0: u128,
        amount_1: u128,
    ) -> (u128, u128) {
        let mut position = self.positions.setter(key);

        let owed_0 = position.token_owed_0.get().unwrap();
        let owed_1 = position.token_owed_1.get().unwrap();

        let amount_0 = u128::min(amount_0, owed_0);
        let amount_1 = u128::min(amount_1, owed_1);

        if amount_0 > 0 {
            position.token_owed_0.set(U128::wrap(&(owed_0 - amount_0)));
        }
        if amount_1 > 0 {
            position.token_owed_1.set(U128::wrap(&(owed_1 - amount_1)));
        }

        (amount_0, amount_1)
    }
}

#[solidity_storage]
pub struct StoragePositionInfo {
    pub liquidity: StorageU128,
    pub fee_growth_inside_0: StorageU256,
    pub fee_growth_inside_1: StorageU256,
    pub token_owed_0: StorageU128,
    pub token_owed_1: StorageU128,
}

pub struct StoragePositionKey {
    pub address: Address,
    pub lower: i32,
    pub upper: i32,
}

impl StorageKey for StoragePositionKey {
    // should generate solidity equivalent slots
    fn to_slot(&self, root: B256) -> U256 {
        let mut data = [0_u8; 32 * 4];
        data[12..32].copy_from_slice(&self.address.0 .0);
        data[32 + 28..64].copy_from_slice(&self.lower.to_be_bytes());
        data[64 + 28..96].copy_from_slice(&self.upper.to_be_bytes());
        data[96..128].copy_from_slice(&root.0);

        crypto::keccak(data).into()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::types::U256Extension;
    use stylus_sdk::alloy_primitives::address;

    #[test]
    fn storage_position_key_hash() {
        // test storage keys against ones generated with
        // `cast index "(address, int32, int32)" "(0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6,0,1)" "0"`
        let mut key = StoragePositionKey {
            address: address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            lower: 1,
            upper: 10,
        };
        let slot = key.to_slot(B256::from(U256::from(0)));
        assert_eq!(
            slot,
            U256::from_hex_str(
                "0x085c3b7a49ffe2725aa23060fd5a1a3ac6088e9d9781b3ea02d168a2a10e8824"
            )
        );

        // change the slot
        let slot = key.to_slot(B256::from(U256::from(10)));
        assert_eq!(
            slot,
            U256::from_hex_str(
                "0xeddfe5d613799dbe4c56f99198e52ed01a307037c723268672b373ab605306c7"
            )
        );

        // change the address
        key.address = address!("6221A9c005F6e47EB398fD867784CacfDcFFF4E7");
        let slot = key.to_slot(B256::from(U256::from(10)));
        assert_eq!(
            slot,
            U256::from_hex_str(
                "0xe84b454c06c2aa0ad8d4c0801ad566add33157ce6aebe043c87dc2cb065029c5"
            )
        );

        // change the lower bound
        key.lower = 2;
        let slot = key.to_slot(B256::from(U256::from(10)));
        assert_eq!(
            slot,
            U256::from_hex_str(
                "0xa0a30deb6fc8be4d5e15cc056bf420704da614b0fa624cbcac35eb01ed7b18ad"
            )
        );

        // change the upper bound
        key.upper = 9;
        let slot = key.to_slot(B256::from(U256::from(10)));
        assert_eq!(
            slot,
            U256::from_hex_str(
                "0xf1f9e9a68fcb0cf1c28493ec5092166077b22351ac389fe41736610268780127"
            )
        );
    }
}
