
.PHONY: build contract docker

all: build

build: contract

contract:
	@cd pkg && make

docker:
	@docker build -t superposition/cmd -f Dockerfile.cmd .
