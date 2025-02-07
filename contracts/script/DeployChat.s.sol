// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "../lib/forge-std/src/Script.sol";
import {Chat} from "../src/Chat.sol";

contract DeployChat is Script {
    function run() external returns (Chat) {
        // These values should be replaced with your actual values
        address taskIssuerAddress = vm.envAddress("TASK_ISSUER_ADDRESS");
        bytes32 machineHash = vm.envBytes32("MACHINE_HASH");

        vm.startBroadcast();
        Chat chat = new Chat(taskIssuerAddress, machineHash);
        vm.stopBroadcast();

        return chat;
    }
}
