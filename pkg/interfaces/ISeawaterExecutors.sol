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
    function mintPosition(
        address pool,
        int32 lower,
        int32 upper
    ) external returns (uint256);

    function burnPosition(uint256 id) external;

    function transferPosition(uint256 id, address from, address to) external;

    function positionOwner(uint256 id) external view returns (address);

    function positionBalance(address user) external view returns (uint256);

    function updatePosition(
        address pool,
        uint256 id,
        int128 delta
    ) external returns (int256, int256);

    function collect(
        address pool,
        uint256 id,
        uint128 amount0,
        uint128 amount1
    ) external returns (uint128, uint128);
}

interface ISeawaterExecutorAdmin {
    function ctor(address usdc, address seawaterAdmin, address nftManager) external;

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
