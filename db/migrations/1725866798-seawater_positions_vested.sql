-- migrate:up

-- seawater_positions_vested to determine whether positions are vested 
-- in Leo by looking at their most recent vest/divest event
CREATE VIEW seawater_positions_vested AS SELECT DISTINCT ON (position_id)
    is_vested,
    position_id,
    created_by
FROM (
    SELECT
        TRUE AS is_vested,
        position_id,
        created_by
    FROM
        events_leo_positionvested
    UNION
    SELECT
        FALSE AS is_vested,
        position_id,
        created_by
    FROM
        events_leo_positiondivested
    ORDER BY
        created_by DESC) a;

CREATE VIEW seawater_positions_2 AS
	SELECT
		events_seawater_mintPosition.created_by AS created_by,
		events_seawater_mintPosition.block_hash AS block_hash,
		events_seawater_mintPosition.transaction_hash AS transaction_hash,
		events_seawater_mintPosition.block_number AS created_block_number,
		events_seawater_mintPosition.pos_id AS pos_id,
		COALESCE(transfers.to_, events_seawater_mintPosition.owner) AS owner,
		pool,
		lower,
		upper,
        is_vested
	FROM events_seawater_mintPosition
	LEFT JOIN events_seawater_transferPosition AS transfers
		ON transfers.pos_id = events_seawater_mintPosition.pos_id
    LEFT JOIN seawater_positions_vested AS vested
        ON vested.position_id = events_seawater_mintPosition.pos_id
;

CREATE VIEW seawater_active_positions_3 AS
SELECT
    seawater_active_positions_2.*,
    COALESCE(is_vested, FALSE) AS is_vested
FROM
    seawater_active_positions_2
    LEFT JOIN seawater_positions_vested ON seawater_active_positions_2.pos_id = seawater_positions_vested.position_id
;

-- migrate:down
