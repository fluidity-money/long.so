-- migrate:up

CREATE INDEX ON seawater_active_positions_2(pool, created_by DESC);

CREATE INDEX ON seawater_active_positions_2(owner, created_by DESC);

-- migrate:down
