// SPDX-Identifier: MIT

pragma solidity 0.8.16;

interface ISeawaterOwnership {
    function ownerOf(uint256 _tokenId) external view returns (address);

    function transfer(
        uint256 _tokenId,
        address _recipient,
        uint256 _units
    ) external view returns (uint256 newTokenId);
}
