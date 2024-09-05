-- migrate:up

CREATE INDEX ON events_seawater_updatepositionliquidity (block_number);

-- migrate:down
