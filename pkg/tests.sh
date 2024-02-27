#!/bin/sh -e

export RPC_URL=http://127.0.0.1:8547

cargo test --features update_positions,testing

node --test --loader tsx ethers-tests/test.ts
