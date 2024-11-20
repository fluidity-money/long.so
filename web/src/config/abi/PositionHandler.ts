export const PositionHandler = [
  {
    type: "constructor",
    inputs: [
      {
        name: "longtail",
        type: "address",
        internalType: "contract ISeawaterAMM",
      },
      {
        name: "leo",
        type: "address",
        internalType: "contract ILeo",
      },
      {
        name: "fusdcAddr",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "proxyVestIncr",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "lower",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "upper",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "amount0Min",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fusdcMin",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount0Max",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fusdcMax",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "shouldVest",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
] as const;

export default PositionHandler;
