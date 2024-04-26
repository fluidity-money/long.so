-- migrate:up

-- Price is always denominated in the form of the price of the current asset denominated
-- against fUSDC, which is always assumed to be 1 (ie, currently the price of Ethereum is
-- 3,143.52, so the price is 3,143.52.)

-- The following tables are used to record checkpoints of price data for quick access with
-- other functions.

CREATE TABLE data_seawater_hourly_price_data (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	hour TIMESTAMP NOT NULL,
	pool ADDRESS NOT NULL,
	price DECIMAL NOT NULL
);

CREATE TABLE data_seawater_hourly_volume (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	hour TIMESTAMP NOT NULL,
	pool ADDRESS NOT NULL,
	fusdc_volume HUGEINT NOT NULL,
	tokena_volume HUGEINT NOT NULL,
	price DECIMAL NOT NULL,
	tokena_volume_price DECIMAL NOT NULL
);

CREATE TABLE data_seawater_hourly_fees (
	id SERIAL PRIMARY KEY,
	created_by TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	hour TIMESTAMP NOT NULL,
	pool ADDRESS NOT NULL,
	fusdc_fees HUGEINT NOT NULL,
	tokena_fees HUGEINT NOT NULL,
	tokena_fees_price DECIMAL NOT NULL
);

CREATE TABLE seawater_pool_swap_volume_1_return (
	pool ADDRESS,
	fusdc_volume HUGEINT,
	tokena_volume HUGEINT
);

CREATE FUNCTION seawater_pool_swap1_volume_1(since TIMESTAMP)
RETURNS SETOF seawater_pool_swap_volume_1_return
LANGUAGE SQL
STABLE
AS
$$
	SELECT
		pool,
		SUM(amount0) AS fusdc_volume,
		SUM(amount1) AS tokena_volume
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
		SUM(total_fluid_volume) AS fusdc_volume,
		SUM(tokena_volume) AS tokena_volume
	FROM (
		SELECT
			from_ AS pool,
			amount_in AS tokena_volume,
			0 AS total_fluid_volume
		FROM
			events_seawater_swap2
		WHERE created_by > since
		UNION ALL
		SELECT
			to_ AS pool,
			0 AS tokena_volume,
			fluid_volume AS total_fluid_volume
		FROM
			events_seawater_swap2
		WHERE created_by > since
	) AS combined
	GROUP BY pool;
$$;

-- migrate:down
