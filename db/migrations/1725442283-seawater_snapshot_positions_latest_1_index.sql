-- migrate:up

CREATE UNIQUE INDEX ON snapshot_positions_latest_1(pos_id);

CREATE INDEX ON events_seawater_swap2(to_);
CREATE INDEX ON events_seawater_swap2(from_);

-- migrate:down
