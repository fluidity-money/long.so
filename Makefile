
.PHONY: contract docker

CONTRACT_PKG := pkg/target/wasm32-unknown-unknown/release/seawater.wasm

all: contract

contract: ${CONTRACT_PKG}

docker:
	@docker build -t superposition/app.superposition.so-testing .

${CONTRACT_PKG}: $(shell find pkg -path 'pkg/target' -prune -or -type f -name '*.rs' -print -or -name '*.toml' -print)
	@cd pkg && \
		cargo +nightly build \
			-Z build-std=std,panic_abort \
			-Z build-std-features=panic_immediate_abort \
			--release \
			--target wasm32-unknown-unknown \
			--package seawater \
			--features admin
