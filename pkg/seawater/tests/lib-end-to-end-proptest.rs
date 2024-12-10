#![cfg(all(not(target_arch = "wasm32"), feature = "testing"))]

use libseawater::{maths::tick_math, test_utils, Pools};

use proptest::{collection, prelude::*, test_runner::TestCaseError};

use stylus_sdk::{
    alloy_primitives::{Address, I256, U256},
    msg,
};

use std::{
    cell::RefCell,
    process::{Command, Output, Stdio},
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
    (1..100_usize).prop_flat_map(move |i| {
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
    (1..i128::MAX).prop_flat_map(move |amount| {
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
        c.create_pool_653_F_395_E(
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
        (spacing, positions) in strat_pool_and_position_creation(),
        swaps in strat_swaps_1(),
    ) {
        test_utils::with_storage::<_, Pools, _>(
            None,
            None,
            None,
            |contract| -> Result<(), TestCaseError> {
                let contract = RefCell::new(contract);
                let pool = Address::from([1_u8; 20]);
                let Output { stdout, stderr, status } = Command::new("sh")
                  .stdin(Stdio::null())
                  .args([
                    "-c",
                    "cd /home/user/Downloads/uniswap-v3-core && npx hardhat test",
                  ])
                  .output()
                  .unwrap();
                if status.success() {
                    panic!("python: {}", String::from_utf8(stderr).unwrap());
                }
                contract
                    .borrow_mut()
                    .ctor(msg::sender(), Address::ZERO, Address::ZERO)
                    .unwrap();
                let fee = fee_of_spacing(spacing);
                contract
                    .borrow_mut()
                    .create_pool_653_F_395_E(
                        pool,
                        U256::from_limbs([9433916063688681729, 246222, 0, 0]), //4542003653232976906676481
                        fee,
                    )
                    .unwrap();
                contract.borrow_mut().enable_pool_579_D_A658(pool, true).unwrap();
                let mut should_fail = false;
                let positions = positions.iter().map(
                    |ActionAdjustPositionIncrease {
                         low,
                         up,
                         amount0,
                         amount1,
                     }| {
                        let id = contract.borrow_mut().mint_position_B_C5_B086_D(pool, *low, *up).unwrap();
                        let incr_res = contract.borrow_mut().incr_position_E_2437399(
                            pool,
                            id,
                            U256::ZERO,
                            U256::ZERO,
                            U256::from(*amount0),
                            U256::from(*amount1),
                        );
                        if incr_res.is_err() && should_fail {
                            return None;
                        }
                        let (taken0, taken1) = incr_res.unwrap();
                        let amount0 = U256::from(*amount0);
                        let amount1 = U256::from(*amount1);
                        assert!(
                            taken0 <= amount0,
                            "taken0 ({taken0}) <= amount0 ({amount0})"
                        );
                        assert!(
                            taken1 <= amount1,
                            "taken1 ({taken1}) <= amount1 ({amount1})"
                        );
                        Some((id, taken0, taken1))
                    },
                );
                for ActionSwap1 {
                    zero_for_one,
                    amount,
                } in swaps
                {
                    let mut x = [0_u8; 32];
                    x[..16].copy_from_slice(&amount.to_le_bytes());
                    let (taken0_, taken1) = contract
                        .borrow_mut()
                        .swap_904369_B_E(pool, zero_for_one, I256::from_le_bytes(x), U256::MAX)
                        .unwrap();
                    //let taken0 = u128::from_le_bytes(taken0_.abs().to_le_bytes::<32>()[..16].try_into().unwrap());
                    //let taken1 = u128::from_le_bytes(taken1.abs().to_le_bytes::<32>()[..16].try_into().unwrap());
                }
                // Time to collect all the LP from the positions we created.
                for pos_state in positions {
                    match pos_state {
                        Some((position_id, amount0, amount1)) => {
                            let liq: i128 = contract
                                .borrow_mut()
                                .position_liquidity_8_D11_C045(pool, position_id)
                                .unwrap()
                                .try_into()
                                .unwrap();
                            let (returned0, returned1) = contract
                                .borrow_mut()
                                .update_position_C_7_F_1_F_740(pool, position_id, -liq + 1)
                                .unwrap();
                            let returned0 = returned0.into_raw();
                            let returned1 = returned1.into_raw();
                            assert!(amount0 + amount1 <= returned0 + returned1);
                        }
                        None => (),
                    }
                }
                Ok(())
            },
        )
        .unwrap()
    }
}
