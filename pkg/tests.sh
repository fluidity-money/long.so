#!/bin/sh

export RUST_BACKTRACE=1

cargo test --features testing -- test_mint_position_ranges --nocapture

