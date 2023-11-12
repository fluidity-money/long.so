
.PHONY: build contract docker

all: build

build: contract

contract:
	@cd pkg && make
