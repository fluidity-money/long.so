-- migrate:up
CREATE VIEW seawater_pool_fees_total_1 AS
SELECT 
    cf.pool,
    SUM(cf.amount0 * sp.price / (10 ^ sp.decimals)) AS amount0,
    SUM(cf.amount1 / 1e6) AS amount1, -- Assuming fUSDC is always 1 USD with 6 decimals
    SUM((cf.amount0 * sp.price / (10 ^ sp.decimals)) + (cf.amount1 / 1e6)) AS total
FROM 
    events_seawater_collectfees cf
JOIN 
    seawater_swaps_average_price_hourly_2 sp
ON 
    cf.pool = sp.pool
AND 
    DATE_TRUNC('hour', cf.created_by) = sp.hourly_interval
WHERE 
    cf.amount0 > 0 OR cf.amount1 > 0
GROUP BY 
    cf.pool;
-- migrate:down
