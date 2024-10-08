export const ILeo = [
  {
    type: "function",
    name: "campaignDetails",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "campaignId",
        type: "bytes8",
        internalType: "bytes8",
      },
    ],
    outputs: [
      {
        name: "tickLower",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "tickUpper",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "perSecond",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "distributed",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maximum",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "startingTimestamp",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "endingTimestamp",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "campaignRevisions",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "campaignId",
        type: "bytes8",
        internalType: "bytes8",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "cancelCampaign",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "campaignId",
        type: "bytes8",
        internalType: "bytes8",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "collect",
    inputs: [
      {
        name: "positionDetails",
        type: "tuple[]",
        internalType: "struct ILeo.PositionDetails[]",
        components: [
          {
            name: "token",
            type: "address",
            internalType: "address",
          },
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "campaignIds",
        type: "bytes8[]",
        internalType: "bytes8[]",
      },
    ],
    outputs: [
      {
        name: "collectRewards",
        type: "tuple",
        internalType: "struct ILeo.CollectRewards",
        components: [
          {
            name: "poolRewards",
            type: "tuple[]",
            internalType: "struct ILeo.PoolRewards[]",
            components: [
              {
                name: "pool",
                type: "address",
                internalType: "address",
              },
              {
                name: "amount0Lp",
                type: "uint128",
                internalType: "uint128",
              },
              {
                name: "amount1Lp",
                type: "uint128",
                internalType: "uint128",
              },
            ],
          },
          {
            name: "campaignRewards",
            type: "tuple[]",
            internalType: "struct ILeo.CampaignRewards[]",
            components: [
              {
                name: "campaignToken",
                type: "address",
                internalType: "address",
              },
              {
                name: "rewards",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createCampaign",
    inputs: [
      {
        name: "campaignId",
        type: "bytes8",
        internalType: "bytes8",
      },
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "tickLower",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "tickUpper",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "perSecond",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "extraMax",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "starting",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "ending",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "divestPosition",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "poolLp",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "lp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateCampaign",
    inputs: [
      {
        name: "campaignId",
        type: "bytes8",
        internalType: "bytes8",
      },
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "tickLower",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "tickUpper",
        type: "int32",
        internalType: "int32",
      },
      {
        name: "perSecond",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "extraMax",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "starting",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "ending",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "vestPosition",
    inputs: [
      {
        name: "pool",
        type: "address",
        internalType: "address",
      },
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CampaignBalanceUpdated",
    inputs: [
      {
        name: "identifier",
        type: "bytes8",
        indexed: true,
        internalType: "bytes8",
      },
      {
        name: "newMaximum",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CampaignCreated",
    inputs: [
      {
        name: "identifier",
        type: "bytes8",
        indexed: true,
        internalType: "bytes8",
      },
      {
        name: "pool",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "details",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "times",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CampaignUpdated",
    inputs: [
      {
        name: "identifier",
        type: "bytes8",
        indexed: true,
        internalType: "bytes8",
      },
      {
        name: "pool",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "perSecond",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "extras",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PositionDivested",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PositionVested",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
] as const;

export default ILeo;
