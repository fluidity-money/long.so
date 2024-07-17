// SPDX-Identifier: MIT
pragma solidity 0.8.16;

interface ISeawaterExecutorSwap {
    /// @notice swaps within a pool
    /// @param pool the pool to swap on
    /// @param zeroForOne true if swapping token->fluid token
    /// @param amount the amount of token to swap, positive if exactIn, negative if exactOut
    /// @param priceLimit the price limit for swaps, encoded as a sqrtX96 price
    /// @return (token0, token1) delta
    function swap_5a7d1bbd(
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
    function swap2ExactIn41203F1D(
        address from,
        address to,
        uint256 amount,
        uint256 minOut
    ) external returns (uint256, uint256);
}

interface ISeawaterExecutorSwapPermit2 {
    /// @notice swaps within a pool using permit2 for token transfers
    /// @param pool the pool to swap on
    /// @param zeroForOne true if swapping token->fluid token
    /// @param amount the amount of token to swap, positive if exactIn, negative if exactOut
    /// @param priceLimit the price limit for swaps, encoded as a sqrtX96 price
    /// @param nonce the permit2 nonce
    /// @param deadline the permit2 deadline
    /// @param maxAmount the permit2 maxAmount
    /// @param sig the permit2 signature
    /// @return (token0, token1) delta
    function swapPermit2EE84AD91(
        address pool,
        bool zeroForOne,
        int256 amount,
        uint256 priceLimit,
        uint256 nonce,
        uint256 deadline,
        uint256 maxAmount,
        bytes memory sig
    ) external returns (int256, int256);

    /// @notice performs a two stage swap across two pools using permit2 for token transfers
    /// @param from the input token
    /// @param to the output token
    /// @param amount the amount of the input token to use
    /// @param minOut the minimum valid amount of the output token, reverts if not reached
    /// @param nonce the permit2 nonce
    /// @param deadline the permit2 deadline
    /// @param sig the permit2 signature
    /// @notice permit2's max amount must be set to `amount`
    /// @return (amount in, amount out)
    function swap2ExactInPermit236B2FDD8(
        address from,
        address to,
        uint256 amount,
        uint256 minOut,
        uint256 nonce,
        uint256 deadline,
        bytes memory sig
    ) external returns (uint256, uint256);
}

interface ISeawaterExecutorQuote {
    /// @notice reverts with the expected amount of fUSDC or pool token for a swap with the given parameters
    /// @param pool the pool to swap on
    /// @param zeroForOne true if swapping token->fluid token
    /// @param amount the amount of token to swap, positive if exactIn, negative if exactOut
    /// @param priceLimit the price limit for swaps, encoded as a sqrtX96 price
    /// @notice always revert with Error(string(amountOut))
    function quote72E2ADE7(
        address pool,
        bool zeroForOne,
        int256 amount,
        uint256 priceLimit
    ) external;

    /// @notice reverts with the expected amount of tokenOut for a 2-token swap with the given parameters
    /// @param from the input token
    /// @param to the output token
    /// @param amount the amount of the input token to use
    /// @param minOut the minimum valid amount of the output token, reverts if not reached
    /// @notice always revert with Error(string(amountOut))
    function quote2CD06B86E(
        address from,
        address to,
        uint256 amount,
        uint256 minOut
    ) external;
}

interface ISeawaterExecutorPosition {
    /// @notice creates a new position
    /// @param pool the pool to create the position on
    /// @param lower the lower tick of the position (for concentrated liquidity)
    /// @param upper the upper tick of the position
    function mintPositionBC5B086D(
        address pool,
        int32 lower,
        int32 upper
    ) external returns (uint256 id);

    /// @notice burns a position, leaving the liquidity in it inaccessible
    /// @notice id the id of the position to burn
    function burnPositionAE401070(uint256 id) external;

    /// @notice transferPosition transfers a position. usable only by the NFT manager
    /// @param id the id of the position to transfer
    /// @param from the user to transfer the position from
    /// @param to the user to transfer the position to
    function transferPositionEEC7A3CD(uint256 id, address from, address to) external;

    /// @notice gets the owner of a position
    /// @param id the id of the position
    /// @return the owner of the position
    function positionOwnerD7878480(uint256 id) external returns (address);

    /// @notice gets the number of positions owned by a user
    /// @param user the user to get position balance for
    /// @return the number of positions owned by the user
    function positionBalance4F32C7DB(address user) external returns (uint256);

    /// @notice gets the amount of liquidity in a position
    /// @param pool the pool the position belongs to
    /// @param id the id of the position
    /// @return the amount of liquidity contained in the position
    function positionLiquidity8D11C045(address pool, uint256 id) external returns (uint128);

    /// @notice collects fees from from positions
    /// @param pools to claim accumulated yield from
    /// @param ids to claim the positions of
    function collect7F21947C(
        address[] memory pools,
        uint256[] memory  ids
    ) external returns (uint128, uint128);
}

interface ISeawaterExecutorUpdatePosition {
    /// @notice refreshes a position's fees, and adds or removes liquidity
    /// @param id the id of the position
    /// @param delta the amount of liquidity to add or remove
    /// @return the deltas for token0 and token1 for the user
    function updatePosition622A559D(
        uint256 id,
        int128 delta
    ) external returns (int256, int256);

    /// @notice refreshes a position's fees, and adds liquidity, with some safeguards
    /// @param id the id of the position
    /// @param amount0Min minimum of amount0 to take from the user
    /// @param amount1Min minimum of amount1 to take from the user
    /// @param amount0Max to use as the maximum of amount0, used to create the delta
    /// @param amount1Max to use as the maximum of amount1, used to create the delta
    /// @return the deltas for token0, and token1
    function incrPosition05FD2263(
        uint256 id,
        uint256 amount0Min,
        uint256 amount1Min,
        uint256 amount0Max,
        uint256 amount1Max
    ) external returns (int256, int256);

    /// @notice refreshes a position's fees, and adds or removes liquidity using permit2 for token transfers
    /// @param pool the pool the position belongs to
    /// @param id the id of the position
    /// @param delta the amount of liquidity to add or remove
    /// @param nonce0 the nonce for token 0
    /// @param deadline0 the deadline for token 0
    /// @param maxAmount0 the max amount for token 0
    /// @param sig0 the signature for token 0
    /// @param nonce1 the nonce for token 1
    /// @param deadline1 the deadline for token 1
    /// @param maxAmount1 the max amount for token 1
    /// @param sig1 the signature for token 1
    /// @return the deltas for token0 and token1 for the user
    function updatePositionPermit2F24010C3(
        address pool,
        uint256 id,
        int128 delta,
        uint256 nonce0,
        uint256 deadline0,
        uint256 maxAmount0,
        bytes memory sig0,
        uint256 nonce1,
        uint256 deadline1,
        uint256 maxAmount1,
        bytes memory sig1
    ) external returns (int256, int256);
}

/// @dev contains just the admin functions that are exposed directly
interface ISeawaterExecutorAdminExposed {
    /// @notice initialises a new pool. only usable by the seawater admin
    /// @param pool the token to create the pool with
    /// @param sqrtPriceX96 the starting price for the pool
    /// @param fee the fee to use
    /// @param tickSpacing the spacing for valid liquidity ticks
    /// @param maxLiquidityPerTick the maximum amount of liquidity allowed in a single tick
    function createPoolD650E2D0(
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
    function collectProtocolE4E70DA4(
        address pool,
        uint128 amount0,
        uint128 amount1
    ) external returns (uint128, uint128);

    /// @notice feesOwed to a position ID given.
    /// @param pool to get the fees owed for
    /// @param id of the position to check for
    /// @return the amount of token0 and token1 to get in return
    function feesOwed22F28DBD(address pool, uint256 id) external returns (uint128, uint128);

    /// @notice gets the current sqrt price of the pool
    /// @param pool to get from
    /// @return the current sqrtPriceX96 for the pool
    function sqrtPriceX967B8F5FC5(address pool) external returns (uint256);

    /// @notice gets the currently used tick of the pool
    /// @param pool to get from
    /// @return the current active tick in the pool
    function curTick181C6FD9(address pool) external returns (int32);

    /// @notice gets the tick spacing of the pool
    /// @param pool to get from
    /// @return the tick spacing of the pool
    function tickSpacing653FE28F(address pool) external returns (uint8);

    /// @notice gets the fee growth for token 0
    /// @param pool to get from
    /// @return the fee growth for the other token
    function feeGrowthGlobal038B5665B(address pool) external returns (uint256);

    /// @notice gets the fee growth for token 1
    /// @param pool to get from
    /// @return the fee growth for fUSDC
    function feeGrowthGlobal14EACF1BE(address pool) external returns (uint256);

    /// @notice enables or disables a pool
    /// @param pool the pool to enable or disable
    /// @param enabled true to enable to pool, false to disable it
    function enablePool579DA658(address pool, bool enabled) external;
}

interface ISeawaterExecutorAdmin  is ISeawaterExecutorAdminExposed {
    /// @notice constructor function
    /// @param seawaterAdmin the account with administrative power on the amm
    /// @param nftManager the account with control over NFT ownership
    function ctor(address seawaterAdmin, address nftManager) external;
}

interface ISeawaterExecutorFallback {}
