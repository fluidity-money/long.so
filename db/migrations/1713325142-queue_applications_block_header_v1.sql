
-- migrate:up

CREATE VIEW queue_applications_block_header_1 AS
	SELECT
		data->>'hash' as hash,
		data->>'logsBloom' as bloom
	FROM
		arbitrum_block_headers
;

-- migrate:down
