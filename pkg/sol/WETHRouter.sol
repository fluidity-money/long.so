// SPDX-Identifier: MIT

pragma solidity 0.8.16;

import "./ISeawaterAMM.sol";
import "./IWETH10.sol";

contract WETHRouter {
    IWETH10 immutable WETH;
    ISeawaterAMM immutable SEAWATER;

    constructor(IWETH10 _weth, ISeawaterAMM _amm) {
        WETH = _weth;
        SEAWATER = _amm;
    }

    function swapIn32502CA71(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) external returns (int256, int256) {

    }

    function swapOut5E08A399(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) external returns (int256, int256) {

    }

    function swap2ExactInED91BB1D(
        address _tokenA,
        address _tokenB,
        uint256 _amount,
        uint256 _minOut
    ) external returns (uint256, uint256) {

    }
}
