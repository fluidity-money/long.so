// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "../interfaces/ISeawater.sol";

contract MockSeawater is ISeawater {
    uint256 counter;

    function swapIn(
        address /* _token */,
        uint256 /* _amount */,
        uint256 /* _limit */
    ) external returns (uint256) {
        ++counter;
        return 0;
    }

    function swapOut(
        address /* _token */,
        uint256 /* _amount */,
        uint256 /* _limit */
    ) external returns (uint256) {
        ++counter;
        return 0;
    }

    function swap2(
        address /* _tokenA */,
        address /* _tokenB */,
        uint256 /* _amount */,
        uint256 /* _limit */
    ) external returns (uint256) {
        ++counter;
        return 0;
    }

    function burn(uint8 /* poolId */) external returns (uint112 burned) {
        ++counter;
        return 0;
    }

    function mint(uint8 /* poolId */) external returns (uint112 minted) {
        ++counter;
        return 0;
    }

    function ownerOf(uint256 /* _position */) external view returns (address) {
        return msg.sender;
    }

    function transfer(
        uint256 /* _tokenId */,
        address /* _recipient */
    ) external {
        ++counter;
    }

    function balanceOf(address /* _spender */) external view returns (uint256) {
         return counter;
    }
}
