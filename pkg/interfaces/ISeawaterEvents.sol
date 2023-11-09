// SPDX-Identifier: MIT
pragma solidity 0.8.16;

interface ISeawaterEvents {
    // positions
    event MintPosition(
        uint256 indexed id,
        address indexed owner,
        address indexed pool,
        int32 lower,
        int32 upper
    );

    event BurnPosition(
        uint256 indexed id,
        address indexed owner
    );

    event TransferPosition(
        address indexed from,
        address indexed to,
        uint256 indexed id
    );

    event UpdatePositionLiquidity(
        uint256 indexed id,
        int128 delta
    );

    event CollectFees(
        uint256 indexed id,
        address indexed pool,
        address indexed to,
        uint128 amount0,
        uint128 amount1
    );

    // admin
    event NewPool(
        address indexed token,
        uint32 indexed fee,
        uint256 indexed price
    );

    event CollectProtocolFees(
        address indexed pool,
        address indexed to,
        uint128 amount0,
        uint128 amount1
    );

    // amm
    event Swap2(
        address indexed user,
        address indexed from,
        address indexed to,
        uint256 amountIn,
        uint256 amountOut,
        int32 finalTick0,
        int32 finalTick1
    );

    event Swap1(
        address indexed user,
        address indexed pool,
        bool zeroForOne,
        uint256 amount0,
        uint256 amount1,
        int32 finalTick
    );
}
