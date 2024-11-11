
include ../golang.mk

.PHONY: lambda

CLEAN_FILES := bootstrap bootstrap.zip

lambda: bootstrap.zip

bootstrap: faucet.superposition
	@cp faucet.superposition bootstrap

bootstrap.zip: bootstrap
	@zip bootstrap.zip bootstrap
