//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../sol/IERC20.sol";

contract MockLongtail {
    IERC20 immutable FUSDC;

    uint counter;

    constructor(IERC20 fusdc) {
        FUSDC = fusdc;
    }

    function mintPositionBC5B086D(
        address /* pool */,
        int32 /* lower */,
        int32 /* upper */
    ) external returns (uint256 id) {
        return ++counter;
    }

    function transferPositionEEC7A3CD(
        uint256 /* id */,
        address /* from */,
        address /* to */
    ) external {
        ++counter;
    }

    function incrPositionE2437399(
        address pool,
        uint256 /* id */,
        uint256 amount0Min,
        uint256 amount1Min,
        uint256 /* amount0Desired */,
        uint256 /* amount1Desired */
    ) external returns (uint256, uint256) {
        IERC20(pool).transferFrom(msg.sender, address(this), amount0Min);
        FUSDC.transferFrom(msg.sender, address(this), amount1Min);
        return (amount0Min, amount1Min);
    }
}
