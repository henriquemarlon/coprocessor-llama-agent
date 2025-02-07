//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Chat} from "../src/Chat.sol";
import {Test, console} from "forge-std/Test.sol";
import {TaskIssuerMock} from "./mock/TaskIssuerMock.sol";

contract ChatTest is Test {
    Chat chat;
    TaskIssuerMock mock;

    bytes32 machineHash = bytes32(0);

    function setUp() public {
        mock = new TaskIssuerMock();
        chat = new Chat(address(mock), machineHash);
    }

    function test_response() public {
        bytes memory payload = hex"6f2071756520e9206120766964613f";

        bytes memory response =
            hex"4120766964612c20656d20706f756361732070616c61767261732c20e920756d61206a6f726e61646120fa6e69636120666569746120646520656e636f6e74726f732c206465736166696f732c20617072656e64697a61646f732065206d6f6d656e746f7320717565206e6f73207472616e73666f726d616d2e";

        bytes memory notice = abi.encodeWithSignature("Notice(bytes)", response);

        bytes[] memory outputs = new bytes[](1);
        outputs[0] = notice;

        vm.expectEmit();
        emit TaskIssuerMock.TaskIssued(machineHash, payload, address(chat));

        chat.runExecution(payload);

        vm.expectEmit();
        emit Chat.ResultReceived(keccak256(payload), response);

        console.logBytes(outputs[0]);

        vm.prank(address(mock));
        chat.coprocessorCallbackOutputsOnly(machineHash, keccak256(payload), outputs);
    }
}
