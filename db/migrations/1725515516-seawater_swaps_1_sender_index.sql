-- migrate:up

CREATE INDEX ON events_seawater_swap1(pool);

CREATE INDEX ON events_seawater_swap2(from_);

CREATE INDEX ON events_seawater_swap2(to_);

-- migrate:down
