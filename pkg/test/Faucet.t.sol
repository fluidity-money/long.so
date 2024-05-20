// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "forge-std/Test.sol";

import "../sol/Faucet.sol";

import "../interfaces/IERC20.sol";

contract TestFaucet is Test {
    Faucet faucet;

    function setUp() public {
        bytes memory bloom = vm.readFileBinary("./test/FaucetTest2.bin");
        address bloomContract;
        // Deploy the holder contract
        assembly {
            bloomContract := create(0, add(32, bloom), mload(bloom))
        }
        uint256 size;
        assembly {
            size := extcodesize(bloomContract)
        }
        require(size > 0, "bloom contract creation failed");
        IERC20[] memory tokens;
        faucet = new Faucet(msg.sender, bloomContract, tokens);
    }

    function testStakers() public {
        address[] memory stakers = vm.parseJsonAddressArray(vm.readFile("./config/stakers.json"), ".");
        for (uint256 i = 0; i < stakers.length; ++i) {
            assertTrue(faucet.isMember(stakers[i]));
        }
        for (uint256 i = 0; i < 1; ++i) {
            assertFalse(faucet.isMember(address(uint160(i))));
        }
    }
}
