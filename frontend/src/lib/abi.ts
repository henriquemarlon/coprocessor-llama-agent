export const LlamaAgentABI = [
  {
    type: "function",
    name: "runExecution",
    inputs: [{ name: "input", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "ResultReceived",
    inputs: [
      {
        name: "payloadHash",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "output",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
];
