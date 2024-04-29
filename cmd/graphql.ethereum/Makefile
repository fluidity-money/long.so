
include ../golang.mk

.PHONY: lambda

lambda: bootstrap.zip

bootstrap: graphql.ethereum
	@cp graphql.ethereum bootstrap

bootstrap.zip: bootstrap
	@zip bootstrap.zip bootstrap
