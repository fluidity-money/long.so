
# Long Tail contracts

Long Tail is Arbitrum's cheapest and most rewarding AMM.

## Deployments

### Superposition Testnet

[Superposition RPC](https://docs.superposition.so/superposition-testnet/network-details)

#### AMM contract deployments

|       Deployment name     |              Deployment address            |
|---------------------------|--------------------------------------------|
| Long Tail AMM             | 0xDAbA5b9638D0b8fC2D131315b5d6119194A12B7c |
| Long Tail NFT manager     | 0x5E87aafE66A2C0f5BFfAFCBEE6252C2ab29C6996 |
| Long Tail Proxy Admin     | 0xE4A7aD9Df8B123402833cF567D5333D5C28Da332 |

#### Useful testing token deployments

|       Deployment name     |              Deployment address            |
|---------------------------|--------------------------------------------|
| fUSDC                     | 0xA8EA92c819463EFbEdDFB670FEfC881A480f0115 |

## Security

[Security instructions](https://github.com/fluidity-money/long.so/blob/development/SECURITY)

## Contributors

[Contributors](https://github.com/fluidity-money/long.so/blob/development/AUTHORS.md)

## Building

Superposition AMM is a diamond-like contract, with the frontend to access
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

Testing is done either on-chain with the live Ethers-powered environment
(at the time of writing, there is no native on-chain testing with a
forking suite), or via a hosted test using cargo features with the
testing flag.

### Testing dependencies

|          Name           |                         Source                         |
|-------------------------|--------------------------------------------------------|
| Node                    | [Website](https://nodejs.org/en)                       |
| NPM                     | [Website](https://www.npmjs.com/)                      |
| Nitro testnode          | [Repo](https://github.com/OffchainLabs/nitro-testnode) |

Testing the local environment using Ethers is the process of:

1. Deploying a local Stylus testnode.
2. Running the ethers test suite.

Running the Ethers test suite is as simple as running `./tests.sh`,
which will also run tests on the host environment with stubbed out ERC20.

### Running a local testnode

1. Clone the [Nitro repo](https://github.com/OffchainLabs/nitro-testnode) with submodules on the `stylus` branch.
2. Run the testing script `./test-node.bash --init`. This will run the Stylus suite using Docker Compose, and make it available locally.

### Testing process

	./tests.sh

### Cargo test tracing

Some of the cargo tests have optional logging, which might help with debugging. To see these logs, enable the `testing-dbg-<test>`
feature and run the tests without capturing stdout, ie `cargo test --features=testing,testing-dbg-erc20 -- --nocapture`.

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

## Debugging errors

Currently, to save on space, errors generated by the contract are terse. As a guideline,
these steps could be followed to understand the nature of an error:

1. Convert the byte to it's integer representation, then go through the [errors file](seawater/src/error.rs) file to find the offset in the enum. The contract was written before error handling was mature in Stylus.
2. If more bytes are in the error, then it's possible that it was produced by another contract. Convert any error types to their keccak form to see. For example, an allowance error might be hard to unpack, and it'll be several bytes.
