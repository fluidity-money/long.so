-- migrate:up

CREATE TABLE events_leo_positiondivested2 (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	block_hash HASH NOT NULL,
	transaction_hash HASH NOT NULL,
	block_number INTEGER NOT NULL,
	emitter_addr ADDRESS NOT NULL,

	position_id HUGEINT NOT NULL,
	recipient ADDRESS NOT NULL
);

CREATE INDEX ON events_leo_positiondivested2 (position_id);
CREATE INDEX ON events_leo_positiondivested2 (recipient);

-- migrate:down
