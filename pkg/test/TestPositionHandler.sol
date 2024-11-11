// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "forge-std/Test.sol";

import "./MockLongtail.sol";
import "./MockLeo.sol";
import "./LightweightERC20.sol";

import "../sol/PositionHandler.sol";

import "../sol/ISeawater.sol";
import "../sol/ILeo.sol";
import "../sol/IERC20.sol";

contract TestPositionHandler is Test {
    ISeawater seawater;
    ILeo leo;
    IERC20 fusdc;
    IERC20 otherToken;

    PositionHandler positionHandler;

    function setUp() external {
        fusdc = IERC20(address(new LightweightERC20(
            "Hello",
            "World",
            18,
            type(uint256).max,
            address(this)
        )));
        otherToken = IERC20(address(new LightweightERC20(
            "Stinke",
            "Monke",
            18,
            type(uint256).max,
            address(this)
        )));
        seawater = ISeawater(address(new MockLongtail(fusdc)));
        leo = ILeo(address(new MockLeo()));
        positionHandler = new PositionHandler(seawater, leo, fusdc);
    }

    function testShouldTakePositions() external {
        uint256 fusdcMaxAmt = 200;
        uint256 otherTokenMaxAmt = 100;
        otherToken.approve(address(positionHandler), otherTokenMaxAmt);
        fusdc.approve(address(positionHandler), fusdcMaxAmt);
        positionHandler.proxyVestIncr(
            address(otherToken),
            11,  // Lower
            222, // Upper
            0,
            1,
            otherTokenMaxAmt,
            fusdcMaxAmt,
            true,
            address(this)
         );
    }
}
