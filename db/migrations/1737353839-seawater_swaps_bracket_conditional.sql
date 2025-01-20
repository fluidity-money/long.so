-- migrate:up

-- Hotfix to seawater_swaps_pool_5, which had incorrect boolean precedance for filtering.
-- Exactly like seawater_swaps_user_3, with the addition of `filter`.
-- If unset (i.e. NULL), select all swaps (swap1 and swap2).
-- If set
    -- If fUSDC, select swap1s between pool and fUSDC.
    -- If not fUSDC, select swap2s between pool and filter.

CREATE FUNCTION seawater_swaps_pool_6(
    fusdcAddress ADDRESS,
    fusdcDecimals HUGEINT,
    pool_ ADDRESS,
    after TIMESTAMP,
    limit_ INTEGER,
    filter ADDRESS DEFAULT NULL
)
RETURNS SETOF seawater_swaps_3_return
LANGUAGE SQL
STABLE
AS
$$
WITH all_swaps AS (
    -- swap1
    SELECT
        created_by,
        user_ AS sender,
        CASE
            WHEN zero_for_one THEN pool
            ELSE fusdcAddress
        END AS token_in,
        CASE
            WHEN zero_for_one THEN fusdcAddress
            ELSE pool
        END AS token_out,
        CASE
            WHEN zero_for_one THEN amount0
            ELSE amount1
        END AS amount_in,
        CASE
            WHEN zero_for_one THEN amount1
            ELSE amount0
        END AS amount_out,
        transaction_hash
    FROM events_seawater_swap1
    WHERE created_by > after AND pool = pool_
    UNION ALL
    -- swap2
    SELECT
        created_by,
        user_ AS sender,
        from_ AS token_in,
        to_ AS token_out,
        amount_in,
        amount_out,
        transaction_hash
    FROM events_seawater_swap2
    WHERE created_by > after AND (from_ = pool_ OR to_ = pool_)
),
filtered_swaps AS (
    SELECT *
    FROM all_swaps
    WHERE 
        -- all swaps
        filter IS NULL OR
        -- fUSDC->pool_ OR pool->fUSDC
        (
            filter = fusdcAddress 
            AND (
                (token_in = fusdcAddress AND token_out = pool_) OR
                (token_in = pool_ AND token_out = fusdcAddress)
            )
        ) 
        -- filter->pool_ OR pool_->filter
        OR
        (
            filter <> fusdcAddress 
            AND (
                (token_in = filter AND token_out = pool_) OR
                (token_in = pool_ AND token_out = filter)
            )
        ) 
)
SELECT
    swaps.created_by,
    swaps.sender,
    swaps.token_in,
    swaps.token_out,
    swaps.amount_in,
    swaps.amount_out,
    swaps.transaction_hash,
    COALESCE(toPool.decimals, fusdcDecimals) AS token_out_decimals,
    COALESCE(fromPool.decimals, fusdcDecimals) AS token_in_decimals
FROM filtered_swaps swaps
LEFT JOIN events_seawater_newpool fromPool
    ON swaps.token_in = fromPool.token
LEFT JOIN events_seawater_newpool toPool
    ON swaps.token_out = toPool.token
ORDER BY swaps.created_by DESC
LIMIT limit_;
$$;

-- migrate:down
