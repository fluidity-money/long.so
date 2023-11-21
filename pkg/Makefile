
include config.mk

.PHONY: \
	build \
	stylus \
	admin \
	positions \
	swaps \
	solidity \
	amm-entrypoint \
	ownership-nfts \
	clean

all: build

build: stylus solidity

admin: ${OUT_SEAWATER_ADMIN}
positions: ${OUT_SEAWATER_POSITIONS}
swaps: ${OUT_SEAWATER_SWAPS}

stylus: admin positions swaps

amm-entrypoint: ${OUT_SEAWATER_AMM}
ownership-nfts: ${OUT_OWNERSHIP_NFTS}

solidity: amm-entrypoint ownership-nfts

CARGO_BUILD_STYLUS := \
	cargo +nightly build \
		-Z build-std=std,panic_abort \
		-Z build-std-features=panic_immediate_abort \
		-Z unstable-options \
		--release \
		--target wasm32-unknown-unknown \
		--package seawater \
		--out-dir .

FORGE_BUILD := forge build
DOCKER_BUILD := docker build

### SEAWATER

${OUT_SEAWATER_ADMIN}: ${FILES_RUST}
	@${CARGO_BUILD_STYLUS} --features admin
	@mv seawater.wasm seawater-admin.wasm
	@rm -f liblibseawater.rlib

${OUT_SEAWATER_POSITIONS}: ${FILES_RUST}
	@${CARGO_BUILD_STYLUS} --features positions
	@mv seawater.wasm seawater-positions.wasm
	@rm -f liblibseawater.rlib

${OUT_SEAWATER_SWAPS}: ${FILES_RUST}
	@${CARGO_BUILD_STYLUS} --features swaps
	@mv seawater.wasm seawater-swaps.wasm
	@rm -f liblibseawater.rlib

### SOLIDITY

${OUT_SEAWATER_AMM}: ${FILES_SOLIDITY}
	@${FORGE_BUILD}

${OUT_OWNERSHIP_NFTS}: ${FILES_SOLIDITY}
	@${FORGE_BUILD}

docker: Dockerfile ${FILES_RUST} ${FILES_SOLIDITY}
	@${DOCKER_BUILD} -t fluidity/${REPO} .
	@touch docker

clean:
	@rm -rf \
		${OUT_SEAWATER_ADMIN} \
		${OUT_SEAWATER_POSITIONS} \
		${OUT_SEAWATER_SWAPS} \
		cache \
		target \
		out \
		docker
