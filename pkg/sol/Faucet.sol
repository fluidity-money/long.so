// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "../interfaces/IFaucet.sol";
import "../interfaces/IERC20.sol";

import "forge-std/console.sol";

contract Faucet is IFaucet {
    uint256 constant PRELUDE = 1;

    /// @dev HOLDER_SIZE of the bloom that was created. Not the contract size.
    uint256 constant HOLDER_SIZE = 24576 - 1;

    uint256 constant MIN_GIVEAWAY_AMOUNT = 100;

    uint256 constant MAX_GIVEAWAY_AMOUNT = 100;

    uint256 constant SECONDS_UNTIL_NEXT_CLAIM = 8 hours;

    /// @dev operator that's allowed to create new tokens to send.
    address public operator;

    /// @dev tokenDecimals to use for knowing which amount to increase to.
    uint8[] private tokenDecimals;

    /// @dev tokenBasket to send random amounts of each request.
    IERC20[] public tokenBasket;

    /// @dev holderContract stores the addresses of the allowed
    /// participants in the staking.
    address public holderContract;

    uint private holderContractSize;

    /// @dev lastClaimTimestamp to know how many seconds to wait until
    /// the next claim.
    mapping(address => uint256) lastClaimTimestamp;

    constructor(address _operator, address _holderContract, IERC20[] memory _initialTokens) {
        operator = _operator;
        tokenBasket = _initialTokens;
        holderContract = _holderContract;
        uint size;
        assembly {
            size := extcodesize(_holderContract)
        }
        require(size > 0, "holder contract empty");
        holderContractSize = size;
    }

    /**
     * @notice isMember test by checking the bloom filter extcode.
     */
    function isMember(address _recipient) public view returns (bool) {
        uint256 pos = PRELUDE + (uint256(keccak256(abi.encodePacked(_recipient))) % HOLDER_SIZE);
        address holder = holderContract;
        bytes1 included;
        assembly {
            let t := mload(0x80)
            extcodecopy(holder, t, pos, 1)
            included := mload(add(t, 0x1f))
        }
        return included > 0;
    }

    function _sendRandomTokens(address _recipient) internal {
        for (uint256 i = 0; i < tokenBasket.length; ++i) {
            uint256 a =
                MIN_GIVEAWAY_AMOUNT + uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenBasket[i])));

            // Using a native call so we don't have to use the safe transfer functions.
            (bool rc, bytes memory data) =
                address(tokenBasket[i]).call(abi.encodeWithSelector(IERC20.transfer.selector, _recipient, a));

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

    function claimAmount() public {
        uint256 nextClaimTimestamp = timeUntilNextClaim(msg.sender);

        require(nextClaimTimestamp > block.timestamp, "not allowed yet");
        require(isMember(msg.sender), "address not allowed");

        lastClaimTimestamp[msg.sender] = block.timestamp + SECONDS_UNTIL_NEXT_CLAIM;

        _sendRandomTokens(msg.sender);
    }
}
