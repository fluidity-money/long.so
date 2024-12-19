// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "./ISeawaterExecutors.sol";

import "./ISeawaterAMM.sol";

// slots to store proxy data in
// these are calculated as keccak()-1 to avoid collisions

/// @dev
bytes32 constant EXECUTOR_SWAP_A_SLOT = bytes32(uint256(keccak256("seawater.impl.swap.a")) - 1);

/// @dev 0x918729dd8afb81fac3242345361976256d4c1121ed7c3b67e14c9e3fd9e750e2
bytes32 constant EXECUTOR_SWAP_PERMIT2_A_SLOT = bytes32(uint256(keccak256("seawater.impl.swap_permit2.a")) - 1);

/// @dev 0x031aae58aa658a4a607141f8a509c1b56789f013acaf58a8e12eb86456e099e4
bytes32 constant EXECUTOR_QUOTE_SLOT = bytes32(uint256(keccak256("seawater.impl.quote")) - 1);

/// @dev 0x75711a1f12071de4ad9b405fd0234f84fcd9d494050d3a5169de3ad4fd942476
bytes32 constant EXECUTOR_POSITION_SLOT = bytes32(uint256(keccak256("seawater.impl.position")) - 1);

/// @dev 0x81e9c7c70971b5eb969cec21a82e6deed42e7c6736e0e83ced66d72297d9f1d7
bytes32 constant EXECUTOR_UPDATE_POSITION_SLOT = bytes32(uint256(keccak256("seawater.impl.update_position")) - 1);

/// @dev 0x344c13190645d452a52856ca1efc42b3609893d92b93219c8820b76f3aa11288
bytes32 constant EXECUTOR_ADMIN_SLOT = bytes32(uint256(keccak256("seawater.impl.admin")) - 1);

// @dev 0x84832b79e2f14cc21ec33852322168db56993174fe6ed0dafac69e9274466f29
bytes32 constant EXECUTOR_ADJUST_POSITION_A_SLOT = bytes32(uint256(keccak256("seawater.impl.adjust_position.a")) - 1);

// @dev 0x10a2f2b095bd5ec29b64f69f5310eafd27f48856ca81de6a67e374cfe548efa3
bytes32 constant EXECUTOR_ADJUST_POSITION_B_SLOT = bytes32(uint256(keccak256("seawater.impl.adjust_position.b")) - 1);

// @dev 0x5a903794749d4e6d7a8e031428d2a1644bb99ba3d55885eb685244d45ae58a14
bytes32 constant EXECUTOR_SWAP_PERMIT2_B_SLOT = bytes32(uint256(keccak256("seawater.impl.swap_permit2.b")) - 1);

/// @dev
bytes32 constant EXECUTOR_SWAP_B_SLOT = bytes32(uint256(keccak256("seawater.impl.swap.b")) - 1);

/// @dev 0xa77145850668b2edbbe1c458388a99e3dca3d62b8335520225dc4d03b2e2bfe0
bytes32 constant EXECUTOR_FALLBACK_SLOT = bytes32(uint256(keccak256("seawater.impl.fallback")) - 1);

// @dev 0xdfd6b2a695a9a2448c8c317669015a93e35dd154c29d011b7d533ae1dcabc1d5
bytes32 constant PROXY_ADMIN_SLOT = bytes32(uint256(keccak256("seawater.role.proxy.admin")) - 1);

// facets that should be mined for for each executor

uint8 constant EXECUTOR_SWAP_A_DISPATCH = 0;
uint8 constant EXECUTOR_UPDATE_POSITION_DISPATCH = 1;
uint8 constant EXECUTOR_POSITION_DISPATCH = 2;
uint8 constant EXECUTOR_ADMIN_DISPATCH = 3;
uint8 constant EXECUTOR_SWAP_PERMIT2_A_DISPATCH = 4;
uint8 constant EXECUTOR_QUOTES_DISPATCH = 5;
uint8 constant EXECUTOR_ADJUST_POSITION_A_DISPATCH = 6;
uint8 constant EXECUTOR_SWAP_PERMIT2_B_DISPATCH = 7;
uint8 constant EXECUTOR_ADJUST_POSITION_B_DISPATCH = 8;
uint8 constant EXECUTOR_SWAP_B_DISPATCH = 9;

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
    /// @param _executorSwapA the deployed code for the swap executor (swap 1)
    /// @param _executorSwapPermit2A the deployed code for the swap_permit2 executor (facet A)
    /// @param _executorQuote the deployed code for the quote executor
    /// @param _executorPosition the deployed code for the positions executor
    /// @param _executorAdmin the deployed code for the admin executor
    /// @param _executorAdjustPositionsA the deployed code for the adjust positions executor (facet A)
    /// @param _executorSwapPermit2B the deployed code for the swap_permit2 executor (facet B)
    /// @param _executorAdjustPositionsB the deployed code for the adjust positions executor (facet B)
    /// @param _executorSwapB the deployed code for the swap executor (swap 2)
    /// @param _executorFallback an address that functions not matching a specific executor get set to
    constructor(
        address _proxyAdmin,
        address _seawaterAdmin,
        address _nftManager,
        address _emergencyCouncil,
        ISeawaterExecutorSwapA _executorSwapA,
        ISeawaterExecutorSwapPermit2A _executorSwapPermit2A,
        ISeawaterExecutorQuote _executorQuote,
        ISeawaterExecutorPosition _executorPosition,
        ISeawaterExecutorUpdatePosition _executorUpdatePosition,
        ISeawaterExecutorAdmin _executorAdmin,
        ISeawaterExecutorAdjustPositionA _executorAdjustPositionsA,
        ISeawaterExecutorSwapPermit2B _executorSwapPermit2B,
        ISeawaterExecutorAdjustPositionB _executorAdjustPositionsB,
        ISeawaterExecutorSwapB _executorSwapB,
        ISeawaterExecutorFallback _executorFallback
    ) {
        _setProxyAdmin(_proxyAdmin);
        _setProxies(
            _executorSwapA,
            _executorSwapPermit2A,
            _executorQuote,
            _executorPosition,
            _executorUpdatePosition,
            _executorAdmin,
            _executorAdjustPositionsA,
            _executorSwapPermit2B,
            _executorAdjustPositionsB,
            _executorSwapB,
            _executorFallback
        );

        (bool success, bytes memory data) = _getExecutorAdmin().delegatecall(abi.encodeCall(
            ISeawaterExecutorAdmin.ctor,
            (_seawaterAdmin, _nftManager, _emergencyCouncil)
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
    function createPool653F395E(
        address /* token */,
        uint256 /* sqrtPriceX96 */,
        uint32 /* fee */
    ) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function collectProtocol7540FA9F(
        address /* pool */,
        uint128 /* amount0 */,
        uint128 /* amount1 */,
        address /* recipient */
    ) external returns (uint128, uint128) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function enablePool579DA658(
        address /* pool */,
        bool /* enabled */
    ) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function authoriseEnabler5B17C274(
        address /* enabler */,
        bool /* enabled */
    ) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function setSqrtPriceFF4DB98C(address /* pool */, uint256 /* price */) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function setFeeProtocolCBD3EC35(address /* pool */, uint8 /* feeProtocol0 */, uint8 /* feeProtocol1 */) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function updateNftManager9BDF41F6(address /* manager */) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function updateSeawaterAdminD25D364D(address /* operator */) external {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function updateEmergencyCouncil7D0C1C58(address /* council */) external {
        directDelegate(_getExecutorAdmin());
    }

    // swap functions

    /// @inheritdoc ISeawaterExecutorSwapA
    function swap904369BE(
        address /* pool */,
        bool /* zeroForOne */,
        int256 /* amount */,
        uint256 /* priceLimit */
    ) external returns (int256, int256) {
        directDelegate(_getExecutorSwapA());
    }

    /// @inheritdoc ISeawaterExecutorQuote
    function quote72E2ADE7(
        address /* pool */,
        bool /* zeroForOne */,
        int256 /* amount */,
        uint256 /* priceLimit */
    ) external {
        directDelegate(_getExecutorQuote());
    }

    /// @inheritdoc ISeawaterExecutorQuote
    function quote2CD06B86E(
        address /* from */,
        address /* to */,
        uint256 /* amount */,
        uint256 /* minOut*/
    ) external {
        directDelegate(_getExecutorQuote());
    }

    /// @inheritdoc ISeawaterExecutorSwapPermit2A
    function swapPermit2EE84AD91(
        address /* pool */,
        bool /* zeroForOne */,
        int256 /* amount */,
        uint256 /* priceLimit */,
        uint256 /* nonce */,
        uint256 /* deadline */,
        uint256 /* maxAmount */,
        bytes memory /* sig */
    ) external returns (int256, int256) {
        directDelegate(_getExecutorSwapPermit2A());
    }

    /// @inheritdoc ISeawaterExecutorSwapPermit2B
    function swap2ExactInPermit254A7DBB1(
        address /* from */,
        address /* to */,
        uint256 /* amount */,
        uint256 /* minOut */,
        uint256 /* nonce */,
        uint256 /* deadline */,
        bytes memory /* sig */
    ) external returns (uint256, uint256) {
        directDelegate(_getExecutorSwapPermit2B());
    }

    /// @inheritdoc ISeawaterExecutorSwapB
    function swap2ExactIn41203F1D(
        address /* tokenA */,
        address /* tokenB */,
        uint256 /* amountIn */,
        uint256 /* minAmountOut */
    ) external returns (uint256, uint256) {
        directDelegate(_getExecutorSwapB());
    }

    /// @inheritdoc ISeawaterAMM
    function swapIn32502CA71(
        address token,
        uint256 amountIn,
        uint256 minOut
    ) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwapA().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwapA.swap904369BE,
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
    function swapInPermit2CEAAB576(
        address token,
        uint256 amountIn,
        uint256 minOut,
        uint256 nonce,
        uint256 deadline,
        uint256 maxAmount,
        bytes memory sig
    ) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwapPermit2A().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwapPermit2A.swapPermit2EE84AD91,
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
    function swapOut5E08A399(
        address token,
        uint256 amountIn,
        uint256 minOut
    ) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwapA().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwapA.swap904369BE,
            (
                token,
                false,
                int256(amountIn),
                type(uint256).max
            )
        ));
        require(success, string(data));

        (int256 swapAmountOut, int256 swapAmountIn) = abi.decode(data, (int256, int256));
        require(swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    /// @inheritdoc ISeawaterAMM
    function swapOutPermit23273373B(
        address token,
        uint256 amountIn,
        uint256 minOut,
        uint256 nonce,
        uint256 deadline,
        uint256 maxAmount,
        bytes memory sig
    ) external returns (int256, int256) {
        (bool success, bytes memory data) = _getExecutorSwapPermit2A().delegatecall(abi.encodeCall(
            ISeawaterExecutorSwapPermit2A.swapPermit2EE84AD91,
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

        (int256 swapAmountOut, int256 swapAmountIn) = abi.decode(data, (int256, int256));
        require(swapAmountOut >= int256(minOut), "min out not reached!");
        return (swapAmountIn, swapAmountOut);
    }

    // position functions

    /// @inheritdoc ISeawaterExecutorPosition
    function mintPositionBC5B086D(
        address /* token */,
        int32 /* lower */,
        int32 /* upper */
    ) external returns (uint256 /* id */) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionOwnerD7878480(uint256 /* id */) external returns (address) {
        directDelegate(_getExecutorPosition());
    }

    // called by the position manager contract!!
    /// @inheritdoc ISeawaterExecutorPosition
    function transferPositionEEC7A3CD(
        uint256 /* id */,
        address /* from */,
        address /* to */
    ) external {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionBalance4F32C7DB(address /* user */) external returns (uint256) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionLiquidity8D11C045(
        address /* pool */,
        uint256 /* id */
    ) external returns (uint128) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionTickLower2F77CCE1(
        address /* pool */,
        uint256 /* id */
    ) external returns (int32) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function positionTickUpper67FD55BA(
        address /* pool */,
        uint256 /* id */
    ) external returns (int32) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function sqrtPriceX967B8F5FC5(address /* pool */) external returns (uint256) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function feesOwed22F28DBD(
        address /* pool */,
        uint256 /* position */
    ) external returns (uint128, uint128) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function curTick181C6FD9(address /* pool */) external returns (int32) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function tickSpacing653FE28F(address /* pool */) external returns (uint8) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function feeBB3CF608(address /* pool */) external returns (uint32) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function feeGrowthGlobal038B5665B(address /* pool */) external returns (uint256) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorAdminExposed
    function feeGrowthGlobal1A33A5A1B(address /*pool */) external returns (uint256) {
        directDelegate(_getExecutorAdmin());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function collectSingleTo6D76575F(
        address /* pool */,
        uint256 /* id */,
        address /* recipient */
    ) external returns (uint128, uint128) {
        directDelegate(_getExecutorPosition());
    }

    /// @inheritdoc ISeawaterExecutorPosition
    function collect7F21947C(
        address[] memory pools,
        uint256[] memory ids
    ) external returns (CollectResult[] memory results) {
        results = new CollectResult[](pools.length);
        for (uint i = 0; i < pools.length; ++i) {
            (bool success, bytes memory data) = _getExecutorPosition().delegatecall(abi.encodeCall(
                ISeawaterExecutorPosition.collectSingleTo6D76575F,
                (pools[i], ids[i], msg.sender)
            ));
            require(success, string(data));
            (uint128 amount0, uint128 amount1) = abi.decode(data, (uint128, uint128));
            results[i] = CollectResult({
                amount0: amount0,
                amount1: amount1
            });
        }
        return results;
    }

    /// @inheritdoc ISeawaterExecutorUpdatePosition
    function updatePositionC7F1F740(
        address /* pool */,
        uint256 /* id */,
        int128 /* delta */
    ) external returns (int256, int256) {
        directDelegate(_getExecutorUpdatePosition());
    }

    /// @inheritdoc ISeawaterExecutorAdjustPositionA
    function incrPositionE2437399(
        address /* pool */,
        uint256 /* id */,
        uint256 /* amount0Min */,
        uint256 /* amount1Min */,
        uint256 /* amount0Desired */,
        uint256 /* amount1Desired */
    ) external returns (uint256, uint256) {
        directDelegate(_getExecutorAdjustPositionA());
    }

    /// @inheritdoc ISeawaterExecutorAdjustPositionB
    function decrPosition9A7D32E2(
        address /* pool */,
        uint256 /* id */,
        uint256 /* amount0Min */,
        uint256 /* amount1Min */,
        uint256 /* amount0Desired */,
        uint256 /* amount1Desired */
    ) external returns (uint256, uint256) {
        directDelegate(_getExecutorAdjustPositionB());
    }

    function setExecutorSwapA(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_A_SLOT).value = a;
    }
    function setExecutorSwapPermit2A(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_A_SLOT).value = a;
    }
    function setExecutorQuote(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_QUOTE_SLOT).value = a;
    }
    function setExecutorPosition(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_POSITION_SLOT).value = a;
    }
    function setExecutorUpdatePosition(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_UPDATE_POSITION_SLOT).value = a;
    }
    function setExecutorAdmin(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_ADMIN_SLOT).value = a;
    }
    function setExecutorAdjustPositionA(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_ADJUST_POSITION_A_SLOT).value = a;
    }
    function setExecutorSwapPermit2B(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_B_SLOT).value = a;
    }
    function setExecutorSwapB(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_B_SLOT).value = a;
    }
    function setExecutorFallback(address a) external onlyProxyAdmin {
        StorageSlot.getAddressSlot(EXECUTOR_FALLBACK_SLOT).value = a;
    }

    // fallback to one of the features in lib.rs. The name of the wasm file corresponds to them.
    fallback() external {
        if (uint8(msg.data[2]) == EXECUTOR_SWAP_A_DISPATCH)
            directDelegate(_getExecutorSwapA());
        else if (uint8(msg.data[2]) == EXECUTOR_UPDATE_POSITION_DISPATCH)
            directDelegate(_getExecutorUpdatePosition());
        else if (uint8(msg.data[2]) == EXECUTOR_POSITION_DISPATCH)
            directDelegate(_getExecutorPosition());
        else if (uint8(msg.data[2]) == EXECUTOR_ADMIN_DISPATCH)
            directDelegate(_getExecutorAdmin());
        else if (uint8(msg.data[2]) == EXECUTOR_SWAP_PERMIT2_A_DISPATCH)
            directDelegate(_getExecutorSwapPermit2A());
        else if (uint8(msg.data[2]) == EXECUTOR_QUOTES_DISPATCH)
            directDelegate(_getExecutorQuote());
        else if (uint8(msg.data[2]) == EXECUTOR_ADJUST_POSITION_A_DISPATCH)
            directDelegate(_getExecutorAdjustPositionA());
        else if (uint8(msg.data[2]) == EXECUTOR_SWAP_PERMIT2_B_DISPATCH)
            directDelegate(_getExecutorSwapPermit2B());
        else if (uint8(msg.data[2]) == EXECUTOR_ADJUST_POSITION_B_DISPATCH)
            directDelegate(_getExecutorAdjustPositionB());
        else if (uint8(msg.data[2]) == EXECUTOR_SWAP_B_DISPATCH)
            directDelegate(_getExecutorSwapB());
        else
           directDelegate(_getExecutorFallback());
    }

    // internal functions

    // proxy storage manipulators

    function _getExecutorSwapA() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_SWAP_A_SLOT).value;
    }
    function _getExecutorSwapPermit2A() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_A_SLOT).value;
    }
    function _getExecutorQuote() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_QUOTE_SLOT).value;
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
    function _getExecutorAdjustPositionA() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_ADJUST_POSITION_A_SLOT).value;
    }
    function _getExecutorAdjustPositionB() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_ADJUST_POSITION_B_SLOT).value;
    }
    function _getExecutorSwapPermit2B() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_B_SLOT).value;
    }
    function _getExecutorSwapB() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_SWAP_B_SLOT).value;
    }
    function _getExecutorFallback() internal view returns (address) {
        return StorageSlot.getAddressSlot(EXECUTOR_FALLBACK_SLOT).value;
    }

    function _setProxyAdmin(address newAdmin) internal {
        StorageSlot.getAddressSlot(PROXY_ADMIN_SLOT).value = newAdmin;
    }

    function _setProxies(
        ISeawaterExecutorSwapA executorSwapA,
        ISeawaterExecutorSwapPermit2A executorSwapPermit2A,
        ISeawaterExecutorQuote executorQuote,
        ISeawaterExecutorPosition executorPosition,
        ISeawaterExecutorUpdatePosition executorUpdatePosition,
        ISeawaterExecutorAdmin executorAdmin,
        ISeawaterExecutorAdjustPositionA executorAdjustPositionA,
        ISeawaterExecutorSwapPermit2B executorSwapPermit2B,
        ISeawaterExecutorAdjustPositionB executorAdjustPositionB,
        ISeawaterExecutorSwapB executorSwapB,
        ISeawaterExecutorFallback executorFallback
    ) internal {
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_A_SLOT).value = address(executorSwapA);
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_A_SLOT).value = address(executorSwapPermit2A);
        StorageSlot.getAddressSlot(EXECUTOR_QUOTE_SLOT).value = address(executorQuote);
        StorageSlot.getAddressSlot(EXECUTOR_POSITION_SLOT).value = address(executorPosition);
        StorageSlot.getAddressSlot(EXECUTOR_UPDATE_POSITION_SLOT).value = address(executorUpdatePosition);
        StorageSlot.getAddressSlot(EXECUTOR_ADMIN_SLOT).value = address(executorAdmin);
        StorageSlot.getAddressSlot(EXECUTOR_ADJUST_POSITION_A_SLOT).value = address(executorAdjustPositionA);
        StorageSlot.getAddressSlot(EXECUTOR_ADJUST_POSITION_B_SLOT).value = address(executorAdjustPositionB);
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_PERMIT2_B_SLOT).value = address(executorSwapPermit2B);
        StorageSlot.getAddressSlot(EXECUTOR_SWAP_B_SLOT).value = address(executorSwapB);
        StorageSlot.getAddressSlot(EXECUTOR_FALLBACK_SLOT).value = address(executorFallback);
    }
}
