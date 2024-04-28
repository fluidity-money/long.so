-- migrate:up

-- Price is always denominated in the form of the price of the current asset denominated
-- against fUSDC, which is always assumed to be 1 (ie, currently the price of Ethereum is
-- 3,143.52, so the price is 3,143.52.)

-- The following tables are used to record checkpoints of price data for quick access with
-- other functions.

CREATE TABLE checkpoint_seawater_hourly_price_data (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	hour TIMESTAMP NOT NULL,
	pool ADDRESS NOT NULL,
	price DECIMAL NOT NULL
);

CREATE TABLE checkpoint_seawater_hourly_volume (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	hour TIMESTAMP NOT NULL,
	pool ADDRESS NOT NULL,
	fusdc_volume HUGEINT NOT NULL,
	tokena_volume HUGEINT NOT NULL,
	price DECIMAL NOT NULL,
	tokena_volume_price DECIMAL NOT NULL
);

CREATE TABLE checkpoint_seawater_hourly_fees (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	hour TIMESTAMP NOT NULL,
	pool ADDRESS NOT NULL,
	fusdc_fees HUGEINT NOT NULL,
	tokena_fees HUGEINT NOT NULL,
	tokena_fees_price DECIMAL NOT NULL
);

CREATE TABLE seawater_pool_swap_price_1_return (
	pool ADDRESS NOT NULL,
	price DOUBLE PRECISION NOT NULL
);

CREATE FUNCTION seawater_pool_swap1_average_price_1(since TIMESTAMP)
RETURNS SETOF seawater_pool_swap_price_1_return
LANGUAGE SQL
STABLE AS
$$
	SELECT
		pool,
		1.0001 ^ (AVG(final_tick)) * 1000000 / (10 ^ events_seawater_newPool.decimals) as price
	FROM events_seawater_swap1
	LEFT JOIN events_seawater_newPool ON token = pool
	WHERE events_seawater_swap1.created_by > since
	GROUP BY pool, events_seawater_newpool.decimals;
$$;

CREATE FUNCTION seawater_pool_swap2_average_price_1(since TIMESTAMP)
RETURNS SETOF seawater_pool_swap_price_1_return
LANGUAGE SQL
STABLE
AS
$$
	SELECT
		pool,
		1.0001 ^ (AVG(final_tick)) * 1000000 / (10 ^ events_seawater_newPool.decimals) as price
	FROM (
		SELECT
			from_ AS pool,
			final_tick0 AS final_tick
		FROM
			events_seawater_swap2
		WHERE created_by > since
		UNION ALL
		SELECT
			to_ AS pool,
			final_tick1 AS final_tick
		FROM
			events_seawater_swap2
		WHERE created_by > since
	) AS combined
	LEFT JOIN events_seawater_newPool ON token = pool
	GROUP BY pool, events_seawater_newpool.decimals;
$$;

CREATE TABLE seawater_pool_swap_volume_1_return (
	pool ADDRESS NOT NULL,
	fusdc_volume HUGEINT NOT NULL,
	tokena_volume HUGEINT NOT NULL
);

CREATE FUNCTION seawater_pool_swap1_volume_1(since TIMESTAMP)
RETURNS SETOF seawater_pool_swap_volume_1_return
LANGUAGE SQL
STABLE
AS
$$
	SELECT
		pool,
		CAST(SUM(amount0) AS HUGEINT) AS tokena_volume,
		CAST(SUM(amount1) AS HUGEINT) AS fusdc_volume
	FROM events_seawater_swap1
	WHERE created_by > since
	GROUP BY pool;
$$;

CREATE FUNCTION seawater_pool_swap2_volume_1(since TIMESTAMP)
RETURNS SETOF seawater_pool_swap_volume_1_return
LANGUAGE SQL
STABLE
AS
$$
	SELECT
		pool,
		CAST(SUM(total_fluid_volume) AS HUGEINT) AS fusdc_volume,
		CAST(SUM(tokena_volume) AS HUGEINT) AS tokena_volume
	FROM (
		SELECT
			from_ AS pool,
			amount_in AS tokena_volume,
			fluid_volume AS total_fluid_volume
		FROM
			events_seawater_swap2
		WHERE created_by > since
		UNION ALL
		SELECT
			to_ AS pool,
			amount_out AS tokena_volume,
			fluid_volume AS total_fluid_volume
		FROM
			events_seawater_swap2
		WHERE created_by > since
	) AS combined
	GROUP BY pool;
$$;

-- migrate:down
