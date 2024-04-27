
FROM timescale/timescaledb:2.8.0-pg12

WORKDIR /usr/local/src/superposition/database

RUN apk add make curl

RUN curl -fsSLo \
	/usr/local/bin/dbmate \
	https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64

RUN chmod +x /usr/local/bin/dbmate

COPY migrations/ .

COPY init-database.sh /docker-entrypoint-initdb.d/init-sqls.sh
