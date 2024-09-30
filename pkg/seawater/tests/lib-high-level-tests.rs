use libseawater::{error::Error, eth_serde, test_utils, types::I256Extension, types::*, Pools};

use ruint_macro::uint;

use stylus_sdk::{
    alloy_primitives::{address, bytes},
    msg,
};

#[test]
fn test_decode_swap() {
    // taken from an ethers generated blob
    let data = bytes!(
        "baef4bf9"
        "00000000000000000000000028f99e094fc846d4f5c8ad91e2ffd6ff92b0e7ca"
        "0000000000000000000000000000000000000000000000000000000000000001"
        "000000000000000000000000000000000000000000000000000000000000000a"
        "00000000000000000000000000000000000000057a2b748da963c00000000000"
        "0000000000000000000000000000000000000000000000000000000000000001"
        "00000000000000000000000000000000000000000000000000000000655d6b6d"
        "000000000000000000000000000000000000000000000000000000000000000a"
        "0000000000000000000000000000000000000000000000000000000000000100"
        "0000000000000000000000000000000000000000000000000000000000000041"
        "749af269b6860d64e97485e6be28448028f0e5e306b723fec3967bd489d667c8"
        "3c679180bc36f3d6ea751198b01e4b082e83ed853265a504d1f56f6712ee7380"
        "1b00000000000000000000000000000000000000000000000000000000000000"
    )
    .0;

    let data = &data;

    let (_, data) = eth_serde::parse_selector(data);
    let (pool, data) = eth_serde::parse_addr(data);
    let (zero_for_one, data) = eth_serde::parse_bool(data);
    let (amount, data) = eth_serde::parse_i256(data);
    let (_price_limit_x96, data) = eth_serde::parse_u256(data);
    let (nonce, data) = eth_serde::parse_u256(data);
    let (_deadline, data) = eth_serde::parse_u256(data);
    let (max_amount, data) = eth_serde::parse_u256(data);
    let (_, data) = eth_serde::take_word(data); // placeholder
    let (_sig, data) = eth_serde::parse_bytes(data);

    assert_eq!(pool, address!("28f99e094fc846d4f5c8ad91e2ffd6ff92b0e7ca"));
    assert_eq!(zero_for_one, true);
    assert_eq!(amount.abs_pos().unwrap(), uint!(10_U256));
    assert_eq!(nonce, uint!(1_U256));
    assert_eq!(max_amount, uint!(10_U256));
    assert_eq!(data.len(), 0);
}

#[test]
fn test_similar_to_ethers() -> Result<(), Vec<u8>> {
    test_utils::with_storage::<_, Pools, _>(
        None, // slots map
        None, // caller erc20 balances
        None, // amm erc20 balances
        |contract| {
            // Create the storage
            contract.ctor(msg::sender(), Address::ZERO, Address::ZERO)?;
            let token_addr = address!("97392C28f02AF38ac2aC41AF61297FA2b269C3DE");

            // First, we set up the pool.
            contract.create_pool_D650_E2_D0(
                token_addr,
                test_utils::encode_sqrt_price(50, 1), // the price
                0,
                1,
                100000000000,
            )?;

            contract.enable_pool_579_D_A658(token_addr, true)?;

            let lower_tick = test_utils::encode_tick(50);
            let upper_tick = test_utils::encode_tick(150);
            let liquidity_delta = 20000;

            // Begin to create the position, following the same path as
            // in `createPosition` in ethers-tests/tests.ts
            contract.mint_position_B_C5_B086_D(token_addr, lower_tick, upper_tick)?;
            let position_id = contract
                .next_position_id
                .clone()
                .checked_sub(U256::one())
                .unwrap();

            contract.update_position_C_7_F_1_F_740(token_addr, position_id, liquidity_delta)?;

            Ok(())
        },
    )
}

#[test]
fn test_alex() -> Result<(), Vec<u8>> {
    test_utils::with_storage::<_, Pools, _>(
        None, // slots map
        None, // caller erc20 balances
        None, // amm erc20 balances
        |contract| {
            // Create the storage
            contract.seawater_admin.set(msg::sender());
            let token_addr = address!("97392C28f02AF38ac2aC41AF61297FA2b269C3DE");

            // First, we set up the pool.
            contract.create_pool_D650_E2_D0(
                token_addr,
                test_utils::encode_sqrt_price(100, 1), // the price
                0,
                1,
                100000000000,
            )?;

            contract.enable_pool_579_D_A658(token_addr, true)?;

            let lower_tick = 39122;
            let upper_tick = 50108;
            let liquidity_delta = 20000;

            // Begin to create the position, following the same path as
            // in `createPosition` in ethers-tests/tests.ts
            contract.mint_position_B_C5_B086_D(token_addr, lower_tick, upper_tick)?;
            let position_id = contract
                .next_position_id
                .clone()
                .checked_sub(U256::one())
                .unwrap();

            contract.update_position_C_7_F_1_F_740(token_addr, position_id, liquidity_delta)?;

            Ok(())
        },
    )
}

#[test]
fn decr_nonexisting_position() {
    use core::str::FromStr;

    let token = Address::with_last_byte(1);

    test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| -> Result<(), Vec<u8>> {
        contract.ctor(msg::sender(), msg::sender(), msg::sender())?;

        contract.create_pool_D650_E2_D0(
            token,
            U256::from_str("792281625142643375935439503360").unwrap(), // encodeSqrtPrice(100)
            3000,
            1,
            u128::MAX,
        )?;

        contract.enable_pool_579_D_A658(token, true)?;

        let id = U256::from(0);

        contract.mint_position_B_C5_B086_D(token, -887272, 887272)?;

        assert_eq!(
            contract
                .decr_position_09293696(
                    token,
                    id,
                    U256::zero(),
                    U256::zero(),
                    U256::from(10000),
                    U256::from(10000),
                )
                .unwrap_err(),
            Vec::<u8>::from(Error::LiquiditySub)
        );

        Ok(())
    })
    .unwrap();
}

#[test]
fn decr_existing_position_some() {
    use core::str::FromStr;

    let token = Address::with_last_byte(1);

    test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| -> Result<(), Vec<u8>> {
        contract.ctor(msg::sender(), msg::sender(), msg::sender())?;

        contract.create_pool_D650_E2_D0(
            token,
            U256::from_str("792281625142643375935439503360").unwrap(), // encodeSqrtPrice(100)
            3000,
            1,
            u128::MAX,
        )?;

        contract.enable_pool_579_D_A658(token, true)?;

        let id = U256::from(0);

        contract.mint_position_B_C5_B086_D(token, -887272, 887272)?;

        let (amount_0_taken, amount_1_taken) = contract.incr_position_C_3_A_C_7_C_A_A(
            token,
            id,
            U256::zero(),
            U256::zero(),
            U256::from(100_000),
            U256::from(100_000),
        )?;

        // Took some amount off the amount to take, since the taking rounds
        // up, and the removal rounds down.

        contract.decr_position_09293696(
            token,
            id,
            U256::from(998),
            U256::from(99_000),
            amount_0_taken,
            amount_1_taken,
        )?;

        Ok(())
    })
    .unwrap();
}

#[test]
fn ethers_suite_orchestrated_uniswap_single() {
    test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| -> Result<(), Vec<u8>> {
        let token0 = address!("9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
        contract.ctor(msg::sender(), Address::ZERO, Address::ZERO)?;
        contract.create_pool_D650_E2_D0(
            token0,
            U256::from_limbs([0, 42949672960, 0, 0]), //792281625142643375935439503360
            500,                                      // fee
            10,                                       // tick spacing
            u128::MAX,
        )?;
        contract.enable_pool_579_D_A658(token0, true)?;
        contract.mint_position_B_C5_B086_D(token0, 39120, 50100)?;
        let id = U256::ZERO;
        contract
            .update_position_C_7_F_1_F_740(token0, id, 20000)
            .map(|_| ())?;
        let (amount_out_0, amount_out_1) =
            contract.swap_904369_B_E(token0, true, I256::try_from(1000_i32).unwrap(), U256::MAX)?;
        assert_eq!(amount_out_0, I256::try_from(833).unwrap());
        assert_eq!(amount_out_1, I256::try_from(-58592).unwrap());
        Ok(())
    })
    .unwrap()
}

#[test]
fn ethers_suite_orchestrated_uniswap_single_version_2() {
    test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| -> Result<(), Vec<u8>> {
        let token0 = address!("9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
        contract.ctor(msg::sender(), Address::ZERO, Address::ZERO)?;
        contract.create_pool_D650_E2_D0(
            token0,
            U256::from_limbs([0, 42949672960, 0, 0]), //792281625142643375935439503360
            500,                                      // fee
            10,                                       // tick spacing
            u128::MAX,
        )?;
        contract.enable_pool_579_D_A658(token0, true)?;
        contract.mint_position_B_C5_B086_D(token0, 39120, 50100)?;
        let id = U256::ZERO;
        contract
            .update_position_C_7_F_1_F_740(token0, id, 20000)
            .map(|_| ())?;
        let (amount_out_0, amount_out_1) = contract.swap_904369_B_E(
            token0,
            false,
            I256::try_from(9_i32).unwrap(),
            U256::from_limbs([6743328256752651558, 17280870778742802505, 4294805859, 0])
                - U256::one(), //146144670348521010328727305220398882237872397034 - 1
        )?;
        eprintln!("amount out 0: {amount_out_0}, amount out 1: {amount_out_1}");
        assert_eq!(amount_out_0, I256::ZERO);
        assert_eq!(amount_out_1, I256::try_from(9).unwrap());
        Ok(())
    })
    .unwrap()
}

#[test]
fn ethers_suite_orchestrated_uniswap_two() {
    test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| {
        let token0 = address!("9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
        let token1 = address!("9fE46736679d2D9a65F0992F2272dE9f3c7fa6e1");
        contract
            .ctor(msg::sender(), Address::ZERO, Address::ZERO)
            .unwrap();
        contract
            .create_pool_D650_E2_D0(
                token0,
                U256::from_limbs([0, 42949672960, 0, 0]), //792281625142643375935439503360
                500,                                      // fee
                10,                                       // tick spacing
                u128::MAX,
            )
            .unwrap();
        contract
            .create_pool_D650_E2_D0(
                token1,
                U256::from_limbs([0, 42949672960, 0, 0]), //792281625142643375935439503360
                500,                                      // fee
                10,                                       // tick spacing
                u128::MAX,
            )
            .unwrap();
        contract.enable_pool_579_D_A658(token0, true).unwrap();
        contract.enable_pool_579_D_A658(token1, true).unwrap();
        contract
            .mint_position_B_C5_B086_D(token0, 39120, 50100)
            .unwrap();
        contract
            .mint_position_B_C5_B086_D(token1, 39120, 50100)
            .unwrap();
        let id = U256::ZERO;
        contract
            .update_position_C_7_F_1_F_740(token0, id, 20000)
            .unwrap();
        contract
            .update_position_C_7_F_1_F_740(token1, U256::one(), 20000)
            .unwrap();
        let (amount_out_0, amount_out_1) = contract
            .swap_2_exact_in_41203_F1_D(token0, token1, U256::from(1000), U256::from(10))
            .unwrap();
        eprintln!("final amount out 0: {amount_out_0}, amount out 1: {amount_out_1}");
    });
}

#[test]
fn ethers_suite_swapping_with_permit2_blobs_no_permit2() {
    test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| {
        let token0 = address!("9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
        contract
            .ctor(msg::sender(), Address::ZERO, Address::ZERO)
            .unwrap();
        contract
            .create_pool_D650_E2_D0(
                token0,
                U256::from_limbs([0, 42949672960, 0, 0]), //792281625142643375935439503360
                500,                                      // fee
                10,                                       // tick spacing
                u128::MAX,
            )
            .unwrap();
        contract.enable_pool_579_D_A658(token0, true).unwrap();
        contract
            .mint_position_B_C5_B086_D(token0, 39120, 50100)
            .unwrap();
        let id = U256::ZERO;
        contract
            .update_position_C_7_F_1_F_740(token0, id, 20000)
            .unwrap();
        let (amount_out_0, amount_out_1) = contract
            .swap_904369_B_E(
                token0,
                true,
                I256::try_from(10).unwrap(),
                U256::from_limbs([12205810521336709120, 23524504717, 0, 0]), //433950517987477953199883681792
            )
            .unwrap();
        assert_eq!(amount_out_0, I256::try_from(10).unwrap());
        assert_eq!(amount_out_1, I256::try_from(-895).unwrap());
    });
}
