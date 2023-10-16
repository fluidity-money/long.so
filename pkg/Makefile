
.PHONY: admin positions swaps deploy-admin deploy-positions deploy-swaps

all: admin positions swaps

admin: seawater-admin.wasm
positions: seawater-positions.wasm
swaps: seawater-swaps.wasm

CONTRACT_PKG := target/wasm32-unknown-unknown/release/seawater.wasm

RUST_FILES := \
	$(shell find \
		-path target -prune \
		-or -type f -name '*.rs' -print \
		-or -name '*.toml' -print)

CARGO_BUILD_STYLUS := \
	cargo +nightly build \
		-Z build-std=std,panic_abort \
		-Z build-std-features=panic_immediate_abort \
		-Z unstable-options \
		--release \
		--target wasm32-unknown-unknown \
		--package seawater \
		--out-dir .

seawater-admin.wasm: ${RUST_FILES}
	@${CARGO_BUILD_STYLUS} --features admin
	@mv seawater.wasm seawater-admin.wasm
	@rm -f liblibseawater.rlib

seawater-positions.wasm: ${RUST_FILES}
	@${CARGO_BUILD_STYLUS} --features positions
	@mv seawater.wasm seawater-positions.wasm
	@rm -f liblibseawater.rlib

seawater-swaps.wasm: ${RUST_FILES}
	@${CARGO_BUILD_STYLUS} --features swaps
	@mv seawater.wasm seawater-swaps.wasm
	@rm -f liblibseawater.rlib
