// SPDX-Identifier: MIT

pragma solidity 0.8.16;

interface IFaucet {
    /**
     * @notice sendTo the recipients given, with the amount being randomly chosen.
     * @dev will break if there's not enough to send... by design.
     */
    function sendTo(address[] calldata _requests) external;
}
