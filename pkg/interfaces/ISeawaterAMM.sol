// SPDX-Identifier: MIT
pragma solidity 0.8.16;

interface ISeawaterAMM {
    /// @notice swaps _token for USDC
    /// @param _token the token to swap
    /// @param _amount input amount (token)
    /// @param _minOut the minimum output amount (usdc), reverting if the actual output is lower
    /// @return amount of usdc out
    function swapIn(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) external returns (int256, int256);

    /// @notice swaps USDC for _token
    /// @param _token the token to swap
    /// @param _amount input amount (usdc)
    /// @param _minOut the minimum output amount (token), reverting if the actual output is lower
    /// @return amount of token out
    function swapOut(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) external returns (int256, int256);

    /// @notice raw swap function, implements the uniswap v3 interface
    function swap(
        address _token,
        bool _zeroForOne,
        int256 _amount,
        uint256 _priceLimitX96
    ) external returns (int256, int256);

    /// @notice swaps tokenA for tokenB
    /// @param _tokenA the input token
    /// @param _tokenB the output token
    /// @param _amount input amount (tokenA)
    /// @param _minOut the minimum output amount (tokenB), reverting if the actual output is lower
    /// @return amount of token A in, amount of token B out
    function swap2ExactIn(
        address _tokenA,
        address _tokenB,
        uint256 _amount,
        uint256 _minOut
    ) external returns (uint256, uint256);

    //function burn(uint8 poolId) external returns (uint112 burned);
    //function mint(uint8 poolId) external returns (uint112 minted);
}
