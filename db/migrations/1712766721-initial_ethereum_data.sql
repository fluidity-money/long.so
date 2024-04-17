
-- migrate:up

CREATE TABLE arbitrum_block_headers (
	id SERIAL PRIMARY KEY,
	inserted_by TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data JSONB NOT NULL
);

-- migrate:down
