// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "../interfaces/IERC721Metadata.sol";
import "../interfaces/IERC721TokenReceiver.sol";
import "../interfaces/ISeawaterOwnership.sol";

import "./utils/Errors.sol";

contract OwnershipNFTs is IERC721Metadata {
    ISeawaterOwnership immutable public SEAWATER;

    /**
     * @notice TOKEN_URI to set as the default token URI for every NFT
     * @dev immutable in practice (not set anywhere)
     */
    string public TOKEN_URI;

    /// @notice name of the NFT, set by the constructor
    string public name;

    /// @notice symbol of the NFT, set during the constructor
    string public symbol;

    /// @notice getApproved that can spend the id of the tokens given
    mapping(uint256 => address) public getApproved;

    mapping(address => mapping(address => bool)) public isApprovedForAll;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _tokenURI,
        ISeawaterOwnership _seawater
    ) {
        name = _name;
        symbol = _symbol;
        TOKEN_URI = _tokenURI;
        SEAWATER = _seawater;
    }

    /**
     * @notice ownerOf a NFT given by looking it up with the tracked Seawater contract
     * @param _tokenId to look up
     */
    function ownerOf(uint256 _tokenId) public view returns (address) {
        return SEAWATER.ownerOf(_tokenId);
    }

    /**
     * @notice _onTransferReceived by calling the callback in the
     *         recipient if they have codesize > 0
     */
    function _onTransferReceived(
        address _operator,
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        if (_to.code.length == 0) return;

        bytes4 data = IERC721TokenReceiver(_to).onERC721Received(
            _operator,
            _from,
            _tokenId,
            ""
        );

        if (data != IERC721TokenReceiver.onERC721Received.selector)
            revert ErrBadERC721Received();
    }

    function _requireAuthorised(address _from, uint256 _tokenId) internal view {
        // revert if the sender is not authorised or the owner
        bool isAllowed =
            msg.sender == _from ||
            isApprovedForAll[_from][msg.sender] ||
            msg.sender == getApproved[_tokenId];

        if (isAllowed) {
            // revert if _from is not the owner
            if (ownerOf(_tokenId) != _from) revert ErrNotAuthorised();
        } else {
            revert ErrNotAuthorised();
        }
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        _requireAuthorised(_from, _tokenId);
        SEAWATER.transfer(_from, _tokenId, _to);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata /* _data */
    ) external payable {
        _transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        _transfer(_from, _to, _tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        _transfer(_from, _to, _tokenId);
        _onTransferReceived(msg.sender, _from, _to, _tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata /* _data */
    ) external payable {
        _transfer(_from, _to, _tokenId);
        _onTransferReceived(msg.sender, _from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable {
        _requireAuthorised(msg.sender, _tokenId);
        getApproved[_tokenId] = _approved;
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        isApprovedForAll[msg.sender][_operator] = _approved;
    }

    function balanceOf(address _spender) external view returns (uint256) {
        return SEAWATER.balanceOf(_spender);
    }

    function tokenURI(uint256 /* _tokenId */) external view returns (string memory) {
        return TOKEN_URI;
    }
}
