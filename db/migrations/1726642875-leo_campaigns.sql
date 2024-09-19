-- migrate:up
-- All campaigns, with relevant fields taken from their most recent CampaignUpdated/CampaignBalanceUpdated event
CREATE VIEW leo_campaigns_1 AS
SELECT
    events_leo_campaigncreated.pool,
    events_leo_campaigncreated.token,
    COALESCE(updated.tick_lower, events_leo_campaigncreated.tick_lower) AS tick_lower,
    COALESCE(updated.tick_upper, events_leo_campaigncreated.tick_upper) AS tick_upper,
    events_leo_campaigncreated.owner,
    COALESCE(updated.starting, events_leo_campaigncreated.starting) AS starting,
    COALESCE(updated.ending, events_leo_campaigncreated.ending) AS ending,
    events_leo_campaigncreated.identifier,
    COALESCE(new_maximum, 0) AS maximum_amount,
    COALESCE(updated.per_second, events_leo_campaigncreated.per_second) AS per_second
FROM
    events_leo_campaigncreated
    LEFT JOIN ( SELECT DISTINCT ON (identifier)
            identifier,
            new_maximum
        FROM
            events_leo_campaignbalanceupdated
        ORDER BY
            identifier,
            created_by DESC) balanceupdated ON events_leo_campaigncreated.identifier = balanceupdated.identifier
    LEFT JOIN ( SELECT DISTINCT ON (identifier)
            identifier,
            tick_lower,
            tick_upper,
            starting,
            ending,
            per_second
        FROM
            events_leo_campaignupdated
        ORDER BY
            identifier,
            created_by DESC) updated ON events_leo_campaigncreated.identifier = updated.identifier;

-- Active campaigns are those that have started and haven't finished
CREATE VIEW leo_active_campaigns_1 AS
SELECT
    *
FROM
    leo_campaigns_1
WHERE
    starting <= now()
    AND ending >= now();

-- Upcoming campaigns are those that haven't started
CREATE VIEW leo_upcoming_campaigns_1 AS
SELECT
    *
FROM
    leo_campaigns_1
WHERE
    starting > now();

-- migrate:down
