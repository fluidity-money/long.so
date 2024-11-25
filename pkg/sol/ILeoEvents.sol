// SPDX-Identifier: MIT
pragma solidity 0.8.16;

interface ILeoEvents {
    /// @notice a campaign was created. Includes the details.
    /// @param identifier that was computed to represent this campaign
    /// @param pool that this is eligible for
    /// @param token that is being given out for this campaign
    /// @param details that are packed including the lower tick, upper, and the owner
    /// @param times that contains the starting, ending timestamp, and per second distribution
    event CampaignCreated(
        bytes8 indexed identifier,
        address indexed pool,
        address indexed token,
        uint256 details, // [tick lower, tick upper, owner],
        uint256 times // [starting, ending, per second distribution]
    );

    /// @notice a campaign was updated. Includes the new settings.
    /// @param identifier that was computed to represent this campaign
    /// @param perSecond distribution to give out
    /// @param pool that this campaign is for that was just updated
    /// @param perSecond token distribution
    /// @param extras including the tick lower, the tick upper, the starting and ending timestamp
    event CampaignUpdated(
        bytes8 indexed identifier,
        address indexed pool,
        uint256 indexed perSecond,
        uint256 extras // [tick lower, tick upper, starting, ending]
    );

    /// @notice a specific position was vested
    /// @param positionId that was just vested
    event PositionVested2(
        uint256 indexed positionId,
        address indexed owner
    );

    /// @notice a specific position was just divested from Leo
    /// @param positionId that was divested
    /// @param recipient of the divested position
    event PositionDivested2(uint256 indexed positionId, address indexed recipient);
}
