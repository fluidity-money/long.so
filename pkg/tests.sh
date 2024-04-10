#!/bin/sh -e

export RPC_URL=http://127.0.0.1:8547

cargo test --features testing

node --test --loader tsx ethers-tests/test.ts
