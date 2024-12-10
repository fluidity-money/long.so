-- migrate:up

-- seawater_positions_5 includes a DISTINCT clause to avoid duplication
-- when there are multiple transfer position events. Ordering is done by
-- favouring the most recent (i.e. created_by), as well as row id since
-- created_by uses CURRENT_TIMESTAMP which may be the same when events are
-- inserted simultaneously by the same action.
CREATE VIEW seawater_positions_5 AS
SELECT
    events_seawater_mintPosition.created_by AS created_by,
    events_seawater_mintPosition.block_hash AS block_hash,
    events_seawater_mintPosition.transaction_hash AS transaction_hash,
    events_seawater_mintPosition.block_number AS created_block_number,
    events_seawater_mintPosition.pos_id AS pos_id,
    COALESCE(vested.owner, transfers.to_, events_seawater_mintPosition.owner) AS owner,
    pool,
    lower,
    upper,
    COALESCE(is_vested, FALSE)
FROM
    events_seawater_mintPosition
    LEFT JOIN
    -- find the newest transfer event
    ( SELECT DISTINCT ON (pos_id)
            pos_id,
            to_
        FROM
            events_seawater_transferPosition
        ORDER BY
            pos_id DESC,
            created_by DESC,
            id DESC) AS transfers ON transfers.pos_id = events_seawater_mintPosition.pos_id
    -- vested are always distinct on pos_id
    LEFT JOIN seawater_positions_vested_2 AS vested ON vested.position_id = events_seawater_mintPosition.pos_id;

CREATE TABLE seawater_active_positions_6 (
	created_by TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	block_hash HASH NOT NULL,
	transaction_hash HASH NOT NULL,
	created_block_number INTEGER NOT NULL,
	pos_id HUGEINT NOT NULL,
	owner ADDRESS NOT NULL,
	pool ADDRESS NOT NULL,
	lower BIGINT NOT NULL,
	upper BIGINT NOT NULL,
    is_vested BOOLEAN NOT NULL
);

CREATE FUNCTION snapshot_seawater_active_positions_2()
RETURNS VOID LANGUAGE PLPGSQL
AS $$
BEGIN
	DELETE FROM seawater_active_positions_6;
	INSERT INTO seawater_active_positions_6
	SELECT *
	FROM seawater_positions_5
	WHERE pos_id NOT IN (
		SELECT pos_id FROM events_seawater_burnPosition
	);
END $$;

SELECT cron.unschedule('update seawater positions');
SELECT cron.schedule('update seawater positions 2', '*/1 * * * *', 'SELECT snapshot_seawater_active_positions_2();');

CREATE INDEX ON seawater_active_positions_6(pool, created_by DESC);
CREATE INDEX ON seawater_active_positions_6(owner, created_by DESC);

-- migrate:down
