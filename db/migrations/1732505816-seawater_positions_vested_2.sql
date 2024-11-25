-- migrate:up

-- seawater_positions_vested to determine whether positions are vested 
-- in Leo by looking at their most recent vest/divest event
-- seawater_positions_vested_2 updates to use positionvested2 and positiondivested2
CREATE VIEW seawater_positions_vested_2 AS SELECT DISTINCT ON (position_id)
    is_vested,
    position_id,
    owner,
    created_by
FROM (
    SELECT
        TRUE AS is_vested,
        position_id,
        created_by,
        owner
    FROM
        events_leo_positionvested2
    UNION
    SELECT
        FALSE AS is_vested,
        position_id,
        created_by,
        recipient AS owner
    FROM
        events_leo_positiondivested2
    ORDER BY
        created_by DESC) a;

-- seawater_positions_4 includes owner updates from Leo's positionvested2
-- and positiondivested2 to support use of the staking proxy contract.
CREATE VIEW seawater_positions_4 AS
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
        is_vested
	FROM events_seawater_mintPosition
	LEFT JOIN events_seawater_transferPosition AS transfers
		ON transfers.pos_id = events_seawater_mintPosition.pos_id
    LEFT JOIN seawater_positions_vested_2 AS vested
        ON vested.position_id = events_seawater_mintPosition.pos_id
;

-- seawater_active_positions_5 includes owner updates from Leo's positionvested2
-- and positiondivested2 to support use of the staking proxy contract.
CREATE VIEW seawater_active_positions_5 AS
SELECT
    seawater_active_positions_4.created_by,
    seawater_active_positions_4.block_hash,
    seawater_active_positions_4.transaction_hash,
    seawater_active_positions_4.created_block_number,
    seawater_active_positions_4.pos_id,
    COALESCE(vested.owner, seawater_active_positions_4.owner) AS owner,
    seawater_active_positions_4.pool,
    seawater_active_positions_4.lower,
    seawater_active_positions_4.upper,
    COALESCE(vested.is_vested, FALSE) AS is_vested
FROM
    seawater_active_positions_4
    LEFT JOIN seawater_positions_vested_2 AS vested
        ON vested.position_id = seawater_active_positions_4.pos_id
;

-- migrate:down
