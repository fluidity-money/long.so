// SPDX-Identifier: MIT
pragma solidity 0.8.16;

interface ISeawaterAMM {
    function swapIn(
        address _token,
        uint256 _amount,
        uint256 _limit
    ) external returns (uint256);

    function swapOut(
        address _token,
        uint256 _amount,
        uint256 _limit
    ) external returns (uint256);

    function swap2(
        address _tokenA,
        address _tokenB,
        uint256 _amount,
        uint256 _limit
    ) external returns (uint256);

    function burn(uint8 poolId) external returns (uint112 burned);
    function mint(uint8 poolId) external returns (uint112 minted);
}
