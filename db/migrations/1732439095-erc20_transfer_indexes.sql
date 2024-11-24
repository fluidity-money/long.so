-- migrate:up

CREATE INDEX ON events_erc20_transfer (created_by);

CREATE INDEX ON events_erc20_transfer (sender);

CREATE INDEX ON events_erc20_transfer (recipient);

-- migrate:down
