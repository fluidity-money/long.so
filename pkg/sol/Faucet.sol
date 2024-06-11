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
    address public operator_;

    /// @dev emergency council to use to "rescue" the funds at any point.
    address immutable EMERGENCY_COUNCIL;

    /// @dev MIN_ETH to send out to users.
    uint256 constant MIN_ETH = 1e12;

    constructor(address _operator, address _emergencyCouncil) {
        operator_ = _operator;
        EMERGENCY_COUNCIL = _emergencyCouncil;
    }

    /// @inheritdoc IFaucet
    function sendTo(address[] calldata _requests) external {
        require(msg.sender == operator_, "only operator");
        for (uint i = 0; i < _requests.length; ++i) {
            address recipient = _requests[i];
            payable(recipient).transfer(MIN_ETH);
        }
    }

    function rescue() external {
      require(msg.sender == EMERGENCY_COUNCIL, "council only");
      payable(msg.sender).transfer(address(this).balance);
    }

    function changeOperator(address _oldOperator, address _newOperator) external {
        require(operator_ == _oldOperator, "incorrect order");
        require(msg.sender == operator_, "only operator");
        operator_ = _newOperator;
    }
}
