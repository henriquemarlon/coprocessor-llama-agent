// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "../lib/forge-std/src/Script.sol";
import {LlamaAgent} from "../src/LlamaAgent.sol";

contract DeployLlamaAgent is Script {
    function run() external returns (LlamaAgent) {
        // These values should be replaced with your actual values
        address taskIssuerAddress = vm.envAddress("TASK_ISSUER_ADDRESS");
        bytes32 machineHash = vm.envBytes32("MACHINE_HASH");

        vm.startBroadcast();
        LlamaAgent llamaAgent = new LlamaAgent(taskIssuerAddress, machineHash);
        vm.stopBroadcast();

        return llamaAgent;
    }
}
