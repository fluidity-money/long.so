-- migrate:up

-- Refer to graphql.ethereum/schema.graphqls for more.

CREATE TABLE notes_1 (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	content VARCHAR NOT NULL,
	placement VARCHAR NOT NULL,
	from_ TIMESTAMP NOT NULL,
	to_ TIMESTAMP NOT NULL,
	target ADDRESS
);

CREATE VIEW notes_current_1 AS
	SELECT * from notes_1 WHERE
		from_ < CURRENT_TIMESTAMP AND
		to_ > CURRENT_TIMESTAMP;

-- migrate:down
