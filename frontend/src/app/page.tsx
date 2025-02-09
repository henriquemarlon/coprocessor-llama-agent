"use client";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { writeContract, watchContractEvent } from "@wagmi/core";
import { CustomConnectButton } from "@/components/ConnectButton";
import { config } from "@/lib/wagmiConfig";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { LlamaAgentABI } from "../lib/abi";
import { toHex, keccak256, hexToString, decodeEventLog } from "viem";

export default function Home() {
  const { isConnected } = useAccount();
  const [inputValue, setInputValue] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { toast } = useToast();

  const pendingHashesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unwatch = watchContractEvent(config, {
      abi: LlamaAgentABI,
      address: process.env.NEXT_PUBLIC_COPROCESSOR_ADAPTER as `0x${string}`,
      eventName: "ResultReceived",
      onLogs(logs) {
        logs.forEach((log) => {
          try {
            const decodedLog = decodeEventLog({
              abi: LlamaAgentABI,
              eventName: "ResultReceived",
              data: log.data,
              topics: log.topics,
            });
            if (
              typeof decodedLog.args !== "object" ||
              decodedLog.args === null
            ) {
              console.error(
                "Decoded event does not contain valid arguments:",
                decodedLog.args
              );
              return;
            }
            const { payloadHash: receivedPayloadHash, output } =
              decodedLog.args as unknown as {
                payloadHash: string;
                output: string;
              };
            if (
              typeof receivedPayloadHash !== "string" ||
              typeof output !== "string"
            ) {
              console.error(
                "Invalid values for payloadHash or output:",
                decodedLog.args
              );
              return;
            }
            const normalizedHash = receivedPayloadHash.toLowerCase();

            if (!pendingHashesRef.current.has(normalizedHash)) {
              console.error(
                "Received payload hash not found in pending list:",
                normalizedHash
              );
              return;
            }
            
            pendingHashesRef.current.delete(normalizedHash);
            
            const outputString = hexToString(output as `0x${string}`);
            console.log("Received payload:", outputString);
            setResponses((prev) => [...prev, outputString]);
          } catch (error) {
            console.error("Error decoding the event log:", error);
          }
        });
      },
    });

    return () => {
      unwatch();
    };
  }, []);

  const createJsonRequest = () => {
    if (!inputValue || inputValue.trim() === "") {
      throw new Error("Input is empty");
    }
    const newEntropy = uuidv4();
    return { entropy: newEntropy, question: inputValue };
  };

  async function sendTransaction() {
    const jsonData = createJsonRequest();
    const jsonStr = JSON.stringify(jsonData);
    const hexData = toHex(jsonStr);
    console.log("Hex Data:", hexData);
    const txPayloadHash = keccak256(hexData);
    console.log("Keccak256 Hash:", txPayloadHash);

    pendingHashesRef.current.add(txPayloadHash.toLowerCase());

    try {
      await writeContract(config, {
        address: process.env.NEXT_PUBLIC_COPROCESSOR_ADAPTER as `0x${string}`,
        abi: LlamaAgentABI,
        functionName: "runExecution",
        args: [hexData],
      });
      toast({
        title: "Input sent",
        description:
          "Please wait, the response may take a few minutes to arrive",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: error instanceof Error ? error.message : "Transaction Error",
        variant: "destructive",
      });
      pendingHashesRef.current.delete(txPayloadHash.toLowerCase());
    }
  }

  const handleSendText = async () => {
    if (!isConnected) {
      toast({
        title: "Connect your wallet first",
        description:
          "You need to connect your wallet before sending a transaction.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSending(true);
      await sendTransaction();
      console.log("Transaction sent.");
    } catch (error) {
      console.error(error);
      toast({
        title: error instanceof Error ? error.message : "Transaction Error",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="h-screen">
      <div className="flex p-4 justify-end">
        <div className="flex flex-col gap-2 items-center">
          <CustomConnectButton />
          <p>
            Get holešky on the faucet{" "}
            <Link
              className="underline"
              href="https://cloud.google.com/application/web3/faucet/ethereum/holesky"
            >
              here
            </Link>
          </p>
        </div>
      </div>
      <div className="justify-items-center my-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="font-semibold text-2xl mb-4">Llama Agent</p>
        <div className="flex flex-col gap-6">
          <Textarea
            onChange={handleTextChange}
            className="w-96 text-justify"
            placeholder="Type your message here."
          />
          <Button
            disabled={isSending}
            className="w-[100%] mb-8 text-md"
            onClick={handleSendText}
          >
            Send
          </Button>
          {responses.length > 0 && (
            <div className="flex flex-col items-center w-96">
              <p className="text-lg font-semibold items-center">Results:</p>
              {[...responses].reverse().map((response, index) => (
                <div
                  key={index}
                  className="p-4 my-2 w-[100%] h-auto border border-gray-400 shadow-sm rounded break-words text-justify"
                >
                  <p>{response}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
