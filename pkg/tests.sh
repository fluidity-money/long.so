#!/bin/sh -e

export RPC_URL=http://127.0.0.1:8547

cargo test --features admin,testing
cargo test --features update_positions,testing
cargo test --features swaps,testing
cargo test --features swap_permit2,testing
cargo test --features quotes,testing

node --test --loader tsx ethers-tests/test.ts
