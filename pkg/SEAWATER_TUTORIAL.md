
# Seawater Tutorial

This tutorial walks would-be developers through **installing dependencies**, **building**,
and **testing** Seawater (Longtail).

Longtail is a Concentrated Liquidity (V3) style AMM powered by Arbitrum Stylus, a WASM
frontend to the EVM.

Development on this repo is done with the following tools:

1. `Rust` and `Cargo` - The Rust programming language, and it's package manager.
2. `cargo-stylus` - A Cargo subcommand that simplifies Stylus deployment, building, and
testing.
3. `make` - A tool for executing commands based on the edited time of a graph of files.
4. `Forge Foundry` - A testing suite for instrumenting mainly Solidity code.
5. `Bash` - A common shell on Linux-based operating systems.

These tools are used to build and test different parts of the repo. Forge is used to test
and compile the Solidity code to EVM bytecode, and Rust, Cargo Stylus and Make is used to
build the Stylus code.

## What is WASM?

WASM is an open bytecode format that was originally intended for the web browser. It's
size efficiency and open development led it to be adopted by the web3 industry.

## Installation

First, install Rust:

	# https://rustup.rs/
	curl -LsSf https://sh.rustup.rs | sh

Second, install `cargo stylus`:

	cargo install cargo-stylus

This will install the `cargo stylus` command.

Next, install the wasm target to Rust, to compile wasm binaries:

	rustup target add wasm32-unknown-unknown

Great! That's Rust and the Stylus tooling out of the way.

We next install Foundry:

	#https://book.getfoundry.sh/getting-started/installation
	curl -LsSf https://foundry.paradigm.xyz | sh

## Building

