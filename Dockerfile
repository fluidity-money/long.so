
## build dependencies

# geth
FROM ethereum/client-go:v1.10.23 as build-geth

# prysm_beacon_chain
FROM gcr.io/prysmaticlabs/prysm/beacon-chain:stable as build-prysm-beacon-chain

# create_beacon_chain_genesis
FROM gcr.io/prysmaticlabs/prysm/cmd/prysmctl:latest as build-prsymctl

# prysm_validator
FROM gcr.io/prysmaticlabs/prysm/validator:stable as build-validator

# sequencer, poster, validator, staker-unsafe
FROM offchainlabs/stylus-node:v0.1.0-f47fec1-dev as build-stylus-nitro

## run the container that'll orchestrate everything, start to copy stuff over

FROM ubuntu:23.04

RUN apt-get update && apt-get install -y supervisor

# copying from geth

COPY --from=build-geth /usr/local/bin/geth /usr/local/bin

# copying from prysm beacon chain
COPY \
	--from=build-prysm-beacon-chain \
	/app/cmd/beacon-chain/beacon-chain \
	/usr/local/bin/beacon-chain

# copying from create_beacon_chain_genesis

COPY --from=build-prsymctl /app/cmd/prysmctl/prysmctl /usr/local/bin

# copying from sequencer

COPY --from=build-stylus-nitro /usr/local/bin/nitro /usr/local/bin

COPY automation/supervisord.conf /etc/supervisor/supervisord.conf

RUN mkdir -p /app/superposition /datadir

RUN echo passphrase >/datadir/passphrase

COPY automation/nitro/config/ /config/
COPY automation/nitro/l1keystore/ /keystore

RUN geth init --datadir /datadir/ /config/geth_genesis.json

ENTRYPOINT [ "/usr/bin/supervisord", "-nc", "/etc/supervisor/supervisord.conf" ]
