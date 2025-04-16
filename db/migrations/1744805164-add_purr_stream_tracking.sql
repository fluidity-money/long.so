-- migrate:up

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_type WHERE typname = 'bytes8_0x'
	) THEN
		CREATE DOMAIN BYTES8_0x AS CHAR(18);
	END IF;
END $$;

CREATE TABLE events_purrstream_donated(
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	block_hash HASH NOT NULL,
	transaction_hash HASH NOT NULL,
	block_number INTEGER NOT NULL,
	emitter_addr ADDRESS NOT NULL,

	cat BYTES8_0x NOT NULL,
	address ADDRESS NOT NULL,
	amount HUGEINT NOT NULL
);

CREATE INDEX ON events_purrstream_donated (cat);

-- migrate:down
