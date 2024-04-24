
FROM golang:alpine3.19 AS build-1

RUN apk add --no-cache \
	openssl \
	ca-certificates \
	make \
	bash \
	curl \
	gcc \
	musl-dev

ENV SUPERPOSITION_DIR /usr/local/src/superposition

WORKDIR ${SUPERPOSITION_DIR}

COPY go.mod .
COPY go.sum .

COPY lib lib/
COPY cmd cmd/

ENV INSTALL_DIR /bin

RUN sh -c 'cd cmd/ingestor.logs.ethereum && make install'

RUN sh -c 'cd cmd/graphql.ethereum && make install'

FROM alpine:3.19

WORKDIR /bin

COPY --from=build-1 /bin/ingestor.logs.ethereum .
COPY --from=build-1 /bin/graphql.ethereum .