// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ITaskIssuer {
    function issueTask(bytes32 machineHash, bytes calldata input, address callbackAddress) external;
}

contract TaskIssuerMock is ITaskIssuer {
    event TaskIssued(bytes32 machineHash, bytes input, address callback);

    function issueTask(bytes32 machineHash, bytes calldata input, address callback) public {
        emit TaskIssued(machineHash, input, callback);
    }
}
