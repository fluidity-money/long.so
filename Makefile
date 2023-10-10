
PHONY: docker

CONTRACT_PKG := pkg/target/release/build

all: docker

contract: ${CONTRACT_PKG}

docker:
	@docker build -t superposition/app.superposition.so .

CONTRACT_PKG: $(shell find pkg -type f -name '*.rs' -or -name '*.toml')
	@cd pkg && \
		cargo +nightly build \
			-Z build-std=std,panic_abort \
			-Z build-std-features=panic_immediate_abort \
			--release \
			--target wasm32-unknown-unknown \
			--package seawater \
			--features admin
