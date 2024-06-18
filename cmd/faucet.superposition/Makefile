
include ../golang.mk

.PHONY: lambda

lambda: bootstrap.zip

stakers.json: ../../config/stakers.json
	@cp ../../config/stakers.json stakers.json

bootstrap: faucet.superposition
	@cp faucet.superposition bootstrap

bootstrap.zip: bootstrap
	@zip bootstrap.zip bootstrap
