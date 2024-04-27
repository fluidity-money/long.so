#!/bin/sh

docker build -t superposition/database .

docker run \
	-e POSTGRES_USER=${POSTGRES_USER:-superposition} \
	-e POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-superposition} \
	-p 5432:5432 \
	-t superposition/database \
	-c log_statement=all
