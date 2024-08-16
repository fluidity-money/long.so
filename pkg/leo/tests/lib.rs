#[cfg(all(test, not(target_arch = "wasm32")))]
mod testing {
    use libleo;

    use stylus_sdk::{
        alloy_primitives::{address, Address, FixedBytes, U256},
        block,
    };

    const POOL: Address = address!("6221a9c005f6e47eb398fd867784cacfdcfff4e7");
    const CAMPAIGN_ID: FixedBytes<8> = FixedBytes::ZERO;
    const POS_ID: U256 = U256::ZERO;

    #[test]
    fn campaign_creation() {
        libleo::host::with_storage::<_, libleo::Leo, _>(
            &[(POOL, POS_ID, -10, 100, U256::ZERO)],
            |leo| {
                let expected_starting = block::timestamp();
                let expected_ending = expected_starting + 1000;

                leo.ctor(Address::ZERO).unwrap();

                leo.create_campaign(
                    CAMPAIGN_ID,       // Identifier
                    POOL,              // Pool
                    -20,               // Tick lower
                    100,               // Tick upper
                    U256::from(2),     // Per second distribution
                    POOL,              // Token to send
                    U256::from(100),   // Starting pool of liquidity
                    expected_starting, // Starting timestamp
                    expected_ending,   // Ending timestamp
                )
                .unwrap();
                // Check that the campaign queries correctly.
                let (lower, upper, per_second, token, distributed, maximum, starting, ending) =
                    leo.campaign_details(POOL, CAMPAIGN_ID).unwrap();
                assert_eq!(lower, -20);
                assert_eq!(upper, 100);
                assert_eq!(per_second, U256::from(2));
                assert_eq!(token, POOL);
                assert_eq!(distributed, U256::ZERO);
                assert_eq!(maximum, U256::from(100));
                assert_eq!(starting, expected_starting);
                assert_eq!(ending, expected_ending);
            },
        )
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod proptesting {
    use libleo;
    use proptest::prelude::*;

    use stylus_sdk::{
        alloy_primitives::{Address, FixedBytes, U256},
        block,
    };

    const POOL: Address = Address::ZERO;
    const CAMPAIGN_ID: FixedBytes<8> = FixedBytes::ZERO;
    const POS_ID: U256 = U256::ZERO;

    const MIN_TICK: i32 = -887272;
    const MAX_TICK: i32 = -MIN_TICK;

    proptest! {
        #[test]
        fn test(
            mut tick_lower in MIN_TICK..MAX_TICK,
            mut tick_upper in MIN_TICK..MAX_TICK,
            per_second in any::<[u64; 4]>(),
            starting_pool in any::<[u64; 4]>(),
            expected_ending in any::<u64>(),
            secs_in in any::<u64>()
        ) {
            if tick_upper < tick_lower {
                (tick_lower, tick_upper) = (tick_upper, tick_lower);
            }
            let per_second = U256::from_limbs(per_second);
            let starting_pool = U256::from_limbs(starting_pool);

            libleo::host::with_storage::<_, libleo::Leo, _>(
                &[(POOL, POS_ID, tick_lower, tick_upper, U256::ZERO)],
                |leo| {
                    let expected_starting = block::timestamp();
                    let expected_ending = expected_starting + expected_ending;

                    libleo::host::advance_time(secs_in);

                    leo.ctor(Address::ZERO).unwrap();

                    leo.create_campaign(
                        CAMPAIGN_ID,       // Identifier
                        POOL,              // Pool
                        -20,               // Tick lower
                        100,               // Tick upper
                        per_second,        // Per second distribution
                        POOL,              // Token to send
                        starting_pool,     // Starting pool of liquidity
                        expected_starting, // Starting timestamp
                        expected_ending,   // Ending timestamp
                    ).unwrap();

                    leo.vest_position(POOL, POS_ID).unwrap();

                    leo.collect_lp_rewards(POOL, POS_ID, vec![CAMPAIGN_ID]).unwrap();
                },
            )
        }
    }
}
