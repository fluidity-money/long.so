-- migrate:up

-- Replaced during upsertion.
CREATE TABLE snapshot_positions_updated_1 (
	id SERIAL PRIMARY KEY,
	updated_by TIMESTAMP WITHOUT TIME ZONE NOT NULL,

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

-- Only inserted into for historical data collection.
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
		UPDATE snapshot_positions_updated_1
		SET
			updated_by = CURRENT_TIMESTAMP,
			owner = sw.owner,
			pool = sw.pool,
			lower = sw.lower,
			upper = sw.upper,
			amount0 = amount0s[i],
			amount1 = amount1s[i]
		FROM
			events_seawater_mintPosition sw
		WHERE
			snapshot_positions_updated_1.pos_id = ids[i]
			AND sw.pos_id = ids[i];

		GET DIAGNOSTICS affected_rows = ROW_COUNT;

		-- If no rows were updated, perform an insert
		IF affected_rows = 0 THEN
			INSERT INTO snapshot_positions_updated_1 (
				updated_by,
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
		END IF;

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
