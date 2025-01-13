
# Superposition contracts

## Security

[Security instructions](https://github.com/fluidity-money/long.so/blob/development/SECURITY)

## Contributors

[Contributors](https://github.com/fluidity-money/long.so/blob/development/AUTHORS.md)

## Deployments

### Superposition Mainnet

[Superposition RPC](https://docs.superposition.so/superposition-mainnet/network-details)

#### AMM contract deployments

|        Deployment name         |              Deployment address            |
|--------------------------------|--------------------------------------------|
| Longtail AMM                   | 0xF3334049A3ce7e890bd4f8C6a0FBC70e38fd3746 |
| Longtail NFT manager           | 0xdD193817F66276d1EAd064dF8F3112b553A50d10 |
| Position Handler               | 0x7C70a15Fee9Db2aFf632cc378D8f11bcac0d516d |
| Permit2 router                 | 0x244517Dc59943E8CdFbD424Bdb3262c5f04a1387 |
| Swaps A implementation         | 0x5ad9286c0f0f306022d172d32b27f1b28a8ffc3a |
| Swaps B implementation         | 0x7d0d7d04b2ac05c159972612ef5bf384116c4cf7 |
| Swaps permit2 A implementation | 0x0000000000000000000000000000000000000000 |
| Quotes A implementation        | 0xcb937ecaf8cf29dd9bdb45418d17cfee74673535 |
| Quotes B implementation        | 0x0314353a14099895d2510483b18b52e7bd1a2528 |
| Positions implementation       | 0x206ded2b8c44a0aa08a09845da274059544b23d4 |
| Update position implementation | 0xfd066c8a3dfc1626473aa86a793e6bd73963ce4c |
| Admin implementation           | 0x1292733b7936ed63b4aec201f9fd4c68be2d7c71 |
| Adjust position A impl         | 0xc2311bef0c737d658a4cf3a8022bd907eb584592 |
| Swaps permit2 B implementation | 0x0000000000000000000000000000000000000000 |
| Adjust position B impl         | 0xffb57bb85e00c8ddd80cf45a91e11628ceabab89 |

#### Administrative deployments

|     Deployment name    |              Deployment address            |
|------------------------|--------------------------------------------|
| Proxy admin for Leo    |  |

#### Leo contract deployments

|     Deployment name    |              Deployment address            |
|------------------------|--------------------------------------------|
| Leo proxy              | 0xC5a5bB74e41A01927d29dbffA8Ab796c784bCBA8 |

#### Token deployments

|  Deployment name  |            Deployment address              |
|-------------------|--------------------------------------------|
| USDC (base asset) | 0x6c030c5CC283F791B26816f325b9C632d964F8A1 |
| WETH (native)     | 0x1fB719f10b56d7a85DCD32f27f897375fB21cfdd |
| ARB               | 0xA2555701754464d32D9624149E3fDb459F3c8DE4 |
| FLY               | 0x80eFAD50D395671C13C4b1FA2969f7a7Aa9EF7b3 |
| USDT              | |
| WBTC              | |

### Superposition Testnet

[Superposition RPC](https://docs.superposition.so/superposition-testnet/network-details)

#### AMM contract deployments

|        Deployment name         |              Deployment address            |
|--------------------------------|--------------------------------------------|
| Longtail AMM                   | 0xAe86141e3f1C9168cE6c948FDC884F2A5f45d7B6 |
| Longtail NFT manager           | 0x8aa3750A7e8c98830e3421a89bFf80Fc175e4C98 |
| Position Handler               | 0x73387E7E4DF41f58Be13cdE4Dd4EAf3675c1C44c |
| Permit2 router                 | 0x2246431582087b930F2CE561c34deb8E7e5c44bE |
| Swaps A implementation         | 0x0dc55b20bdf11fb0ea39e61743532711cda5436c |
| Swaps B implementation         | 0xea0edbb819bcf094590000e36f19a5285c6457c3 |
| Swaps permit2 A implementation | 0x0000000000000000000000000000000000000000 |
| Quotes A implementation        | 0xb5fb8fae334286f992a697e75f0c5d68d845415b |
| Quotes B implementation        | 0xd8d7f75988556fb2dd1b971a4848f7b56cbcfd39 |
| Positions implementation       | 0xc9328bb8cdc2a890d428709b781f5f5932addb99 |
| Update position implementation | 0xe6474ec944b35a914f915ce7686cd0003ca5b695 |
| Admin implementation           | 0x60c8d4ef56fd56967fcc123fe6b677bf41105180 |
| Adjust position A impl         | 0xc0111b0fae58f58451ba64dabfc5a2d5aaa0d5d3 |
| Swaps permit2 B implementation | 0x0000000000000000000000000000000000000000 |
| Adjust position B impl         | 0xe96e51ced07a09d99c5b4c6068d274fdb12f9264 |

#### Leo contract deployments

|     Deployment name    |              Deployment address            |
|------------------------|--------------------------------------------|
| Leo                    | 0xADA1629b77A4864340b7b9Dc4B9874068E844b08 |
| Collect implementation | 0xcc76d4d1e7e021bd2309bfe236b345d95b8526c5 |
| Extras implementation  | 0x50bdc4ea3f3003099f936f2fc6f8cee0b730c168 |

#### Useful testing token deployments

|       Deployment name     |              Deployment address            |
|---------------------------|--------------------------------------------|
| fUSDC                     | 0xA8EA92c819463EFbEdDFB670FEfC881A480f0115 |
| WETH                      | 0xde104342B32BCa03ec995f999181f7Cf1fFc04d7 |
| USDC                      | 0x6437fdc89cED41941b97A9f1f8992D88718C81c5 |
| WSPN                      | 0x22b9fa698b68bBA071B513959794E9a47d19214c |
| CATBUX                    | 0x36c116a8851869cf8a99b3Bda0Fad42453D32B99 |

## Errors

Currently, to save on space, errors generated by the contract are terse. Decode the hex to
the appropriate error in this table:

| No |  Hex |                                   Explanation                                           |
|----|------|-----------------------------------------------------------------------------------------|
| 0  | 0x00 | Denominator is 0                                                                        |
| 1  | 0x01 | Result is U256::MAX                                                                     |
| 2  | 0x02 | Sqrt price is 0                                                                         |
| 3  | 0x03 | Sqrt price is less than or equal to quotient                                            |
| 4  | 0x04 | Can not get most significant bit or least significant bit on zero value                 |
| 5  | 0x05 | Liquidity is 0                                                                          |
| 6  | 0x06 | require((product = amount * sqrtPX96) / amount == sqrtPX96 && numerator1 > product);    |
| 7  | 0x07 | Denominator is less than or equal to prod_1                                             |
| 8  | 0x08 | Liquidity Sub                                                                           |
| 9  | 0x09 | Liquidity Add                                                                           |
| 10 | 0x0a | The given tick must be less than, or equal to, the maximum tick                         |
| 11 | 0x0b | Second inequality must be < because the price can never reach the price at the max tick |
| 12 | 0x0c | Overflow when casting to U160                                                           |
| 13 | 0x0d | Liquidity higher than max                                                               |
| 14 | 0x0e | Fee growth sub overflow                                                                 |
| 15 | 0x0f | ERC20 call reverted                                                                     |
| 16 | 0x10 | ERC20 call reverted with no data                                                        |
| 17 | 0x11 | Pool is already initialised                                                             |
| 18 | 0x12 | Contract is already initialised                                                         |
| 19 | 0x13 | Price limit too high                                                                    |
| 20 | 0x14 | Price limit too low                                                                     |
| 21 | 0x15 | Checked abs called on an unexpected positive number                                     |
| 22 | 0x16 | Checked abs called on an unexpected negative number                                     |
| 23 | 0x17 | Checked abs called on uint.min                                                          |
| 24 | 0x18 | Fee result too high                                                                     |
| 25 | 0x19 | Swap result too high                                                                    |
| 26 | 0x1a | Internal swap amounts not matched                                                       |
| 27 | 0x1b | Internal swap result was positive                                                       |
| 28 | 0x1c | Minimum out not reached                                                                 |
| 29 | 0x1d | Only the position owner can use this                                                    |
| 30 | 0x1e | Only the NFT manager can use this                                                       |
| 31 | 0x1f | Only the Seawater admin can use this                                                    |
| 32 | 0x20 | Operation unavailable when the pool is disabled                                         |
| 33 | 0x21 | Invalid tick spacing                                                                    |
| 34 | 0x22 | Swap result too low                                                                     |
| 35 | 0x23 | Liquidity too low or high to be a int128                                                |
| 36 | 0x24 | Invalid tick                                                                            |
| 37 | 0x25 | Pool enabled when it should be disabled for this action                                 |
| 38 | 0x26 | Position is empty when it shouldn't be                                                  |
| 39 | 0x27 | Liquidity that was almost taken was too low when it didn't need to be                   |
| 40 | 0x28 | Fee growth that tried to be calculated was bad internally for a tick                    |

If more bytes are in the error, then the issue was produced by the ERC20 token. Convert
any error types to their selector form to see.

## Access graph

A publicly available graph for Longtail is available. It includes
documentation. [https://testnet-graph.long.so](https://testnet-graph.long.so).

## Building

Longtail ("Seawater") is a diamond-like contract, with the frontend to access
the Stylus diamond facets implemented in Solidity. So, Stylus is needed
with Rust for the implementation contracts, and Foundry is needed
to compile the contract.

To save on contract size, and to reduce gas overhead, this contract stores
the addresses of the swap router, and the admin address, at compile-time.

So these variables must set at compile-time, like so:

### Build variables

|           Name              |                   Description                 |
|-----------------------------|---------------------------------------------- |
| `FLU_SEAWATER_PERMIT2_ADDR` | Uniswap Permit2 router                        |
| `FLU_SEAWATER_FUSDC_ADDR`   | USDC Super Asset to route every trade through |

### Build dependencies

|           Name          |                        Source                        |
|-------------------------|------------------------------------------------------|
| Rust (nightly version)  | [Installer](https://rustup.rs/)                      |
| Cargo Stylus subcommand | [Repo](https://github.com/OffchainLabs/cargo-stylus) |
| Foundry                 | [Installer](https://getfoundry.sh/)                  |
| Make                    | `build-essentials` if you're on Linux                |

### Build process

	make build

## Testing

Testing is done with via a hosted test using cargo features with the
testing flag. `tests.sh` is provided to run both test suites.

End to end testing is currently unavailable due to issues with the deployment
toolchain.

### Testing process

	./tests.sh

### Cargo test tracing

Some of the cargo tests have optional logging, which might help with debugging. To see
these logs, enable the `testing-dbg-<test>`
feature and run the tests without capturing stdout, ie `cargo test
--features=testing,testing-dbg-erc20 -- --nocapture`.

Testing tools are available with the `with_storage` macro, which lets you set slots and
maximum balances for ERC20 transfers. Reproducing on-chain transactions is possible by
using a tracer on the chain the transaciton took place, then examining the storage slots
that were accessed (perhaps by looking at `SLOAD`s), and setting it explicitly with the
macro.

## Deployment

You can deploy the contracts using the `deploy.sh` script.

### Test deployments

Deployments on a local node can be done with `./test-deploy.sh` for simplicity.

### Deployment variables

|           Name            |                                             Description                                             |
|---------------------------|-----------------------------------------------------------------------------------------------------|
| `SEAWATER_PROXY_ADMIN`    | Address that's permitted to administrate the code, including deploying updates, and creating pools. |
| `STYLUS_ENDPOINT`         | URL to access the Stylus node.                                                                      |
| `STYLUS_PRIVATE_KEY`      | Private key to use for deployment.                                                                  |
| `FLU_SEAWATER_FUSDC_ADDR` | Super USDC address to use as the base asset for each pool.                                          |
