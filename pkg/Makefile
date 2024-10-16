
include config.mk

.PHONY: \
	build \
	seawater \
	admin \
	positions \
	update-positions \
	adjust-positions \
	swaps \
	swap-permit2-a \
	swap-permit2-b \
	quotes \
	migrations \
	leo \
	solidity \
	amm-entrypoint \
	ownership-nfts \
	check \
	clean

all: build

build: solidity seawater leo check

admin: ${OUT_SEAWATER_ADMIN}
positions: ${OUT_SEAWATER_POSITIONS}
update-positions: ${OUT_SEAWATER_UPDATE_POSITIONS}
adjust-positions: ${OUT_SEAWATER_ADJUST_POSITIONS}
swap-permit2-a: ${OUT_SEAWATER_SWAP_PERMIT2_A}
swap-permit2-b: ${OUT_SEAWATER_SWAP_PERMIT2_B}
swaps: ${OUT_SEAWATER_SWAPS}
quotes: ${OUT_SEAWATER_QUOTES}
migrations: ${OUT_SEAWATER_MIGRATIONS}

leo: ${OUT_LEO}

seawater: \
	admin \
	positions \
	update-positions \
	swaps \
	swap-permit2-a \
	quotes \
	migrations \
	adjust-positions \
	swap-permit2-b

amm-entrypoint: ${OUT_SEAWATER_AMM}
ownership-nfts: ${OUT_OWNERSHIP_NFTS}

solidity: amm-entrypoint ownership-nfts

CARGO_BUILD_STYLUS := \
	cargo build \
		--target wasm32-unknown-unknown \
		--package

CARGO_BUILD_STYLUS_SEAWATER := \
	${CARGO_BUILD_STYLUS} seawater --profile

FORGE_BUILD := forge build
DOCKER_BUILD := docker build

STYLUS_RELEASE_CODESIZE_DIR := target/wasm32-unknown-unknown/release-codesize
STYLUS_RELEASE_COMPLETE_DIR := target/wasm32-unknown-unknown/release-complete

WASM_OPT_PASS := \
	wasm-opt --dce --rse --signature-pruning -Os

SEAWATER_CODESIZE_RELEASE := \
	${STYLUS_RELEASE_CODESIZE_DIR}/seawater.wasm
WASM_OPT_PASS_SEAWATER_CODESIZE := \
	${WASM_OPT_PASS} ${SEAWATER_CODESIZE_RELEASE} -o

SEAWATER_COMPLETE_RELEASE := \
	${STYLUS_RELEASE_COMPLETE_DIR}/seawater.wasm
WASM_OPT_PASS_SEAWATER_COMPLETE := \
	${WASM_OPT_PASS} ${SEAWATER_COMPLETE_RELEASE} -o

WASM_OPT_PASS_LEO := \
	${WASM_OPT_PASS} ${STYLUS_RELEASE_CODESIZE_DIR}/leo.wasm -o

### SEAWATER

${OUT_SEAWATER_ADMIN}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_ADMIN}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-complete --features admin
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_ADMIN}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_POSITIONS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_POSITIONS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-complete --features positions
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_POSITIONS}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_UPDATE_POSITIONS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_UPDATE_POSITIONS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-complete --features update_positions
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_UPDATE_POSITIONS}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_SWAPS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_SWAPS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features swaps
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_SWAPS}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_SWAP_PERMIT2_A}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_SWAP_PERMIT2}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features swap_permit2_a
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_SWAP_PERMIT2_A}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_QUOTES}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_QUOTES}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features quotes
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_QUOTES}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_MIGRATIONS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_MIGRATIONS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-complete --features migrations
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_MIGRATIONS}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_ADJUST_POSITIONS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_ADJUST_POSITIONS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-complete --features adjust_positions
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_ADJUST_POSITIONS}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_SWAP_PERMIT2_B}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_SWAP_PERMIT2_B}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features swap_permit2_b
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_SWAP_PERMIT2_B}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_LEO}: ${FILES_RUST}
	@rm -f ${OUT_LEO}
	@${CARGO_BUILD_STYLUS} leo --profile release-codesize
	@${WASM_OPT_PASS_LEO} leo.wasm

### STYLUS CHECK

CARGO_CHECK_STYLUS := cargo stylus check --no-verify

check: \
	check_seawater_admin \
	check_seawater_positions \
	check_seawater_update_positions \
	check_seawater_swaps \
	check_seawater_swap_permit2 \
	check_seawater_quotes \
	check_seawater_migrations \
	check_leo

check_seawater_admin: ${OUT_SEAWATER_ADMIN}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_SEAWATER_ADMIN}

check_seawater_positions: ${OUT_SEAWATER_POSITIONS}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_SEAWATER_POSITIONS}

check_seawater_update_positions: ${OUT_SEAWATER_UPDATE_POSITIONS}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_SEAWATER_UPDATE_POSITIONS}

check_seawater_swaps: ${OUT_SEAWATER_SWAPS}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_SEAWATER_SWAPS}

check_seawater_swap_permit2_a: ${OUT_SEAWATER_SWAP_PERMIT2}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_SEAWATER_SWAP_PERMIT2}

check_seawater_quotes: ${OUT_SEAWATER_QUOTES}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_SEAWATER_QUOTES}

check_seawater_migrations: ${OUT_SEAWATER_MIGRATIONS}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_SEAWATER_MIGRATIONS}

check_leo: ${OUT_LEO}
	@${CARGO_CHECK_STYLUS} --wasm-file=${OUT_LEO}

### SOLIDITY

${OUT_SEAWATER_AMM}: ${FILES_SOLIDITY} ${FILES_RUST}
	@${FORGE_BUILD}

${OUT_OWNERSHIP_NFTS}: ${FILES_SOLIDITY} ${FILES_RUST}
	@${FORGE_BUILD}

docker: Dockerfile ${FILES_RUST} ${FILES_SOLIDITY}
	@${DOCKER_BUILD} -t fluidity/${REPO} .
	@touch docker

clean:
	@rm -rf \
		${OUT_SEAWATER_ADMIN} \
		${OUT_SEAWATER_POSITIONS} \
		${OUT_SEAWATER_UPDATE_POSITIONS} \
		${OUT_SEAWATER_SWAPS} \
		${OUT_SEAWATER_SWAP_PERMIT2} \
		${OUT_SEAWATER_QUOTES} \
		${OUT_SEAWATER_MIGRATIONS} \
		cache \
		target \
		out \
		docker \
		docs-out
