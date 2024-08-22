#!/bin/sh

export RUST_BACKTRACE=1

cargo test --package seawater --features testing
