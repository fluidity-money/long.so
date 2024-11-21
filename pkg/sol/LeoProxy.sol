// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "./ILeo.sol";

/// @dev 0x265c22645a278354f32cb66e6ace5ae683d2e0f04117019dbeb0727f85f1690e
bytes32 constant EXTRAS_SLOT = bytes32(uint256(keccak256("leo.impl.extras")) - 1);

/// @dev 0x5f9cf5b10fe99c3929b5aaee8330476b5fdcda9bd9a0df70532d2c68fe1683a9
bytes32 constant COLLECT_SLOT = bytes32(uint256(keccak256("leo.impl.collect")) - 1);

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

interface LeoCtor {
    function ctor(address) external;
}

contract LeoProxy is ILeo {
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

    constructor(address _collect, address _extras, address _emergency) {
        StorageSlot.getAddressSlot(COLLECT_SLOT).value = _collect;
        StorageSlot.getAddressSlot(EXTRAS_SLOT).value = _extras;
        (bool success,) =
            StorageSlot.getAddressSlot(EXTRAS_SLOT).value.delegatecall(
                abi.encodeWithSelector(LeoCtor.ctor.selector, _emergency)
            );
        require(success, "setup failed");
    }

    /// @inheritdoc ILeo
    function createCampaign(
        bytes8 /* campaignId */,
        address /* pool */,
        int32 /* tickLower */,
        int32 /* tickUpper */,
        uint64 /* perSecond */,
        address /* token */,
        uint256 /* extraMax */,
        uint64 /* starting */,
        uint64 /* ending */
    ) external {
        directDelegate(StorageSlot.getAddressSlot(EXTRAS_SLOT).value);
    }

    /// @inheritdoc ILeo
    function campaignDetails(bytes8 /* campaignId */) external returns (
        int32,
        int32,
        uint256,
        address,
        uint256,
        uint256,
        uint64,
        uint64
    ) {
        directDelegate(StorageSlot.getAddressSlot(EXTRAS_SLOT).value);
    }

    /// @inheritdoc ILeo
    function cancelCampaign(address /* pool */, bytes8 /* campaignId */) external {
        directDelegate(StorageSlot.getAddressSlot(EXTRAS_SLOT).value);
    }

    /// @inheritdoc ILeo
    function poolLp(address /* pool */) external returns (uint256) {
        directDelegate(StorageSlot.getAddressSlot(EXTRAS_SLOT).value);
    }

    /// @inheritdoc ILeo
    function collect(
        PositionDetails[] memory /* positionDetails */,
        bytes8[] memory /* campaignIds */,
        address /* recipient */
    ) external returns (CollectRewards memory) {
        directDelegate(StorageSlot.getAddressSlot(COLLECT_SLOT).value);
    }

    /// @inheritdoc ILeo
    function vestPosition(address /* pool */, uint256 /* id */, address /* recipient */) external {
        directDelegate(StorageSlot.getAddressSlot(EXTRAS_SLOT).value);
    }

    /// @inheritdoc ILeo
    function divestPosition(uint256 /* positionId */, address /* recipient */) external {
        directDelegate(StorageSlot.getAddressSlot(EXTRAS_SLOT).value);
    }
}
