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
    amount1: i128,
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

#[test]
fn test_revert_incr_pos() {
    //curl -d '{"jsonrpc":"2.0","id":40,"method":"eth_call","params":[{"data":"0x000001020000000000000000000000006437fdc89ced41941b97a9f1f8992d88718c81c5000000000000000000000000000000000000000000000000000000000000313b0000000000000000000000000000000000000000000000000000000000cdfe600000000000000000000000000000000000000000000000000000000003e9324e0000000000000000000000000000000000000000000000000000000000d97010000000000000000000000000000000000000000000000000000000000420d18b","from":"0xFEb6034FC7dF27dF18a3a6baD5Fb94C0D3dCb6d5","to":"0x4622e516abFd1BBF34E0e884570eA0FC7EeF10cc"},"13980427"]}' https://testnet-rpc.superposition.so
    use const_hex::decode;
    use libseawater::host_test_shims;
    use maplit::hashmap;
    use stylus_sdk::alloy_primitives::address;
    test_utils::with_storage::<_, Pools, _>(None, None, None, |contract| {
        let words = hashmap! {
            "0x0000000000000000000000000000000000000000000000000000000000000000" => "0x000000000000000000000000feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5",
            "0x23feb6d8d2b252125e987a23345e54328fb4bf1192972da3b653a37092a57d15" => "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x3c79da47f96b0f39664f73c0a1f350580be90742947dddfa21ba64d578dfe600" => "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x3d1d41a8d46b1f9d86db08fd55d0f82339b394ac04ec979dbbce935f7a6de06a" => "0x00000000000000000000000f02ef1c8d00000000000000000000000f02ef1c8d",
            "0x3d1d41a8d46b1f9d86db08fd55d0f82339b394ac04ec979dbbce935f7a6de06b" => "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x3d1d41a8d46b1f9d86db08fd55d0f82339b394ac04ec979dbbce935f7a6de06c" => "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x3d1d41a8d46b1f9d86db08fd55d0f82339b394ac04ec979dbbce935f7a6de06d" => "0x0000000000000000000000000000000000000000000000010000000000000000",
            "0x5af493b7b07abc9e18b90146696abde96f97f15ce82e13957ba43d6f5007c506" => "0x0000000000000000000000000080000000000000000000000000000000000000",
            "0x6d158211a169125e8fa12f28e1e4439d9364e0d218085b3b60a43c02a3bbc725" => "0x000000000000000000000000000000000000000ba9d1746c000d89e6fff2761a",
            "0x6d158211a169125e8fa12f28e1e4439d9364e0d218085b3b60a43c02a3bbc726" => "0x000000000000000000000000000000000206b75b68b1c471cba3f596e0646615",
            "0x6d158211a169125e8fa12f28e1e4439d9364e0d218085b3b60a43c02a3bbc727" => "0x00000000000000000000000000000008c6726454e301697698de0ba1bea5c9f4",
            "0x6d158211a169125e8fa12f28e1e4439d9364e0d218085b3b60a43c02a3bbc728" => "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x81e9c7c70971b5eb969cec21a82e6deed42e7c6736e0e83ced66d72297d9f1d7" => "0x00000000000000000000000065ec89436fd7f23dd054e9a8c872a5ac01224a58",
            "0x8fbdd8104933a0a177010a6634261ffafc4ccc198a7e6ad034d7dcf09d0f560d" => "0x00000000000000000000ffffffffffffffffffffffffffffffff0a000001f401",
            "0x8fbdd8104933a0a177010a6634261ffafc4ccc198a7e6ad034d7dcf09d0f560e" => "0x00000000000000000000000000000000020790b80b535a27692ff8f5078bfebd",
            "0x8fbdd8104933a0a177010a6634261ffafc4ccc198a7e6ad034d7dcf09d0f560f" => "0x00000000000000000000000000000008c6782e4083b0dd7369a895c370ad8552",
            "0x8fbdd8104933a0a177010a6634261ffafc4ccc198a7e6ad034d7dcf09d0f5611" => "0x00000000000000000000000000004f560000000000000000000000d503f41c0a",
            "0x8fbdd8104933a0a177010a6634261ffafc4ccc198a7e6ad034d7dcf09d0f5612" => "0x0000000000000000000000000000000000000002c2b78b4a6492e652216704eb",
            "0xa6c747c93abeb9d383a2bfbbf5483f113a113333cf85a431c77844817e468513" => "0xfffffffffffffffffffffff0fd10e37300000000000000000000000f02ef1c8d",
            "0xa6c747c93abeb9d383a2bfbbf5483f113a113333cf85a431c77844817e468514" => "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0xa6c747c93abeb9d383a2bfbbf5483f113a113333cf85a431c77844817e468515" => "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0xa6c747c93abeb9d383a2bfbbf5483f113a113333cf85a431c77844817e468516" => "0x0000000000000000000000000000000000000000000000010000000000000000",
            "0xda5136ce5ed2e1c80e1be7eb5326a41deb52862b26dbcc8467cd590cbd14b481" => "0x000000000000000000000000feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5",
};
        for (word, key) in words {
            host_test_shims::insert_word(
                decode(word).unwrap().try_into().unwrap(),
                decode(key).unwrap().try_into().unwrap(),
            )
        }
        contract
            .incr_pos_D_3521721(
                address!("6437fdc89ced41941b97a9f1f8992d88718c81c5"),
                U256::from(12603),
                U256::from(13500000),
                U256::from(65614414),
                U256::from(14250000),
                U256::from(69259659),
            )
            .unwrap();
    })
}

proptest! {
    #[test]
    fn test_mint_position_ranges(
        // Positions split 1 is used to figure out which trades should be in epoch 1.
        positions_split_count_1 in 0..10_000_usize,
        // Positions split 2 is used to figure out which trades should be in epoch 2.
        // Will be whatever's left from the position creation.
        positions_split_count_2 in 0..10_000_usize,
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
                let incr_res = contract.incr_pos_D_3521721(
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
