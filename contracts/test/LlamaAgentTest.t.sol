//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {LlamaAgent} from "../src/LlamaAgent.sol";
import {Test, console} from "forge-std/Test.sol";
import {TaskIssuerMock} from "./mock/TaskIssuerMock.sol";

contract LlamaAgentTest is Test {
    LlamaAgent llamaAgent;
    TaskIssuerMock taskIssuerMock;

    bytes32 machineHash = bytes32(0);

    function setUp() public {
        taskIssuerMock = new TaskIssuerMock();
        llamaAgent = new LlamaAgent(address(taskIssuerMock), machineHash);
    }

    function testCallChatWithAValidInput() public {
        // Payload: What is the meaning of life?
        bytes memory payload = hex"5768617420697320746865206d65616e696e67206f66206c6966653faa";

        vm.expectEmit();
        emit TaskIssuerMock.TaskIssued(machineHash, payload, address(llamaAgent));

        llamaAgent.runExecution(payload);

        // There isn’t a one-size-fits-all answer to the meaning of life. Whether you draw meaning from spirituality, philosophical inquiry, personal relationships, or scientific curiosity, the search itself can be a meaningful pursuit. It invites each of us to explore our values, passions, and connections, ultimately creating a purpose that is uniquely our own.
        bytes memory output =
            hex"54686572652069736e2019742061206f6e652d73697a652d666974732d616c6c20616e7377657220746f20746865206d65616e696e67206f66206c6966652e205768657468657220796f752064726177206d65616e696e672066726f6d2073706972697475616c6974792c207068696c6f736f70686963616c20696e71756972792c20706572736f6e616c2072656c6174696f6e73686970732c206f7220736369656e746966696320637572696f736974792c207468652073656172636820697473656c662063616e2062652061206d65616e696e6766756c20707572737569742e20497420696e76697465732065616368206f6620757320746f206578706c6f7265206f75722076616c7565732c2070617373696f6e732c20616e6420636f6e6e656374696f6e732c20756c74696d6174656c79206372656174696e67206120707572706f7365207468617420697320756e697175656c79206f7572206f776e2e";

        bytes memory notice = abi.encodeWithSignature("Notice(bytes)", output);

        bytes[] memory outputs = new bytes[](1);
        outputs[0] = notice;

        vm.expectEmit();
        emit LlamaAgent.ResultReceived(keccak256(payload), output);

        console.logBytes(outputs[0]);

        vm.prank(address(taskIssuerMock));
        llamaAgent.coprocessorCallbackOutputsOnly(machineHash, keccak256(payload), outputs);
    }
}
