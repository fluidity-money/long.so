// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract MockLeo {
    uint counter;
    function vestPosition(address pool, uint256 id) external {
        ++counter;
    }
}

