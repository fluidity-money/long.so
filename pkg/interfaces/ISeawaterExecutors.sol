// SPDX-Identifier: MIT
pragma solidity 0.8.16;

interface ISeawaterExecutorSwap {
    function swap(
        address pool,
        bool zeroForOne,
        int256 amount,
        uint256 priceLimit
    ) external returns (int256, int256);

    function swap2ExactIn(
        address from,
        address to,
        uint256 amount,
        uint256 minOut
    ) external returns (uint256, uint256);

    function swap2ExactOut(
        address from,
        address to,
        uint256 amount,
        uint256 maxIn
    ) external returns (uint256, uint256);
}

interface ISeawaterExecutorPosition {
    function updatePosition(
        address pool,
        address owner,
        int32 lower,
        int32 upper,
        int128 delta
    ) external returns (int256, int256);

    function collect(
        address pool,
        address owner,
        int32 lower,
        int32 upper,
        uint128 amount0,
        uint128 u128
    ) external returns (uint128, uint128);
}

interface ISeawaterExecutorAdmin {
    function ctor(address usdc) external;

    function init(
        address pool,
        uint256 sqrtPriceX96,
        uint32 fee,
        uint8 tickSpacing,
        uint128 maxLiquidityPerTick
    ) external;

    function collectProtocol(
        address pool,
        uint128 amount0,
        uint128 amount1
    ) external returns (uint128, uint128);
}

interface ISeawaterExecutorFallback {

}
