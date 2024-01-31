
# Superposition

Superposition AMM is a fee negative AMM on Arbitrum Stylus.

The AMM ("Seawater AMM internally") is currently exclusively deployed
on the Stylus Testnet at the addresses in [DEPLOYMENT](DEPLOYMENT.md).
It leverages [Fluid
Assets](https://docs.fluidity.money/docs/learning-and-getting-started/what-are-fluid-assets)
by [Fluidity Money](https://fluidity.money/) and [Arbitrum
Stylus](https://arbitrum.io/stylus).

It is currently unaudited, use it at your own risk!

## Architecture

AMM architecture can be found in a Graph file in
[docs/amm.dot](docs/amm.dot).

## Building

	make build

## Dependencies

- Make
- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Rust Wasm backend](https://www.rust-lang.org/what/wasm)
- [Arbitrum Stylus](https://docs.arbitrum.io/stylus/stylus-quickstart)
