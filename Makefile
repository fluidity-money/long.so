
.PHONY: contract docker

all: contract

contract:
	@cd pkg && make

docker:
	@docker build \
		-t superposition/app.superposition.so-testing \
		-f Dockerfile.contracts \
		.
