// SPDX-Identifier: MIT

pragma solidity 0.8.16;

import "./IFaucet.sol";

/*
* Faucet sends the SPN gas token to recipients given by a thirdparty service. Optionally
* sends multiple amounts at once (presumably upstream will batch every 5 seconds to
* accomplish this.)
*/
contract Faucet is IFaucet {
    /// @dev operator to use to send the amounts on request.
    address immutable OPERATOR;

    /// @dev emergency council to use to "rescue" the funds at any point.
    address immutable EMERGENCY_COUNCIL;

    uint256 constant MAX_ETH = 1e12;

    constructor(address _operator, address _emergencyCouncil) {
        OPERATOR = _operator;
        EMERGENCY_COUNCIL = _emergencyCouncil;
    }

    function sendTo(address[] calldata _requests) external {
        require(msg.sender == OPERATOR, "only operator");
        for (uint i = 0; i < _requests.length; ++i) {
            address recipient = _requests[i];
            uint256 randomAmount =
                uint256(keccak256(abi.encodePacked(recipient, block.timestamp, i))) % MAX_ETH;
            payable(recipient).transfer(randomAmount);
        }
    }

    function rescue() external {
      require(msg.sender == EMERGENCY_COUNCIL, "council only");
      payable(msg.sender).transfer(address(this).balance);
    }
}
