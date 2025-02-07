// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/coprocessor-base-contract/src/CoprocessorAdapter.sol";

contract Chat is CoprocessorAdapter {
    event ResultReceived(bytes32 payloadHash, bytes output);

    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    function runExecution(bytes calldata input) external {
        callCoprocessor(input);
    }

    function handleNotice(bytes32 payloadHash, bytes memory notice) internal override {
        emit ResultReceived(payloadHash, notice);
    }
}
