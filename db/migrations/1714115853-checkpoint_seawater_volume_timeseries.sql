-- migrate:up

-- Price is always denominated in the form of the price of the current asset denominated
-- against fUSDC, which is always assumed to be 1 (ie, currently the price of Ethereum is
-- 3,143.52, so the price is 3,143.52.)

--REFRESH MATERIALIZED VIEW CONCURRENTLY seawater_swap1_average_price_last_hour_1;

-- Used to store each hourly swap output here, scheduled by a cron.

CREATE TABLE checkpoint_seawater_swaps_average_price_hourly_1 (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	pool ADDRESS NOT NULL,
	hourly_interval TIMESTAMP NOT NULL, -- the timestamp of the hour
	price DECIMAL NOT NULL,
	decimals INTEGER NOT NULL
);

CREATE VIEW seawater_pool_swap1_price_hourly_1 AS
	SELECT
		pool,
		date_trunc('hour', events_seawater_swap1.created_by) AS hourly_interval,
		1.0001 ^ (AVG(final_tick)) * 1000000 / (10 ^ events_seawater_newPool.decimals) as price,
		events_seawater_newpool.decimals as decimals
	FROM events_seawater_swap1
	LEFT JOIN events_seawater_newPool ON token = pool
	GROUP BY pool, hourly_interval, events_seawater_newpool.decimals;

CREATE VIEW seawater_pool_swap2_price_hourly_1 AS
	SELECT
		pool,
		date_trunc('hour', combined.created_by) AS hourly_interval,
		1.0001 ^ (AVG(final_tick)) * 1000000 / (10 ^ events_seawater_newPool.decimals) as price,
		events_seawater_newpool.decimals as decimals
	FROM (
		SELECT
			from_ AS pool,
			final_tick0 AS final_tick,
			created_by
		FROM
			events_seawater_swap2
		UNION ALL
		SELECT
			to_ AS pool,
			final_tick1 AS final_tick,
			created_by
		FROM
			events_seawater_swap2
	) AS combined
	LEFT JOIN events_seawater_newPool ON token = pool
	GROUP BY pool, hourly_interval, events_seawater_newpool.decimals;

-- Insert into the checkpoints table the average price of the last hour.

CREATE FUNCTION do_checkpoint_pool_price_hourly_1()
RETURNS void
LANGUAGE SQL
STABLE
AS
$$
	INSERT INTO checkpoint_seawater_swaps_average_price_hourly_1 (
		pool,
		hourly_interval,
		price, decimals
	)
	SELECT pool, hourly_interval, SUM(price) AS price, decimals
	FROM (
		SELECT pool, hourly_interval, price, decimals
		FROM seawater_pool_swap1_price_hourly_1
		UNION ALL
		SELECT pool, hourly_interval, price, decimals
		FROM seawater_pool_swap2_price_hourly_1
	) AS combined
	GROUP BY pool, hourly_interval, decimals;
$$;

CREATE VIEW seawater_pool_swap1_volume_hourly_1 AS
	SELECT
		events_seawater_swap1.pool AS pool,
		date_trunc('hour', events_seawater_swap1.created_by) AS hourly_interval,
		CAST(SUM(amount0) AS HUGEINT) AS fusdc_volume,
		CAST(SUM(amount1) AS HUGEINT) AS tokena_volume
	FROM events_seawater_swap1
	GROUP BY
		events_seawater_swap1.pool,
		hourly_interval,
		events_seawater_swap1.created_by;

CREATE VIEW seawater_pool_swap2_volume_hourly_1 AS
	SELECT
		combined.pool as pool,
		date_trunc('hour', combined.created_by) AS hourly_interval,
		CAST(SUM(total_fluid_volume) AS HUGEINT) AS fusdc_volume,
		CAST(SUM(tokena_volume) AS HUGEINT) AS tokena_volume
	FROM (
		SELECT
			from_ AS pool,
			amount_in AS tokena_volume,
			fluid_volume AS total_fluid_volume,
			created_by
		FROM
			events_seawater_swap2
		UNION ALL
		SELECT
			to_ AS pool,
			amount_out AS tokena_volume,
			fluid_volume AS total_fluid_volume,
			created_by
		FROM
			events_seawater_swap2
	) AS combined
	GROUP BY combined.pool, hourly_interval;

CREATE VIEW seawater_pool_swap_volume_hourly_1 AS
	SELECT
		pool,
		combined.hourly_interval AS hourly_interval,
		new_pool.decimals,
		CAST(SUM(fusdc_volume) AS HUGEINT) AS fusdc_volume_unscaled,
		SUM(fusdc_volume) AS fusdc_volume_scaled,
		SUM(tokena_volume) AS tokena_volume_unscaled,
		SUM(tokena_volume) / (10 ^ new_pool.decimals) AS tokena_volume_scaled,
		SUM(tokena_volume) / (10 ^ new_pool.decimals) * checkpoint.price
	FROM (
		SELECT pool, hourly_interval, fusdc_volume, tokena_volume
		FROM seawater_pool_swap2_volume_hourly_1
		UNION ALL
		SELECT pool, hourly_interval, fusdc_volume, tokena_volume
		FROM seawater_pool_swap1_volume_hourly_1
	) AS combined
	LEFT JOIN
		events_seawater_newPool AS new_pool
		ON new_pool.token = combined.pool
	LEFT JOIN
		checkpoint_seawater_swaps_average_price_hourly_1 AS checkpoint
		ON combined.hourly_interval = checkpoint.price
	GROUP BY
		pool,
		combined.hourly_interval,
		new_pool.decimals
	ORDER BY hourly_interval;

-- migrate:down
