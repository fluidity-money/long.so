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

        (bool success, bytes memory data) = _getExecutorAdmin().delegatecall(abi.encodeCall(
            ISeawaterExecutorAdmin.ctor,
            (fusdc, seawaterAdmin, nftManager)
        ));
        require(success, string(data));
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

    // ends execution!
    function directDelegate(address to) internal {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), to, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    // admin functions

    function init(
        address /* token */,
        uint256 /* sqrtPriceX96 */,
        uint32 /* fee */,
        uint8 /* tickSpacing */,
        uint128 /* maxLiquidityPerTick */
    ) external {
        directDelegate(_getExecutorAdmin());
    }

    function collectProtocol(
        address /* pool */,
        uint128 /* amount0 */,
        uint128 /* amount1 */
    ) external returns (uint128, uint128) {
        directDelegate(_getExecutorAdmin());
    }

    // swap functions

    /// @inheritdoc ISeawaterAMM
    function swapIn(address token, uint256 amountIn, uint256 minOut) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwap().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwap.swap,
            (
                token,
                true,
                int256(amountIn),
                type(uint256).max
            )
        ));
        require(success, string(data));

        (int256 swapAmountIn, int256 swapAmountOut) = abi.decode(data, (int256, int256));
        require(swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    /// @inheritdoc ISeawaterAMM
    function swapOut(address token, uint256 amountIn, uint256 minOut) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwap().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwap.swap,
            (
                token,
                false,
                int256(amountIn),
                type(uint256).max
            )
        ));
        require(success, string(data));

        (int256 swapAmountIn, int256 swapAmountOut) = abi.decode(data, (int256, int256));
        require(swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    /// @inheritdoc ISeawaterAMM
    function swap(address /* pool */, bool /* zeroForOne */, int256 /* amount */, uint256 /* priceLimit */) external returns (int256, int256) {
        directDelegate(_getExecutorSwap());
    }

    /// @inheritdoc ISeawaterAMM
    function swap2ExactIn(address /* tokenA */, address /* tokenB */, uint256 /* amountIn */, uint256 /* minAmountOut */) external returns (uint256, uint256) {
        directDelegate(_getExecutorSwap());
    }

    // position functions

    function mintPosition(address /* token */, int32 /* lower */, int32 /* upper */) external returns (uint256 /* id */) {
        directDelegate(_getExecutorPosition());
    }

    function burnPosition(uint256 /* id */) external {
        directDelegate(_getExecutorPosition());
    }

    function positionOwner(uint256 /* id */) external returns (address) {
        directDelegate(_getExecutorPosition());
    }

    // called by the position manager contract!!
    function transferPosition(uint256 /* id */, address /* from */, address /* to */) external {
        directDelegate(_getExecutorPosition());
    }

    function positionBalance(address /* user */) external returns (uint256) {
        directDelegate(_getExecutorPosition());
    }

    function updatePosition(
        address pool,
        uint256 id,
        int128 delta
    ) external returns (int256, int256) {
        directDelegate(_getExecutorPosition());
    }

    function collect(
        address pool,
        uint256 id,
        uint128 amount0,
        uint128 amount1
    ) external returns (uint128, uint128) {
        directDelegate(_getExecutorPosition());
    }

    // fallback!
    fallback() external {
        revert("fallback function!");
    }

    // internal functions

    // proxy storage manipulators

    function _getExecutorSwap() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_SWAP_SLOT).value;
    }
    function _getExecutorPosition() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_POSITION_SLOT).value;
    }
    function _getExecutorAdmin() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_ADMIN_SLOT).value;
    }
    function _getExecutorFallback() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_FALLBACK_SLOT).value;
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
