-- migrate:up

CREATE MATERIALIZED VIEW seawater_positions_1 AS
	SELECT
		events_seawater_mintPosition.created_by AS created_by,
		events_seawater_mintPosition.block_hash AS block_hash,
		events_seawater_mintPosition.transaction_hash AS transaction_hash,
		events_seawater_mintPosition.block_number AS created_block_number,
		events_seawater_mintPosition.pos_id AS pos_id,
		COALESCE(transfers.to_, events_seawater_mintPosition.owner) AS owner,
		pool,
		lower,
		upper
	FROM events_seawater_mintPosition
	LEFT JOIN events_seawater_transferPosition AS transfers
		ON transfers.pos_id = events_seawater_mintPosition.pos_id
;

CREATE MATERIALIZED VIEW seawater_active_positions_1 AS
	SELECT *
	FROM seawater_positions_1
	WHERE pos_id NOT IN (
		SELECT pos_id FROM events_seawater_burnPosition
	)
;

CREATE UNIQUE INDEX ON seawater_active_positions_1 (pos_id);

CREATE OR REPLACE FUNCTION refresh_position_views()
RETURNS VOID LANGUAGE PLPGSQL
AS $$
BEGIN
	REFRESH MATERIALIZED VIEW seawater_positions_1;
	REFRESH MATERIALIZED VIEW CONCURRENTLY seawater_active_positions_1;
END $$;

SELECT cron.schedule('refresh-positions', '*/30 * * * *', $$SELECT refresh_position_views()$$);

-- migrate:down
