#!/bin/sh -e

export SPN_GETH_URL=http://127.0.0.1:8547

cargo test --features testing

#forge test

#node --test --loader tsx ethers-tests/test.ts
