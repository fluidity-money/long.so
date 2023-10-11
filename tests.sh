#!/bin/sh -e

run_tests() {
	docker compose \
		-f automation/docker-compose.yml \
		-f automation/nitro-testnode-docker-compose.yml \
		up
}

run_tests
