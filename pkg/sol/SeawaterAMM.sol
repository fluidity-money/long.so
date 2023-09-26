// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "../interfaces/ISeawaterExecutors.sol";
import "../interfaces/ISeawaterAMM.sol";

bytes32 constant EXECUTOR_SWAP_SLOT = bytes32(uint256(keccak256("seawater.impl.swap")) - 1);
bytes32 constant EXECUTOR_POSITION_SLOT = bytes32(uint256(keccak256("seawater.impl.position")) - 1);
bytes32 constant EXECUTOR_ADMIN_SLOT = bytes32(uint256(keccak256("seawater.impl.admin")) - 1);
bytes32 constant EXECUTOR_FALLBACK_SLOT = bytes32(uint256(keccak256("seawater.impl.fallback")) - 1);

bytes32 constant PROXY_ADMIN_SLOT = bytes32(uint256(keccak256("seawater.role.proxy.admin")) - 1);

// seawater admin / nft admin are stored in normal storage slots

library StorageSlot {
    struct AddressSlot {
        address value;
    }
    // borrowed from openzeppelin
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }
}

contract SeawaterAMM is ISeawaterAMM {
    modifier onlyProxyAdmin {
        require(
            msg.sender == StorageSlot.getAddressSlot(PROXY_ADMIN_SLOT).value,
            "only proxy admin"
        );
        _;
    }

    constructor(
        address proxyAdmin,
        address seawaterAdmin,
        address nftManager,
        ISeawaterExecutorSwap executorSwap,
        ISeawaterExecutorPosition executorPosition,
        ISeawaterExecutorAdmin executorAdmin,
        ISeawaterExecutorFallback executorFallback,
        address fusdc
    ) {
        _setProxyAdmin(proxyAdmin);
        _setProxies(
            executorSwap,
            executorPosition,
            executorAdmin,
            executorFallback
        );

        executorAdmin.ctor(fusdc, seawaterAdmin, nftManager);
    }

    // proxy functions

    function updateProxyAdmin(address newAdmin) public onlyProxyAdmin {
        _setProxyAdmin(newAdmin);
    }

    function updateExecutors(
        ISeawaterExecutorSwap executorSwap,
        ISeawaterExecutorPosition executorPosition,
        ISeawaterExecutorAdmin executorAdmin,
        ISeawaterExecutorFallback executorFallback
    ) public onlyProxyAdmin {
        _setProxies(executorSwap, executorPosition, executorAdmin, executorFallback);
    }

    // seawater delegates

    // swap functions

    /// @inheritdoc ISeawaterAMM
    function swapIn(address token, uint256 amountIn, uint256 minOut) external returns (int256, int256) {
        (int256 swapAmountIn, int256 swapAmountOut) = _getExecutorSwap().swap(
            token,
            true, // zero for one
            int256(amountIn),
            type(uint256).max
        );
        require(swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    /// @inheritdoc ISeawaterAMM
    function swapOut(address token, uint256 amountIn, uint256 minOut) external returns (int256, int256) {
        (int256 swapAmountIn, int256 swapAmountOut) = _getExecutorSwap().swap(
            token,
            false, // one for zero
            int256(amountIn),
            type(uint256).max
        );
        require(swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    /// @inheritdoc ISeawaterAMM
    function swap(address pool, bool zeroForOne, int256 amount, uint256 priceLimit) external returns (int256, int256) {
        return _getExecutorSwap().swap(
            pool,
            zeroForOne,
            amount,
            priceLimit
        );
    }

    /// @inheritdoc ISeawaterAMM
    function swap2(address tokenA, address tokenB, uint256 amountIn, uint256 minAmountOut) external returns (uint256, uint256) {
        return _getExecutorSwap().swap2ExactIn(
            tokenA,
            tokenB,
            amountIn,
            minAmountOut
        );
    }

    // position functions

    function mint(address token, int32 lower, int32 upper) external returns (uint256 id) {
        return _getExecutorPosition().mint(token, lower, upper);
    }

    function burn(uint256 id) external {
        _getExecutorPosition().burn(id);
    }

    function ownerOf(uint256 id) external {
        return _getExecutorPosition().positionOwner(id);
    }

    // called by the position manager contract!!
    function transfer(uint256 tokenId, address from, address to) external {
        _getExecutorPosition().transferPosition(id, from, to);
    }

    function balanceOf(address user) external view returns (uint256) {
        return _getExecutorPosition().positionBalance(user);
    }

    // internal functions

    // proxy storage manipulators

    function _getExecutorSwap() internal view returns (ISeawaterExecutorSwap) {
        return ISeawaterExecutorSwap(StorageSlot.getAddressSlot(EXECUTOR_SWAP_SLOT).value);
    }
    function _getExecutorPosition() internal view returns (ISeawaterExecutorPosition) {
        return ISeawaterExecutorPosition(StorageSlot.getAddressSlot(EXECUTOR_POSITION_SLOT).value);
    }
    function _getExecutorAdmin() internal view returns (ISeawaterExecutorAdmin) {
        return ISeawaterExecutorAdmin(StorageSlot.getAddressSlot(EXECUTOR_ADMIN_SLOT).value);
    }
    function _getExecutorFallback() internal view returns (ISeawaterExecutorFallback) {
        return ISeawaterExecutorFallback(StorageSlot.getAddressSlot(EXECUTOR_FALLBACK_SLOT).value);
    }

    function _setProxyAdmin(address newAdmin) internal {
        StorageSlot.getAddressSlot(PROXY_ADMIN_SLOT).value = newAdmin;
    }

    function _setProxies(
        ISeawaterExecutorSwap executorSwap,
        ISeawaterExecutorPosition executorPosition,
        ISeawaterExecutorAdmin executorAdmin,
        ISeawaterExecutorFallback executorFallback
    ) internal {
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_SLOT).value = address(executorSwap);
        StorageSlot.getAddressSlot(EXECUTOR_POSITION_SLOT).value = address(executorPosition);
        StorageSlot.getAddressSlot(EXECUTOR_ADMIN_SLOT).value = address(executorAdmin);
        StorageSlot.getAddressSlot(EXECUTOR_FALLBACK_SLOT).value = address(executorFallback);
    }
}
