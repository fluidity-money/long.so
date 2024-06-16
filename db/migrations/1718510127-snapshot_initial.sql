-- migrate:up

CREATE TABLE snapshot_positions_log_1 (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP WITHOUT TIME ZONE NOT NULL,

	-- Taken from a left join.
	pos_id HUGEINT NOT NULL,
	owner ADDRESS NOT NULL,
	pool ADDRESS NOT NULL,
	lower BIGINT NOT NULL,
	upper BIGINT NOT NULL,

	-- Inserted from the lookup.
	amount0 HUGEINT NOT NULL,
	amount1 HUGEINT NOT NULL
);

CREATE FUNCTION snapshot_create_positions_1(ids HUGEINT[], amount0s HUGEINT[], amount1s HUGEINT[])
RETURNS VOID LANGUAGE PLPGSQL
AS $$
DECLARE affected_rows INT;
BEGIN
	FOR i IN 1..array_length(ids, 1) LOOP
		INSERT INTO snapshot_positions_log_1 (
			created_by,
			pos_id,
			owner,
			pool,
			lower,
			upper,
			amount0,
			amount1
		)
		SELECT
			CURRENT_TIMESTAMP,
			sw.pos_id,
			sw.owner,
			sw.pool,
			sw.lower,
			sw.upper,
			amount0s[i],
			amount1s[i]
		FROM
			events_seawater_mintPosition sw
		WHERE
			sw.pos_id = ids[i];
	END LOOP;
END $$;

-- migrate:down
