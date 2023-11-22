// SPDX-Identifier: MIT
pragma solidity 0.8.16;

interface ISeawaterExecutorSwap {
    /// @notice swaps within a pool
    /// @param pool the pool to swap on
    /// @param zeroForOne true if swapping token->fluid token
    /// @param amount the amount of token to swap, positive if exactIn, negative if exactOut
    /// @param priceLimit the price limit for swaps, encoded as a sqrtX96 price
    /// @return (token0, token1) delta
    function swap(
        address pool,
        bool zeroForOne,
        int256 amount,
        uint256 priceLimit
    ) external returns (int256, int256);

    /// @notice performs a two stage swap across two pools
    /// @param from the input token
    /// @param to the output token
    /// @param amount the amount of the input token to use
    /// @param minOut the minimum valid amount of the output token, reverts if not reached
    /// @return (amount in, amount out)
    function swap2ExactIn(
        address from,
        address to,
        uint256 amount,
        uint256 minOut
    ) external returns (uint256, uint256);
}

interface ISeawaterExecutorPosition {
    /// @notice creates a new position
    /// @param pool the pool to create the position on
    /// @param lower the lower tick of the position (for concentrated liquidity)
    /// @param upper the upper tick of the position
    /// @return the id of the position
    function mintPosition(
        address pool,
        int32 lower,
        int32 upper
    ) external returns (uint256);

    /// @notice burns a position, leaving the liquidity in it inaccessible
    /// @notice id the id of the position to burn
    function burnPosition(uint256 id) external;

    /// @notice transferPosition transfers a position. usable only by the NFT manager
    /// @param id the id of the position to transfer
    /// @param from the user to transfer the position from
    /// @param to the user to transfer the position to
    function transferPosition(uint256 id, address from, address to) external;

    /// @notice gets the owner of a position
    /// @param id the id of the position
    /// @return the owner of the position
    function positionOwner(uint256 id) external returns (address);

    /// @notice gets the number of positions owned by a user
    /// @param user the user to get position balance for
    /// @return the number of positions owned by the user
    function positionBalance(address user) external returns (uint256);

    /// @notice gets the amount of liquidity in a position
    /// @param pool the pool the position belongs to
    /// @param id the id of the position
    /// @return the amount of liquidity contained in the position
    function positionLiquidity(address pool, uint256 id) external returns (uint128);

    /// @notice refreshes a position's fees, and adds or removes liquidity
    /// @param pool the pool the position belongs to
    /// @param id the id of the position
    /// @param delta the amount of liquidity to add or remove
    /// @return the deltas for token0 and token1 for the user
    function updatePosition(
        address pool,
        uint256 id,
        int128 delta
    ) external returns (int256, int256);

    /// @notice collects fees from a position
    /// @param pool the pool the position belongs to
    /// @param id the id of the position
    /// @param amount0 the maximum amount of token0 to claim
    /// @param amount1 the maximum amount of token1 to claim
    /// @return the amount of token0 and token1 collected
    function collect(
        address pool,
        uint256 id,
        uint128 amount0,
        uint128 amount1
    ) external returns (uint128, uint128);
}

/// @dev contains just the admin functions that are exposed directly
interface ISeawaterExecutorAdminExposed {
    /// @notice initialises a new pool. only usable by the seawater admin
    /// @param pool the token to create the pool with
    /// @param sqrtPriceX96 the starting price for the pool
    /// @param fee the fee to use
    /// @param tickSpacing the spacing for valid liquidity ticks
    /// @param maxLiquidityPerTick the maximum amount of liquidity allowed in a single tick
    function createPool(
        address pool,
        uint256 sqrtPriceX96,
        uint32 fee,
        uint8 tickSpacing,
        uint128 maxLiquidityPerTick
    ) external;

    /// @notice collects protocol fees. only usable by the seawater admin
    /// @param pool the pool to collect fees for
    /// @param amount0 the maximum amount of token0 fees to collect
    /// @param amount1 the maximum amount of token1 fees to collect
    /// @return the amount of token0 and token1 fees collected
    function collectProtocol(
        address pool,
        uint128 amount0,
        uint128 amount1
    ) external returns (uint128, uint128);

    /// @notice enables or disables a pool
    /// @param pool the pool to enable or disable
    /// @param enabled true to enable to pool, false to disable it
    function setPoolEnabled(address pool, bool enabled) external;
}

interface ISeawaterExecutorAdmin  is ISeawaterExecutorAdminExposed {
    /// @notice constructor function
    /// @param usdc the address of the counterparty token
    /// @param seawaterAdmin the account with administrative power on the amm
    /// @param nftManager the account with control over NFT ownership
    /// @param permit2 the address of the permit2 contract
    function ctor(address usdc, address seawaterAdmin, address nftManager, address permit2) external;
}

interface ISeawaterExecutorFallback {

}
