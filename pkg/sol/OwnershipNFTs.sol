// SPDX-Identifier: MIT

pragma solidity 0.8.16;

import "../interfaces/IERC721.sol";
import "../interfaces/ISeawaterOwnership.sol";

contract OwnershipNFTs is IERC721 {
    ISeawaterOwnership immutable public seawater;

    constructor(ISeawaterOwnership _seawater) {
        seawater = _seawater;
    }

    /**
     * @notice ownerOf a NFT given by looking it up with the tracked Seawater contract
     */
    function ownerOf(uint256 _tokenId) external view returns (address) {

    }
}
