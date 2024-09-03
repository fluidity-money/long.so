// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "./ILeoEvents.sol";

interface ILeo is ILeoEvents {
    /// @notice vest a position that the caller owns.
    /// @param pool to take the position from
    /// @param id of the position to take
    function vestPosition(address pool, uint256 id) external;

    /// @notice create a campaign with the parameters given.
    /// @param campaignId to modify for the pool given
    /// @param pool to reward positions that participate in with
    /// @param tickLower to reward positions in this range with
    /// @param tickUpper to reward positions in this range with
    /// @param perSecond distribution to send
    /// @param token to give out
    /// @param extraMax to start the pool amount with for this pool
    /// @param starting to when to start the token distribution with
    /// @param ending for when to stop the token distribution
    /// @dev takes extraMax from the user of the token given
    function createCampaign(
        bytes8 campaignId,
        address pool,
        int32 tickLower,
        int32 tickUpper,
        uint256 perSecond,
        address token,
        uint256 extraMax,
        uint64 starting,
        uint64 ending
    ) external;

    /// @notice create a campaign with the parameters given.
    /// @param campaignId to modify for the pool given
    /// @param pool to reward positions that participate in with
    /// @param tickLower to reward positions in this range with
    /// @param tickUpper to reward positions in this range with
    /// @param perSecond distribution to send
    /// @param token to give out
    /// @param extraMax to start the pool amount with for this pool
    /// @param starting to when to start the token distribution with
    /// @param ending for when to stop the token distribution
    /// @dev takes extraMax from the user of the token given
    function updateCampaign(
        bytes8 campaignId,
        address pool,
        int32 tickLower,
        int32 tickUpper,
        uint256 perSecond,
        address token,
        uint256 extraMax,
        uint64 starting,
        uint64 ending
    ) external;

    /// @notice the amount of times this campaign was modified for the pool
    /// @param pool to check the campaign for
    /// @param campaignId to check revisions for
    /// @return the amount of times the campaign was modified
    function campaignRevisions(
        address pool,
        bytes8 campaignId
    ) external view returns (uint256);

    /// @notice cancel an ongoing campaign by amending it to have 0
    /// @param pool to modify the campaign for
    /// @param campaignId to modify
    /// @dev only usable by the admin of the pool
    function cancelCampaign(address pool, bytes8 campaignId) external;

    /// @notice details of a campaign
    /// @param pool this campaign is for
    /// @param campaignId to identify this campaign
    function campaignDetails(address pool, bytes8 campaignId) external view returns (
        int32 tickLower,
        int32 tickUpper,
        uint256 perSecond,
        address token,
        uint256 distributed,
        uint256 maximum,
        uint64 startingTimestamp,
        uint64 endingTimestamp
    );

    /// @notice pool LP tokens vested to Leo for this pool
    /// @param pool to check
    /// @return lp tokens to return
    function poolLp(address pool) external returns (uint256 lp);

    struct PositionDetails {
        address token;
        uint256 id;
    }

    struct PoolRewards {
        address pool;
        uint128 amount0Lp;
        uint128 amount1Lp;
    }

    struct CampaignRewards {
        address campaignToken;
        uint256 rewards;
    }

    /// @notice collect rewards for a position vested in a pool with the campaigns given
    /// @param positionDetails to check
    /// @param campaignIds to check
    function collect(
        PositionDetails[] memory positionDetails,
        bytes8[] memory campaignIds
    ) external returns (
        PoolRewards[] memory poolRewards,
        CampaignRewards[] memory campaignRewards
    );

    /// @notice divest a position, returning the position ID to the user
    /// @param pool to check
    /// @param positionId to check
    function divestPosition(address pool, uint256 positionId) external;
}
