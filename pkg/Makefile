
include config.mk

.PHONY: \
	build \
	seawater \
	admin \
	positions \
	update-positions \
	adjust-positions-a \
	adjust-positions-b \
	swaps-a \
	swaps-b \
	swap-permit2-a \
	swap-permit2-b \
	quotes-a \
	migrations \
	quotes-b \
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
adjust-positions-a: ${OUT_SEAWATER_ADJUST_POSITIONS_A}
adjust-positions-b: ${OUT_SEAWATER_ADJUST_POSITIONS_B}
swap-permit2-a: ${OUT_SEAWATER_SWAP_PERMIT2_A}
swap-permit2-b: ${OUT_SEAWATER_SWAP_PERMIT2_B}
swaps-a: ${OUT_SEAWATER_SWAPS_A}
swaps-b: ${OUT_SEAWATER_SWAPS_B}
quotes-a: ${OUT_SEAWATER_QUOTES_A}
quotes-b: ${OUT_SEAWATER_QUOTES_B}
migrations: ${OUT_SEAWATER_MIGRATIONS}

leo: leo-collect leo-extras
leo-collect: ${OUT_LEO_COLLECT}
leo-extras: ${OUT_LEO_EXTRAS}

seawater: \
	admin \
	positions \
	update-positions \
	swaps-a \
	swap-permit2-a \
	quotes-a \
	migrations \
	adjust-positions-a \
	swap-permit2-b \
	adjust-positions-b \
	quotes-b \
	swaps-b

amm-entrypoint: ${OUT_SEAWATER_AMM}
ownership-nfts: ${OUT_OWNERSHIP_NFTS}

solidity: amm-entrypoint ownership-nfts

CARGO_BUILD_STYLUS := \
	cargo build \
		--target wasm32-unknown-unknown \
		--package

CARGO_BUILD_STYLUS_SEAWATER := \
	${CARGO_BUILD_STYLUS} seawater --profile

CARGO_BUILD_STYLUS_LEO := \
	${CARGO_BUILD_STYLUS} leo --profile

FORGE_BUILD := forge build
DOCKER_BUILD := docker build

STYLUS_RELEASE_CODESIZE_DIR := target/wasm32-unknown-unknown/release-codesize
STYLUS_RELEASE_COMPLETE_DIR := target/wasm32-unknown-unknown/release-codesize

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
	${WASM_OPT_PASS} ${STYLUS_RELEASE_COMPLETE_DIR}/leo.wasm -o

### SEAWATER

${OUT_SEAWATER_ADMIN}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_ADMIN}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features admin
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_ADMIN}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_POSITIONS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_POSITIONS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features positions
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_POSITIONS}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_UPDATE_POSITIONS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_UPDATE_POSITIONS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features update_positions
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_UPDATE_POSITIONS}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_SWAPS_A}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_SWAPS_A}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features swaps_a
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_SWAPS_A}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_SWAP_PERMIT2_A}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_SWAP_PERMIT2}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features swap_permit2_a
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_SWAP_PERMIT2_A}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_QUOTES_A}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_QUOTES_A}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features quotes_a
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_QUOTES_A}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_QUOTES_B}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_QUOTES_B}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features quotes_b
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_QUOTES_B}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_MIGRATIONS}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_MIGRATIONS}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features migrations
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_MIGRATIONS}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_ADJUST_POSITIONS_A}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_ADJUST_POSITIONS_A}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features adjust_positions_a
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_ADJUST_POSITIONS_A}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_ADJUST_POSITIONS_B}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_ADJUST_POSITIONS_B}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features adjust_positions_b
	@${WASM_OPT_PASS_SEAWATER_COMPLETE} ${OUT_SEAWATER_ADJUST_POSITIONS_B}
	@rm -f ${SEAWATER_COMPLETE_RELEASE}

${OUT_SEAWATER_SWAP_PERMIT2_B}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_SWAP_PERMIT2_B}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features swap_permit2_b
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_SWAP_PERMIT2_B}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_SEAWATER_SWAPS_B}: ${FILES_RUST}
	@rm -f ${OUT_SEAWATER_SWAPS_B}
	@${CARGO_BUILD_STYLUS_SEAWATER} release-codesize --features swaps_b
	@${WASM_OPT_PASS_SEAWATER_CODESIZE} ${OUT_SEAWATER_SWAPS_B}
	@rm -f ${SEAWATER_CODESIZE_RELEASE}

${OUT_LEO_COLLECT}: ${FILES_RUST}
	@rm -f ${OUT_LEO_COLLECT}
	@${CARGO_BUILD_STYLUS_LEO} release-codesize --features contract-collect
	@${WASM_OPT_PASS_LEO} leo-collect.wasm

${OUT_LEO_EXTRAS}: ${FILES_RUST}
	@rm -f ${OUT_LEO_EXTRAS}
	${CARGO_BUILD_STYLUS_LEO} release-codesize --features contract-extras
	@${CARGO_BUILD_STYLUS_LEO} release-codesize --features contract-extras
	@${WASM_OPT_PASS_LEO} leo-extras.wasm

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
		${OUT_SEAWATER_SWAPS_A} \
		${OUT_SEAWATER_SWAPS_B} \
		${OUT_SEAWATER_SWAP_PERMIT2_A} \
		${OUT_SEAWATER_SWAP_PERMIT2_B} \
		${OUT_SEAWATER_QUOTES} \
		${OUT_SEAWATER_MIGRATIONS} \
		${OUT_SEAWATER_ADJUST_POSITIONS} \
		${OUT_LEO_COLLECT} \
		${OUT_LEO_EXTRAS} \
		cache \
		target \
		out \
		docker \
		docs-out
