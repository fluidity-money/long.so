-- migrate:up

CREATE TABLE faucet_requests (
	id SERIAL PRIMARY KEY,
	addr ADDRESS NOT NULL,
	ip_addr VARCHAR NOT NULL,
	created_by TIMESTAMP NOT NULL,
	updated_by TIMESTAMP NOT NULL
);

-- migrate:down
