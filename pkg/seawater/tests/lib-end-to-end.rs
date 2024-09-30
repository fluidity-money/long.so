use proptest::{collection, prelude::*, test_runner::TestCaseError};

use libseawater::{error::Error, maths::tick_math, test_utils, Pools};

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg,
};

use arrayvec::ArrayVec;

const LP_MAX_INT128: i128 = 100000000000000000000000000;

fn strat_u256() -> impl Strategy<Value = U256> {
    (0..32).prop_perturb(move |steps, mut rng| {
        U256::from_be_slice(
            (0..=steps)
                .map(|_| rng.gen())
                .collect::<ArrayVec<u8, 256>>()
                .as_slice(),
        )
    })
}

// Increase the position by way of incrPosition.
#[derive(Clone, Debug)]
struct ActionAdjustPositionIncrease {
    low: i32,
    up: i32,
    amount0: i128,
    amount1: i128,
}

#[derive(Clone, Debug)]
struct ActionSwap1 {
    zero_to_one: bool,
    amount0: i128,
    amount1: i128
}

fn next_lowest_tick(spacing: u8, x: i32) -> i32 {
    let spacing = spacing as i32;
    if x % spacing == 0 {
        x
    } else {
        x - (x % spacing)
    }
}

fn next_highest_tick(spacing: u8, x: i32) -> i32 {
    let spacing = spacing as i32;
    if x % spacing == 0 {
        x
    } else {
        x + (spacing - (x % spacing))
    }
}

fn strat_update_position_increase(
    tick_spacing: u8,
) -> impl Strategy<Value = ActionAdjustPositionIncrease> {
    let tick_min = tick_math::get_min_tick(tick_spacing);
    let tick_max = tick_math::get_max_tick(tick_spacing);
    (tick_min..=tick_max, 0..LP_MAX_INT128, 0..LP_MAX_INT128).prop_flat_map(
        move |(low, amount0, amount1)| {
            (low..=tick_max).prop_map(move |up| ActionAdjustPositionIncrease {
                low: next_highest_tick(tick_spacing, low),
                up: next_lowest_tick(tick_spacing, up),
                amount0,
                amount1,
            })
        },
    )
}

fn strat_pool_and_position_creation(
) -> impl Strategy<Value = (u8, Vec<ActionAdjustPositionIncrease>)> {
    (0..10_000_usize).prop_flat_map(move |i| {
        prop_oneof![Just(10), Just(60), Just(200)].prop_flat_map(move |spacing| {
            (
                Just(spacing),
                collection::vec(strat_update_position_increase(spacing), i),
            )
                .prop_map(|(x, y)| (x, y))
        })
    })
}

fn fee_of_spacing(x: u8) -> u32 {
    match x {
        10 => 500,
        60 => 3000,
        200 => 10_000,
        _ => panic!("{}", x),
    }
}

proptest! {
    #[test]
    fn test_mint_position_ranges(
        // Positions split 1 is used to figure out which trades should be in epoch 1.
        positions_split_count_1 in 0..10_000_usize in
        // Positions split 2 is used to figure out which trades should be in epoch 2.
        // Will be whatever's left from the position creation.
        positions_split_count_2 in 0..10_000_usize in
        (spacing, positions) in strat_pool_and_position_creation()
    ) {
        test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| -> Result<(), TestCaseError> {
            let pool = Address::ZERO;
            contract.ctor(msg::sender(), Address::ZERO, Address::ZERO).unwrap();
            let fee = fee_of_spacing(spacing);
            contract.create_pool_D650_E2_D0(
                pool,
                U256::from_limbs([9433916063688681729, 246222, 0, 0]), //4542003653232976906676481
                fee,
                spacing,
                u128::MAX
            ).unwrap();
            contract.enable_pool_579_D_A658(pool, true).unwrap();
            let sqrt_price = contract.sqrt_price_x967_B8_F5_F_C5(pool).unwrap();
            let positions = positions.into_iter().enumerate().filter_map(|(_, pos)| -> Option<(U256, U256, U256, ActionAdjustPositionIncrease)> {
                let ActionAdjustPositionIncrease{low, up, amount0, amount1} = pos;
                let invalid_tick_bytes: Vec<u8> = Error::InvalidTick.into();
                let id = match contract.mint_position_B_C5_B086_D(pool, low, up) {
                    Ok(id) => id,
                    Err(b) => if b == invalid_tick_bytes && low >= up {
                        return None
                    } else {
                        panic!("err: {:?}", b)
                    },
                };
                let amount0 = U256::from(amount0);
                let amount1 = U256::from(amount1);
                let incr_res = contract.incr_position_C_3_A_C_7_C_A_A(
                    pool,
                    id,
                    U256::ZERO,
                    U256::ZERO,
                    amount0,
                    amount1
                );
                let err_liq_too_low_or_high: Vec<u8> =
                    Error::LiquidityAmountTooWide.into();
                match incr_res {
                    // Assume this function is fine if it breaks like this.
                    Err(b) => {
                        if b == err_liq_too_low_or_high {
                            //eprintln!("{sqrt_price},{low},{up},{amount0},{amount1},FAILURE");
                            return None
                        } else {
                            eprintln!("{fee},{sqrt_price},{low},{up},{amount0},{amount1},FAILED WITH {}", std::str::from_utf8(&b).unwrap());
                            return None;
                        }
                    },
                    _ => ()
                };
                let (taken0, taken1) = incr_res.unwrap();
                if taken0 == U256::ZERO {
                    return None
                };
                if taken1 == U256::ZERO {
                    return None
                };
                assert!(taken0 <= amount0, "taken0 ({taken0}) <= amount0 ({amount0})");
                assert!(taken1 <= amount1, "taken1 ({taken1}) <= amount1 ({amount1})");
                Some((id, taken0, taken1, pos))
            })
                .collect::<Vec<_>>();
            prop_assume!(positions.len() > 0);

            // Time to start making some trades!

            // Time to LP some more. Do this a variable number of times. Make sure to
            // add them to the other vector.

            // Time to make some more trades.

            // Time to collect all the LP from the positions we created.

            for (position_id, taken0, taken1, ActionAdjustPositionIncrease{low, up, amount0, amount1}) in positions {
                let liq: i128 =
                    contract.position_liquidity_8_D11_C045(pool, position_id)
                        .unwrap()
                        .try_into()
                        .unwrap();
                eprintln!("{fee},{sqrt_price},{low},{up},{amount0},{amount1},{taken0},{taken1},{liq},SUCCESS");
                contract.update_position_C_7_F_1_F_740(pool, position_id, -liq)
                    .unwrap();
            }
            Ok(())
        });
    }
}
