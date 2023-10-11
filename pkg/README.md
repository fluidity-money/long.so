
# Superposition contracts

- `sol`
	- Solidity contracts
- `seawater`
	- Seawater Rust contracts



(only runs on linux)
- ensure recent rust nightly toolchain installed/enabled (`rustup default nightly; rustup update nightly`) - version greater than 1.65
- install cargo stylus `cargo install cargo-stylus`
- ensure submodules initted `git submodule update --init --recursive`
- run node (from github.com/OffchainLabs/nitro-testnode)
- run deploy script with envs
	- ensure envs contain swaps_addr etc

to run node tests, deploy above to the testnode then:
`node --test --loader tsx ethers-tests/test.ts`
