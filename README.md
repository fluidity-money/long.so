
# Superposition

Superposition is an AMM and DEX.

The AMM ("Seawater AMM") is currently exclusively deployed on the
Stylus Testnet at the addresses in [DEPLOYMENT](DEPLOYMENT.md). It
leverages [Fluid Assets](https://docs.fluidity.money/docs/learning-and-getting-started/what-are-fluid-assets)
by [Fluidity Money](https://fluidity.money/) and [Arbitrum Stylus](https://arbitrum.io/stylus).

The DEX ("Superposition DEX") is currently in development. It will be
included in this repository upon completion, and deployed on an
(Arbitrum Orbit)[https://arbitrum.io/orbit] chain. Like the AMM it will
heavily leverage Stylus and Fluid Assets. For the DEX, these concepts
are expanded on and leveraged for a "fee negative" experience, while
leveraging Account Abstraction and Intents for a cross-chain
fee-negative experience.

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
