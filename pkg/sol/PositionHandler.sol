// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./ISeawaterAMM.sol";
import "./ILeo.sol";
import "./IERC20.sol";

contract PositionHandler {
    ISeawaterAMM immutable LONGTAIL;
    ILeo immutable LEO;
    IERC20 immutable FUSDC;

    constructor(address longtail, address leo, address fusdcAddr) {
        LONGTAIL = ISeawaterAMM(longtail);
        LEO = ILeo(leo);
        FUSDC = IERC20(fusdcAddr);
        FUSDC.approve(longtail, type(uint256).max);
    }

    function proxyVestIncr(
        address pool,
        int32 lower,
        int32 upper,
        uint256 amount0Min,
        uint256 fusdcMin,
        uint256 amount0Max,
        uint256 fusdcMax,
        bool shouldVest,
        address recipient
    ) external returns (uint256) {
        uint256 id = LONGTAIL.mintPositionBC5B086D(pool, lower, upper);
        IERC20(pool).transferFrom(msg.sender, address(this), amount0Max);
        FUSDC.transferFrom(msg.sender, address(this), fusdcMax);
        (uint256 amount0Taken, uint256 fusdcTaken) =
            LONGTAIL.incrPositionE2437399(
                pool,
                id,
                amount0Min,
                fusdcMin,
                amount0Max,
                fusdcMax
            );
        IERC20(pool).transfer(msg.sender, amount0Max - amount0Taken);
        IERC20(pool).transfer(msg.sender, fusdcMax - fusdcTaken);
        if (shouldVest) {
            LEO.vestPosition(pool, id);
        } else {
            LONGTAIL.transferPositionEEC7A3CD(id, address(this), recipient);
        }
        return id;
    }
}
