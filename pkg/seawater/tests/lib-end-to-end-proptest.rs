#![cfg(all(not(target_arch = "wasm32"), feature = "testing"))]

use std::{cell::RefCell, str::FromStr};

use libseawater::{error::Error, maths::tick_math, test_utils, Pools};

use proptest::{collection, prelude::*, test_runner::TestCaseError};

use stylus_sdk::{
    alloy_primitives::{Address, I256, U256},
    msg,
};

const LP_MAX_INT128: i128 = 100000000000000000000000000;

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
    zero_for_one: bool,
    amount: i128,
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
    (0..100_usize).prop_flat_map(move |i| {
        prop_oneof![Just(10), Just(60), Just(200)].prop_flat_map(move |spacing| {
            (
                Just(spacing),
                collection::vec(strat_update_position_increase(spacing), i),
            )
                .prop_map(|(x, y)| (x, y))
        })
    })
}

fn strat_swap_1() -> impl Strategy<Value = ActionSwap1> {
    (0..i128::MAX).prop_flat_map(move |amount| {
        any::<bool>().prop_map(move |zero_for_one| ActionSwap1 {
            zero_for_one,
            amount,
        })
    })
}

fn strat_swaps_1() -> impl Strategy<Value = Vec<ActionSwap1>> {
    (1..=1000_usize).prop_flat_map(move |i| collection::vec(strat_swap_1(), i))
}

fn fee_of_spacing(x: u8) -> u32 {
    match x {
        10 => 500,
        60 => 3000,
        200 => 10_000,
        _ => panic!("{}", x),
    }
}

#[test]
fn test_weird_behaviour() {
    //15272948
    test_utils::with_storage::<_, Pools, _>(None, None, None, |c| {
        let pool = Address::from([1_u8; 20]);
        c.ctor(msg::sender(), Address::ZERO, Address::ZERO).unwrap();
        c.create_pool_D650_E2_D0(
            pool,
            U256::from_limbs([9433916063688681729, 246222, 0, 0]), //4542003653232976906676481
            3000,
        )
        .unwrap();
    })
}

proptest! {
    #[test]
    fn test_mint_position_ranges(
        // Positions split 1 is used to figure out which positions should be created at first.
        positions_split_count_1 in 0..10_usize,
        // Positions split 2 is used to figure out which trades should be in stage 2 of testing.
        // After stage 1.
        positions_split_count_2 in 0..50_usize,
        // Number of swaps to use for the first part.
        //swaps_split_count_1 in 0..7_000_usize,
        // Number of swaps to use for the second part.
        //swaps_split_count_2 in 0..7_000_usize,
        // Positions to use. Cut up by the split count field that was used before.
        (spacing, positions_vec) in strat_pool_and_position_creation(),
        swaps in strat_swaps_1()
    ) {
        test_utils::with_storage::<_, Pools, _>(None, None, None, |mut contract| -> Result<(), TestCaseError> {
            let pool = Address::from([1_u8; 20]);
            contract.ctor(msg::sender(), Address::ZERO, Address::ZERO).unwrap();
            let fee = fee_of_spacing(spacing);
            contract.create_pool_D650_E2_D0(
                pool,
                U256::from_limbs([9433916063688681729, 246222, 0, 0]), //4542003653232976906676481
                fee,
            ).unwrap();
            contract.enable_pool_579_D_A658(pool, true).unwrap();

            let accrued_amount0 = RefCell::new(U256::ZERO);
            let accrued_amount1 = RefCell::new(U256::ZERO);

            let f_insert_position = |contract: &mut Pools, (_, &ref pos)| -> Option<(U256, U256, U256, ActionAdjustPositionIncrease)> {
                let ActionAdjustPositionIncrease{low, up, amount0, amount1} = *pos;
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
                let incr_res = contract.incr_position_E_2437399(
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
                            //eprintln!("{fee},{sqrt_price},{low},{up},{amount0},{amount1},FAILED WITH {}", std::str::from_utf8(&b).unwrap());
                            return None;
                        }
                    },
                    Ok((taken0, taken1)) => {
                        *accrued_amount0.borrow_mut() += taken0;
                        *accrued_amount1.borrow_mut() += taken1;
                        //println!("{fee},{sqrt_price},{low},{up},{amount0},{amount1},{taken0},{taken1},PUTOK");
                     }
                };
                let (taken0, taken1) = incr_res.unwrap();
                // If taken0 or taken1 is 0, skip
                if taken0.is_zero() || taken1.is_zero() {
                    return None;
                }
                assert!(taken0 <= amount0, "taken0 ({taken0}) <= amount0 ({amount0})");
                assert!(taken1 <= amount1, "taken1 ({taken1}) <= amount1 ({amount1})");
                Some((id, taken0, taken1, pos.clone()))
            };

            let f_make_swap = |contract: &mut Pools, amount: i128, zero_for_one: bool| {
                if amount == 0 {
                    return ()
                }
                let mut x = [0_u8; 32];
                x[..16].copy_from_slice(&amount.to_le_bytes());
                match contract.swap_904369_B_E(pool, zero_for_one, I256::from_le_bytes(x), U256::MAX) {
                    Ok((taken0_, taken1)) => {
                        let taken0_neg = taken0_ < I256::ZERO;
                        let taken1_neg = taken1 < I256::ZERO;
                        let taken0 = u128::from_le_bytes(taken0_.abs().to_le_bytes::<32>()[..16].try_into().unwrap());
                        dbg!(taken0, taken0_, const_hex::encode(taken0_.abs().to_le_bytes::<32>()));
                        let taken1 = u128::from_le_bytes(taken1.abs().to_le_bytes::<32>()[..16].try_into().unwrap());
                        if taken0_neg {
                            *accrued_amount0.borrow_mut() -= U256::from(taken0);
                        } else {
                            *accrued_amount0.borrow_mut() += U256::from(taken0);
                        };
                        if taken1_neg {
                            *accrued_amount1.borrow_mut() -= U256::from(taken1);
                        } else {
                            *accrued_amount1.borrow_mut() += U256::from(taken1);
                        };
                        ()
                        //println!("{fee},{sqrt_price},{zero_for_one},{amount},{taken0},{taken1},SWAPOK")
                    },
                    Err(b) => () // eprintln!("{fee},{sqrt_price},{zero_for_one},{amount},SWAPERR,{:?}", std::str::from_utf8(&b).unwrap()),
                }
            };

            let mut positions = Vec::with_capacity(positions_vec.len());

            positions.extend(positions_vec.iter().take(positions_split_count_1).enumerate().filter_map(|x| f_insert_position(&mut contract, x)));
            //prop_assume!(positions.len() > 0);

            // Time to start making some trades!

            if swaps.len() == 0 { return Ok(()) }

            for ActionSwap1 { zero_for_one, amount } in &swaps {
                f_make_swap(&mut contract, *amount, *zero_for_one)
            }

            // Time to LP some more. Do this a variable number of times. Make sure to
            // add them to the other vector.

            positions.extend(positions_vec.iter().skip(positions_split_count_1).take(positions_split_count_2).enumerate().filter_map(|x| f_insert_position(&mut contract, x)));

            // Time to make some more trades.

            for ActionSwap1 { zero_for_one, amount } in &swaps {
                f_make_swap(&mut contract, *amount, *zero_for_one)
            }

            // Time to collect all the LP from the positions we created.

            for (position_id, taken0, taken1, ActionAdjustPositionIncrease{amount0, amount1, ..}) in positions {
                let liq: i128 =
                    contract.position_liquidity_8_D11_C045(pool, position_id)
                        .unwrap()
                        .try_into()
                        .unwrap();
                let (returned0, returned1) = contract.update_position_C_7_F_1_F_740(pool, position_id, -liq)
                    .unwrap();

                let returned0 = U256::from_str(&returned0.abs().to_string()).unwrap();
                let returned1 = U256::from_str(&returned1.abs().to_string()).unwrap();
                assert!(returned0 <= *accrued_amount0.borrow(), "returned0 {returned0} <= accrued_amount0 {}", *accrued_amount0.borrow());
                assert!(returned1 <= *accrued_amount1.borrow(), "returned1 {returned1} <= accrued_amount1 {}", *accrued_amount1.borrow());

                *accrued_amount0.borrow_mut() -= returned0;
                *accrued_amount1.borrow_mut() -= returned1;
            }
            Ok(())
        }).unwrap()
    }
}
