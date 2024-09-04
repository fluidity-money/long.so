-- migrate:up

CREATE UNIQUE INDEX ON snapshot_positions_latest_1(pos_id);

-- migrate:down
