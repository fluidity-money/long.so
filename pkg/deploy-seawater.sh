#!/bin/sh -eu

wasm_file="$1"

cargo stylus deploy \
	--endpoint $STYLUS_ENDPOINT \
	--wasm-file-path "$wasm_file" \
	--private-key $STYLUS_PRIVATE_KEY \
	        | tee /dev/stderr \
	        | sed -nr "s/Deploying program to address (.+)(0x.{40}).*/\2/p"
