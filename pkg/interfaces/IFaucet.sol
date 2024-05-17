// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "./IERC20.sol";

/*
 * Why use a bloom filter here?
 *
 * 1. We control the token supply of the tokens in the faucet.
 *
 * 2. We want allowed users reusing the faucet as much as they want, so we want to reduce
 * the burden on their testnet eth.
 *
 * 3. We can pay a price upfront once that's expensive of a extcodecopy for a word, then
 * we're fine. But the calldata from always resubmitting a index is a pain.
 *
 * 4. If someone were to dos the faucet, we would simply pull the funds, and disable the
   bloom claim feature.
 */

/**
 * @notice IFaucet sends a random amount of the token basket to the users who request to
 * do so. Does it once per address per 8 hours.
 */
interface IFaucet {
    /**
     * @notice claimAmount for the recipient given, randomly sending some tokens.
     */
    function claimAmount() external;

    /**
     * @notice isMember for the recipient given, cehcking if they're included in the filter.
     */
    function isMember(address _recipient) external view returns (boolean);

    /**
     * @notice timeUntilNextClaim for the recipient given. Returns 0 the max uint256 if
     * they're not allowed.
     * @param _recipient to check.
     */
    function timeUntilNextClaim(
        address _recipient
    ) external view returns (uint256);
}
