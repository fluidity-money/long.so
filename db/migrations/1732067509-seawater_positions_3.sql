-- migrate:up

-- seawater_positions_3 includes owner updates from Leo's positionvested2
-- to support use of the staking proxy contract.
CREATE VIEW seawater_positions_3 AS
	SELECT
		events_seawater_mintPosition.created_by AS created_by,
		events_seawater_mintPosition.block_hash AS block_hash,
		events_seawater_mintPosition.transaction_hash AS transaction_hash,
		events_seawater_mintPosition.block_number AS created_block_number,
		events_seawater_mintPosition.pos_id AS pos_id,
		COALESCE(vested2.owner, transfers.to_, events_seawater_mintPosition.owner) AS owner,
		pool,
		lower,
		upper,
        is_vested
	FROM events_seawater_mintPosition
	LEFT JOIN events_seawater_transferPosition AS transfers
		ON transfers.pos_id = events_seawater_mintPosition.pos_id
    LEFT JOIN seawater_positions_vested AS vested
        ON vested.position_id = events_seawater_mintPosition.pos_id
	LEFT JOIN events_leo_positionvested2 AS vested2
		ON vested2.position_id = events_seawater_mintPosition.pos_id
;

-- seawater_active_positions_4 includes owner updates from Leo's
-- positionvested2 to support use of the staking proxy contract.
CREATE VIEW seawater_active_positions_4 AS
SELECT
    seawater_active_positions_3.created_by,
    seawater_active_positions_3.block_hash,
    seawater_active_positions_3.transaction_hash,
    seawater_active_positions_3.created_block_number,
    seawater_active_positions_3.pos_id,
    COALESCE(vested2.owner, seawater_active_positions_3.owner) AS owner,
    seawater_active_positions_3.pool,
    seawater_active_positions_3.lower,
    seawater_active_positions_3.upper,
    COALESCE(seawater_positions_vested.is_vested, FALSE) AS is_vested
FROM
    seawater_active_positions_3
    LEFT JOIN seawater_positions_vested 
        ON seawater_active_positions_3.pos_id = seawater_positions_vested.position_id
	LEFT JOIN events_leo_positionvested2 AS vested2
		ON seawater_active_positions_3.pos_id = vested2.position_id
;

-- migrate:down
