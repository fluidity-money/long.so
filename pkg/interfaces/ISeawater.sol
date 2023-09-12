// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

interface ISeawater {
    function swap1In(uint8 poolId) external returns (uint256 returned);
    function swap2In(uint8 poolId1, uint8 poolId2) external returns (uint256 returned);

    function swap1Out(uint8 poolId) external returns (uint256 returned);
    function swap2Out(uint8 poolId) external returns (uint256 returned);

    function burn(uint8 poolId) external returns (uint112 burned);
    function mint(uint8 poolId) external returns (uint112 minted);

    /// @notice implements EIP1155
    function balanceOfUnderlying(uint8 poolId, address spender) external returns (uint256 amount);
}
