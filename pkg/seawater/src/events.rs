use stylus_sdk::alloy_sol_types::sol;

// positions
sol! {
    event MintPosition(
        uint256 indexed id,
        address indexed owner,
        address indexed pool,
        int32 lower,
        int32 upper,
    );

    event BurnPosition(
        uint256 indexed id,
        address indexed owner,
    );

    event TransferPosition(
        address indexed from,
        address indexed to,
        uint256 indexed id,
    );

    event UpdatePositionLiquidity(
        uint256 indexed id,
        int128 delta,
    );

    event CollectFees(
        uint256 indexed id,
        address indexed pool,
        address indexed to,
        uint128 amount0,
        uint128 amount1,
    );
}

// admin
sol! {
    event NewPool(
        address indexed token,
        uint32 indexed fee,
        uint256 indexed price,
    );

    event CollectProtocolFees(
        address indexed pool,
        address indexed to,
        uint128 amount0,
        uint128 amount1,
    );
}

// amm
sol! {
    event Swap(
        address indexed user,
        address indexed from,
        address indexed to,
        uint256 amountIn,
        uint256 amountOut,
    );
}
