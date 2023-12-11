// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "../interfaces/ISeawaterExecutors.sol";
import "../interfaces/ISeawaterAMM.sol";

// slots to store proxy data in
// these are calculated as keccak()-1 to avoid collisions
bytes32 constant EXECUTOR_SWAP_SLOT = bytes32(uint256(keccak256("seawater.impl.swap")) - 1);
bytes32 constant EXECUTOR_SWAP_PERMIT2_SLOT = bytes32(uint256(keccak256("seawater.impl.swap_permit2")) - 1);
bytes32 constant EXECUTOR_POSITION_SLOT = bytes32(uint256(keccak256("seawater.impl.position")) - 1);
bytes32 constant EXECUTOR_UPDATE_POSITION_SLOT = bytes32(uint256(keccak256("seawater.impl.update_position")) - 1);
bytes32 constant EXECUTOR_ADMIN_SLOT = bytes32(uint256(keccak256("seawater.impl.admin")) - 1);
bytes32 constant EXECUTOR_FALLBACK_SLOT = bytes32(uint256(keccak256("seawater.impl.fallback")) - 1);

bytes32 constant PROXY_ADMIN_SLOT = bytes32(uint256(keccak256("seawater.role.proxy.admin")) - 1);

// seawater admin / nft admin are stored in normal storage slots

// arbitrary storage slot access code borrowed from openzeppelin
library StorageSlot {
    struct AddressSlot {
        address value;
    }
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

    /// @notice constructor function, sets proxy details and then forwards to the seawater initialiser
    /// @param _proxyAdmin the admin that can control proxy functions (change addresses)
    /// @param _seawaterAdmin the admin of the AMM
    /// @param _nftManager the account that can transfer position NFTs
    /// @param _executorSwap the deployed code for the swap executor
    /// @param _executorPosition the deployed code for the positions executor
    /// @param _executorAdmin the deployed code for the admin executor
    /// @param _executorFallback an address that functions not matching a specific executor get set to
    constructor(
        address _proxyAdmin,
        address _seawaterAdmin,
        address _nftManager,
        ISeawaterExecutorSwap _executorSwap,
        ISeawaterExecutorSwapPermit2 _executorSwapPermit2,
        ISeawaterExecutorPosition _executorPosition,
        ISeawaterExecutorUpdatePosition _executorUpdatePosition,
        ISeawaterExecutorAdmin _executorAdmin,
        ISeawaterExecutorFallback _executorFallback
    ) {
        _setProxyAdmin(_proxyAdmin);
        _setProxies(
            _executorSwap,
            _executorSwapPermit2,
            _executorPosition,
            _executorUpdatePosition,
            _executorAdmin,
            _executorFallback
        );

        (bool success, bytes memory data) = _getExecutorAdmin().delegatecall(abi.encodeCall(
            ISeawaterExecutorAdmin.ctor,
            (_seawaterAdmin, _nftManager)
        ));
        // the string() cast here is just for typechecking, `data` is essentially arbitrary
        require(success, string(data));
    }

    // proxy functions

    /// @notice updates the proxy admin. only usable by the proxy admin
    /// @param newAdmin the new proxy admin to set
    function updateProxyAdmin(address newAdmin) public onlyProxyAdmin {
        _setProxyAdmin(newAdmin);
    }

    /// @notice updates the addresses of the executors. only usable by the proxy admin
    /// @param executorSwap the address of the swap executor
    /// @param executorPosition the address of the position executor
    /// @param executorAdmin the address of the admin executor
    /// @param executorFallback the address of the fallback executor
    function updateExecutors(
        ISeawaterExecutorSwap executorSwap,
        ISeawaterExecutorSwapPermit2 executorSwapPermit2,
        ISeawaterExecutorPosition executorPosition,
        ISeawaterExecutorUpdatePosition executorUpdatePosition,
        ISeawaterExecutorAdmin executorAdmin,
        ISeawaterExecutorFallback executorFallback
    ) public onlyProxyAdmin {
        _setProxies(executorSwap, executorSwapPermit2, executorPosition, executorUpdatePosition, executorAdmin, executorFallback);
    }

    // seawater delegates

    // call a function with the same name and calldata on another contract
    // this ends execution!
    // proxy implementation adapted from openzeppelin
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

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function createPool(
        address /* token */,
        uint256 /* sqrtPriceX96 */,
        uint32 /* fee */,
        uint8 /* tickSpacing */,
        uint128 /* maxLiquidityPerTick */
    ) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function collectProtocol(
        address /* pool */,
        uint128 /* amount0 */,
        uint128 /* amount1 */
    ) external returns (uint128, uint128) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function setPoolEnabled(
        address /* pool */,
        bool /* enabled */
    ) external {
        directDelegate(_getExecutorAdmin());
    }

    // swap functions

    /// @inheritdoc ISeawaterExecutorSwap
    function swap(address /* pool */, bool /* zeroForOne */, int256 /* amount */, uint256 /* priceLimit */) external returns (int256, int256) {
        directDelegate(_getExecutorSwap());
    }

    /// @inheritdoc ISeawaterExecutorSwapPermit2
    function swapPermit2(
        address /* pool */,
        bool /* zeroForOne */,
        int256 /* amount */,
        uint256 /* priceLimit */,
        uint256 /* nonce */,
        uint256 /* deadline */,
        uint256 /* maxAmount */,
        bytes memory /* sig */
    ) external returns (int256, int256) {
        directDelegate(_getExecutorSwapPermit2());
    }

    /// @inheritdoc ISeawaterExecutorSwap
    function swap2ExactIn(address /* tokenA */, address /* tokenB */, uint256 /* amountIn */, uint256 /* minAmountOut */) external returns (uint256, uint256) {
        directDelegate(_getExecutorSwap());
    }

    /// @inheritdoc ISeawaterExecutorSwapPermit2
    function swap2ExactInPermit2(
        address /* from */,
        address /* to */,
        uint256 /* amount */,
        uint256 /* minOut */,
        uint256 /* nonce */,
        uint256 /* deadline */,
        bytes memory /* sig */
    ) external returns (uint256, uint256) {
        directDelegate(_getExecutorSwapPermit2());
    }

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
        // this contract uses checked arithmetic, this negate can revert
        require(-swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    /// @inheritdoc ISeawaterAMM
    function swapInPermit2(address token, uint256 amountIn, uint256 minOut, uint256 nonce, uint256 deadline, uint256 maxAmount, bytes memory sig) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwapPermit2().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwapPermit2.swapPermit2,
            (
                token,
                true,
                int256(amountIn),
                type(uint256).max,
                nonce,
                deadline,
                maxAmount,
                sig
            )
        ));
        require(success, string(data));

        (int256 swapAmountIn, int256 swapAmountOut) = abi.decode(data, (int256, int256));
        // this contract uses checked arithmetic, this negate can revert
        require(-swapAmountOut >= int256(minOut), "min out not reached!");
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
    function swapOutPermit2(address token, uint256 amountIn, uint256 minOut, uint256 nonce, uint256 deadline, uint256 maxAmount, bytes memory sig) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwapPermit2().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwapPermit2.swapPermit2,
            (
                token,
                false,
                int256(amountIn),
                type(uint256).max,
                nonce,
                deadline,
                maxAmount,
                sig
            )
        ));
        require(success, string(data));

        (int256 swapAmountIn, int256 swapAmountOut) = abi.decode(data, (int256, int256));
        require(swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    // position functions

    /// @inheritdoc ISeawaterExecutorPosition
    function mintPosition(address /* token */, int32 /* lower */, int32 /* upper */) external {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function burnPosition(uint256 /* id */) external {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionOwner(uint256 /* id */) external returns (address) {
        directDelegate(_getExecutorPosition());
    }

    // called by the position manager contract!!
    /// @inheritdoc ISeawaterExecutorPosition
    function transferPosition(uint256 /* id */, address /* from */, address /* to */) external {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionBalance(address /* user */) external returns (uint256) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionLiquidity(address /* pool */, uint256 /* id */) external returns (uint128) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function collect(
        address /* pool */,
        uint256 /* id */,
        uint128 /* amount0 */,
        uint128 /* amount1 */
    ) external returns (uint128, uint128) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorUpdatePosition
    function updatePosition(
        address /* pool */,
        uint256 /* id */,
        int128 /* delta */
    ) external returns (int256, int256) {
        directDelegate(_getExecutorUpdatePosition());
    }

    /// @inheritdoc ISeawaterExecutorUpdatePosition
    function updatePositionPermit2(
        address /* pool */,
        uint256 /* id */,
        int128 /* delta */,
        uint256 /* nonce0 */,
        uint256 /* deadline0 */,
        uint256 /* maxAmount0 */,
        bytes memory /* sig0 */,
        uint256 /* nonce1 */,
        uint256 /* deadline1 */,
        uint256 /* maxAmount1 */,
        bytes memory /* sig1 */
    ) external returns (int256, int256) {
        directDelegate(_getExecutorUpdatePosition());
    }

    // fallback!
    fallback() external {
        // this will revert if the fallback executor is not set!
        directDelegate(_getExecutorFallback());
    }

    // internal functions

    // proxy storage manipulators

    function _getExecutorSwap() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_SWAP_SLOT).value;
    }
    function _getExecutorSwapPermit2() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_SLOT).value;
    }
    function _getExecutorPosition() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_POSITION_SLOT).value;
    }
    function _getExecutorUpdatePosition() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_UPDATE_POSITION_SLOT).value;
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
        ISeawaterExecutorSwapPermit2 executorSwapPermit2,
        ISeawaterExecutorPosition executorPosition,
        ISeawaterExecutorUpdatePosition executorUpdatePosition,
        ISeawaterExecutorAdmin executorAdmin,
        ISeawaterExecutorFallback executorFallback
    ) internal {
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_SLOT).value = address(executorSwap);
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_SLOT).value = address(executorSwapPermit2);
        StorageSlot.getAddressSlot(EXECUTOR_POSITION_SLOT).value = address(executorPosition);
        StorageSlot.getAddressSlot(EXECUTOR_UPDATE_POSITION_SLOT).value = address(executorUpdatePosition);
        StorageSlot.getAddressSlot(EXECUTOR_ADMIN_SLOT).value = address(executorAdmin);
        StorageSlot.getAddressSlot(EXECUTOR_FALLBACK_SLOT).value = address(executorFallback);
    }
}
