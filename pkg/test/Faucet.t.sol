// SPDX-Identifier: MIT
pragma solidity 0.8.16;

import "forge-std/Test.sol";

import "../sol/Faucet.sol";

import "../interfaces/IERC20.sol";

contract TestFaucet is Test {
    Faucet faucet;

    function setUp() public {
        bytes memory bloom = vm.readFileBinary("./test/FaucetTest.bin");
        address bloomContract;
        // Deploy the holder contract
        assembly {
            let size := mload(bloom)
            bloomContract := create(0, bloom, bloom)
        }
        require(address(0) != bloomContract);
        IERC20[] memory tokens;
        faucet = new Faucet(msg.sender, bloomContract, tokens);
    }

    function testStakers() public {
        address[] memory stakers = vm.parseJsonAddressArray(vm.readFile("../config/stakers.json"), ".");
        for (uint i = 0; i < stakers.length; ++i) {
            assertTrue(faucet.isMember(stakers[i]));
        }
    }
}
