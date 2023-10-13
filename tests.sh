#!/bin/sh -e

run_tests() {
	cd automation/nitro-testnode
	yes | ./test-node.bash --init --no-run
	docker compose -f docker-compose.yaml -f ../docker-compose.yml up
}

run_tests
