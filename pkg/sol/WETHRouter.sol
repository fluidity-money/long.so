// SPDX-Identifier: MIT

pragma solidity 0.8.16;

import "./IERC20.sol";
import "./ISeawaterAMM.sol";
import "./IWETH10.sol";

contract WETHRouter {
    IERC20 immutable FUSDC;
    IWETH10 immutable WETH;
    ISeawaterAMM immutable SEAWATER;

    constructor(IERC20 _fusdc, IWETH10 _weth, ISeawaterAMM _amm) {
        FUSDC = _fusdc;
        WETH = _weth;
        SEAWATER = _amm;
        FUSDC.approve(address(SEAWATER), type(uint256).max);
        WETH.approve(address(SEAWATER), type(uint256).max);
    }

    function swapIn32502CA71(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) external payable returns (int256, int256) {
        require(_token == address(0), "not eth");
        WETH.deposit{value: msg.value}();
        (int256 amount0, int256 amount1) =
            SEAWATER.swapIn32502CA71(address(WETH), _amount, _minOut);
        FUSDC.transfer(msg.sender, uint256(amount0));
        uint256 leftover = WETH.balanceOf(address(this));
        if (leftover > 0) {
            WETH.withdrawTo(payable(msg.sender), leftover);
        }
        return (amount0, amount1);
    }

    function swapOut5E08A399(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) external payable returns (int256, int256) {
        require(_token == address(0), "not eth");
        FUSDC.transferFrom(msg.sender, address(this), _amount);
        (int256 amount0, int256 amount1) =
            SEAWATER.swapOut5E08A399(address(WETH), _amount, _minOut);
        WETH.withdrawTo(payable(msg.sender), uint256(amount0));
        FUSDC.transferFrom(msg.sender, address(this), FUSDC.balanceOf(address(this)));
        return (amount0, amount1);
    }

    function _swap2ExactInWeth(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) internal returns (uint256 amountA, uint256 amountB) {
        WETH.deposit{value: msg.value}();
        (amountA, amountB) = SEAWATER.swap2ExactInED91BB1D(
            address(WETH),
            _token,
            _amount,
            _minOut
        );
        IERC20(_token).transfer(msg.sender, amountB);
        uint256 wethOut = WETH.balanceOf(address(this));
        if (wethOut > 0) WETH.withdrawTo(payable(msg.sender), wethOut);
        return (amountA, amountB);
    }

    function _swap2ExactOutWeth(
        address _token,
        uint256 _amount,
        uint256 _minOut
    ) internal returns (uint256 amountA, uint256 amountB) {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        (amountA, amountB) = SEAWATER.swap2ExactInED91BB1D(
            _token,
            address(WETH),
            _amount,
            _minOut
        );
        WETH.withdrawTo(payable(msg.sender), amountB);
        uint256 tokenOut = IERC20(_token).balanceOf(address(this));
        if (tokenOut > 0) IERC20(_token).transfer(msg.sender, tokenOut);
        return (amountA, amountB);
    }

    function swap2ExactInED91BB1D(
        address _tokenA,
        address _tokenB,
        uint256 _amount,
        uint256 _minOut
    ) external payable returns (uint256, uint256) {
        if (_tokenA == address(0))
            return _swap2ExactInWeth(_tokenB, _amount, _minOut);
        else if (_tokenB == address(0))
            return _swap2ExactOutWeth(_tokenA, _amount, _minOut);
        else
            revert("not eth");
    }
}
