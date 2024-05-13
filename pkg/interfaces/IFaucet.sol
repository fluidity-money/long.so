// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "./IERC20.sol";

/**
 * @notice IFaucet sends a random amount of the token basket to the users who request to
 * do so. Does it once per address per 8 hours. Very low stakes owing to it's bloom filter!
 */
interface IFaucet {
    /**
     * @notice claimAmount for the recipient given, randomly sending some tokens.
     * @param _recipient to receive the tokens.
     */
    function claimAmount(address _recipient) external returns (uint256[] memory);

    /**
     * @notice timeUntilNextClaim for the recipient given. Returns 0 the max uint256 if
     * they're not allowed.
     * @param _recipient to check.
     */
    function timeUntilNextClaim(
        address _recipient
    ) external view returns (uint256);
}
