// SPDX-Identifier: MIT

pragma solidity 0.8.16;

interface ISeawaterOwnership {
    function ownerOf(uint256 _tokenId) external view returns (address);

    function transfer(address _sender, uint256 _tokenId, address _recipient) external;

    function balanceOf(address _spender) external view returns (uint256);
}
