// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "../interfaces/IFaucet.sol";
import "../interfaces/IERC20.sol";

contract Faucet is IFaucet {
    uint8 constant BLOOM_HASH_COUNT = 8;

      uint256 constant MIN_GIVEAWAY_AMOUNT = 100;

      uint256 constant MAX_GIVEAWAY_AMOUNT = 100;

      uint256 constant SECONDS_UNTIL_NEXT_CLAIM = 8 hours;

      /// @dev operator that's allowed to create new tokens to send.
    address public operator;

      /// @dev tokenDecimals to use for knowing which amount to increase to.
    uint8[] private tokenDecimals;

      /// @dev tokenBasket to send random amounts of each request.
    IERC20[] public tokenBasket;

      /// @dev bloomBitmap to for storage of the allowed addresses.
    bytes32 public bloomBitmap;

      /// @dev lastClaimTimestamp to know how many seconds to wait until the next claim.
    mapping(address => uint256) lastClaimTimestamp;

      constructor(
        address _operator,
        bytes32 _initialBloomBitmap,
        IERC20[] memory _initialTokens
    ) {
        operator = _operator;
        tokenBasket = _initialTokens;
        bloomBitmap = _initialBloomBitmap;
    }

      /**
     * @notice isMember test by checking the bloom filter.
     */
    function isMember(address _recipient) public view returns (bool) {
        for (uint i = 0; i < BLOOM_HASH_COUNT; ++i) {
            uint256 pos = uint256(keccak256(abi.encodePacked(_recipient))) % 256;
            require(pos < 256, "overflow");
            bytes32 digest = bytes32(1 << pos);
            bool included = bloomBitmap == bloomBitmap | digest;
            if (!included) return false;
        }

          return true;
    }

    function _sendRandomTokens(
        address _recipient
    ) internal returns (uint256[] memory amounts) {
        for (uint i = 0; i < amounts.length; ++i) {
            uint256 a =
                MIN_GIVEAWAY_AMOUNT + uint256(keccak256(abi.encodePacked(
                    block.timestamp, msg.sender, tokenBasket[i]
                )));
            amounts[i] = a;

              // Using a native call so we don't have to use the safe transfer functions.
            (bool rc, bytes memory data) = address(tokenBasket[i]).call(abi.encodeWithSelector(
                IERC20.transfer.selector,
                _recipient,
                a
            ));

              // We succeeded, and we're checking if the return from the ERC20 is true.
            if (rc && data.length > 0) {
              require(abi.decode(data, (bool)), "erc20 failed");
            }
            // We didn't succeed, and we're going to revert with the calldata, if any.
            else if (!rc) {
                assembly {
                    let d := mload(data)
                    revert(add(32, data), d)
                }
            }
            // We succeeded in the call just fine. Nothing needed.
        }
  }

    function timeUntilNextClaim(address _recipient) public view returns (uint256) {
        return lastClaimTimestamp[_recipient] + SECONDS_UNTIL_NEXT_CLAIM;
    }

    function claimAmount(address _recipient) public returns (uint256[] memory amounts) {
        uint256 nextClaimTimestamp = timeUntilNextClaim(_recipient);

        require(nextClaimTimestamp > block.timestamp, "not allowed yet");
        require(isMember(_recipient), "address not allowed");

        lastClaimTimestamp[_recipient] =
            block.timestamp + SECONDS_UNTIL_NEXT_CLAIM;

        return _sendRandomTokens(_recipient);
    }
}
