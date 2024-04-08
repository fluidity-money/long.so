export const output = {
  abi: [
    {
      type: "function",
      name: "burnPosition",
      inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "collect",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "id",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "amount0", type: "uint128", internalType: "uint128" },
        {
          name: "amount1",
          type: "uint128",
          internalType: "uint128",
        },
      ],
      outputs: [
        { name: "", type: "uint128", internalType: "uint128" },
        {
          name: "",
          type: "uint128",
          internalType: "uint128",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "collectProtocol",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "amount0",
          type: "uint128",
          internalType: "uint128",
        },
        { name: "amount1", type: "uint128", internalType: "uint128" },
      ],
      outputs: [
        { name: "", type: "uint128", internalType: "uint128" },
        {
          name: "",
          type: "uint128",
          internalType: "uint128",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "createPool",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "sqrtPriceX96",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "fee", type: "uint32", internalType: "uint32" },
        {
          name: "tickSpacing",
          type: "uint8",
          internalType: "uint8",
        },
        {
          name: "maxLiquidityPerTick",
          type: "uint128",
          internalType: "uint128",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "mintPosition",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "lower",
          type: "int32",
          internalType: "int32",
        },
        { name: "upper", type: "int32", internalType: "int32" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "positionBalance",
      inputs: [{ name: "user", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "positionLiquidity",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "id",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "positionOwner",
      inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "quote",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "zeroForOne",
          type: "bool",
          internalType: "bool",
        },
        { name: "amount", type: "int256", internalType: "int256" },
        {
          name: "priceLimit",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "quote2",
      inputs: [
        { name: "from", type: "address", internalType: "address" },
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        { name: "amount", type: "uint256", internalType: "uint256" },
        {
          name: "minOut",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setPoolEnabled",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "enabled",
          type: "bool",
          internalType: "bool",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swap",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "zeroForOne",
          type: "bool",
          internalType: "bool",
        },
        { name: "amount", type: "int256", internalType: "int256" },
        {
          name: "priceLimit",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swap2ExactIn",
      inputs: [
        { name: "_tokenA", type: "address", internalType: "address" },
        {
          name: "_tokenB",
          type: "address",
          internalType: "address",
        },
        { name: "_amount", type: "uint256", internalType: "uint256" },
        {
          name: "_minOut",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        { name: "", type: "uint256", internalType: "uint256" },
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swap2ExactInPermit2",
      inputs: [
        { name: "from", type: "address", internalType: "address" },
        {
          name: "to",
          type: "address",
          internalType: "address",
        },
        { name: "amount", type: "uint256", internalType: "uint256" },
        {
          name: "minOut",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "nonce", type: "uint256", internalType: "uint256" },
        {
          name: "deadline",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "sig", type: "bytes", internalType: "bytes" },
      ],
      outputs: [
        { name: "", type: "uint256", internalType: "uint256" },
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swapIn",
      inputs: [
        { name: "_token", type: "address", internalType: "address" },
        {
          name: "_amount",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_minOut", type: "uint256", internalType: "uint256" },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swapInPermit2",
      inputs: [
        { name: "_token", type: "address", internalType: "address" },
        {
          name: "_amount",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_minOut", type: "uint256", internalType: "uint256" },
        {
          name: "_nonce",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_deadline", type: "uint256", internalType: "uint256" },
        {
          name: "_maxAmount",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_sig", type: "bytes", internalType: "bytes" },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swapOut",
      inputs: [
        { name: "_token", type: "address", internalType: "address" },
        {
          name: "_amount",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_minOut", type: "uint256", internalType: "uint256" },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swapOutPermit2",
      inputs: [
        { name: "_token", type: "address", internalType: "address" },
        {
          name: "_amount",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_minOut", type: "uint256", internalType: "uint256" },
        {
          name: "_nonce",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_deadline", type: "uint256", internalType: "uint256" },
        {
          name: "_maxAmount",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "_sig", type: "bytes", internalType: "bytes" },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "swapPermit2",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "zeroForOne",
          type: "bool",
          internalType: "bool",
        },
        { name: "amount", type: "int256", internalType: "int256" },
        {
          name: "priceLimit",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "nonce", type: "uint256", internalType: "uint256" },
        {
          name: "deadline",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "maxAmount", type: "uint256", internalType: "uint256" },
        {
          name: "sig",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "transferPosition",
      inputs: [
        { name: "id", type: "uint256", internalType: "uint256" },
        {
          name: "from",
          type: "address",
          internalType: "address",
        },
        { name: "to", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "updatePosition",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "id",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "delta", type: "int128", internalType: "int128" },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "updatePositionPermit2",
      inputs: [
        { name: "pool", type: "address", internalType: "address" },
        {
          name: "id",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "delta", type: "int128", internalType: "int128" },
        {
          name: "nonce0",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "deadline0", type: "uint256", internalType: "uint256" },
        {
          name: "maxAmount0",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "sig0", type: "bytes", internalType: "bytes" },
        {
          name: "nonce1",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "deadline1", type: "uint256", internalType: "uint256" },
        {
          name: "maxAmount1",
          type: "uint256",
          internalType: "uint256",
        },
        { name: "sig1", type: "bytes", internalType: "bytes" },
      ],
      outputs: [
        { name: "", type: "int256", internalType: "int256" },
        {
          name: "",
          type: "int256",
          internalType: "int256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "event",
      name: "BurnPosition",
      inputs: [
        { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
        {
          name: "owner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "CollectFees",
      inputs: [
        { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
        {
          name: "pool",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        { name: "to", type: "address", indexed: true, internalType: "address" },
        {
          name: "amount0",
          type: "uint128",
          indexed: false,
          internalType: "uint128",
        },
        {
          name: "amount1",
          type: "uint128",
          indexed: false,
          internalType: "uint128",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "CollectProtocolFees",
      inputs: [
        {
          name: "pool",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "to",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "amount0",
          type: "uint128",
          indexed: false,
          internalType: "uint128",
        },
        {
          name: "amount1",
          type: "uint128",
          indexed: false,
          internalType: "uint128",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "MintPosition",
      inputs: [
        { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
        {
          name: "owner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "pool",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "lower",
          type: "int32",
          indexed: false,
          internalType: "int32",
        },
        { name: "upper", type: "int32", indexed: false, internalType: "int32" },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "NewPool",
      inputs: [
        {
          name: "token",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "fee",
          type: "uint32",
          indexed: true,
          internalType: "uint32",
        },
        {
          name: "price",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Swap1",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "pool",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "zeroForOne",
          type: "bool",
          indexed: false,
          internalType: "bool",
        },
        {
          name: "amount0",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "amount1",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "finalTick",
          type: "int32",
          indexed: false,
          internalType: "int32",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Swap2",
      inputs: [
        {
          name: "user",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "from",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        { name: "to", type: "address", indexed: true, internalType: "address" },
        {
          name: "amountIn",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "amountOut",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "fluidVolume",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "finalTick0",
          type: "int32",
          indexed: false,
          internalType: "int32",
        },
        {
          name: "finalTick1",
          type: "int32",
          indexed: false,
          internalType: "int32",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "TransferPosition",
      inputs: [
        {
          name: "from",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "to",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "UpdatePositionLiquidity",
      inputs: [
        { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
        {
          name: "delta",
          type: "int128",
          indexed: false,
          internalType: "int128",
        },
      ],
      anonymous: false,
    },
  ],
  bytecode: { object: "0x", sourceMap: "", linkReferences: {} },
  deployedBytecode: { object: "0x", sourceMap: "", linkReferences: {} },
  methodIdentifiers: {
    "burnPosition(uint256)": "38ca63bc",
    "collect(address,uint256,uint128,uint128)": "a0e4eb3c",
    "collectProtocol(address,uint128,uint128)": "85b66729",
    "createPool(address,uint256,uint32,uint8,uint128)": "b71df68c",
    "mintPosition(address,int32,int32)": "5f439da3",
    "positionBalance(address)": "a2784719",
    "positionLiquidity(address,uint256)": "e759c465",
    "positionOwner(uint256)": "b3060d36",
    "quote(address,bool,int256,uint256)": "fc016981",
    "quote2(address,address,uint256,uint256)": "298d9120",
    "setPoolEnabled(address,bool)": "b27925ff",
    "swap(address,bool,int256,uint256)": "abb1db2a",
    "swap2ExactIn(address,address,uint256,uint256)": "41e3cc58",
    "swap2ExactInPermit2(address,address,uint256,uint256,uint256,uint256,bytes)":
      "d06eb557",
    "swapIn(address,uint256,uint256)": "6f1a366d",
    "swapInPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":
      "d39dc117",
    "swapOut(address,uint256,uint256)": "739dc0cf",
    "swapOutPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":
      "e8f666de",
    "swapPermit2(address,bool,int256,uint256,uint256,uint256,uint256,bytes)":
      "ef5e0f7e",
    "transferPosition(uint256,address,address)": "df5bda3e",
    "updatePosition(address,uint256,int128)": "e83c3049",
    "updatePositionPermit2(address,uint256,int128,uint256,uint256,uint256,bytes,uint256,uint256,uint256,bytes)":
      "6da4b8cb",
  },
  rawMetadata:
    '{"compiler":{"version":"0.8.16+commit.07a7930e"},"language":"Solidity","output":{"abi":[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"BurnPosition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"pool","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"CollectFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pool","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"CollectProtocolFees","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"pool","type":"address"},{"indexed":false,"internalType":"int32","name":"lower","type":"int32"},{"indexed":false,"internalType":"int32","name":"upper","type":"int32"}],"name":"MintPosition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"uint32","name":"fee","type":"uint32"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"}],"name":"NewPool","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"pool","type":"address"},{"indexed":false,"internalType":"bool","name":"zeroForOne","type":"bool"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":false,"internalType":"int32","name":"finalTick","type":"int32"}],"name":"Swap1","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fluidVolume","type":"uint256"},{"indexed":false,"internalType":"int32","name":"finalTick0","type":"int32"},{"indexed":false,"internalType":"int32","name":"finalTick1","type":"int32"}],"name":"Swap2","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"TransferPosition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"int128","name":"delta","type":"int128"}],"name":"UpdatePositionLiquidity","type":"event"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"burnPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"collect","outputs":[{"internalType":"uint128","name":"","type":"uint128"},{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"collectProtocol","outputs":[{"internalType":"uint128","name":"","type":"uint128"},{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"sqrtPriceX96","type":"uint256"},{"internalType":"uint32","name":"fee","type":"uint32"},{"internalType":"uint8","name":"tickSpacing","type":"uint8"},{"internalType":"uint128","name":"maxLiquidityPerTick","type":"uint128"}],"name":"createPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"int32","name":"lower","type":"int32"},{"internalType":"int32","name":"upper","type":"int32"}],"name":"mintPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"positionBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"positionLiquidity","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"positionOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"bool","name":"zeroForOne","type":"bool"},{"internalType":"int256","name":"amount","type":"int256"},{"internalType":"uint256","name":"priceLimit","type":"uint256"}],"name":"quote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minOut","type":"uint256"}],"name":"quote2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setPoolEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"bool","name":"zeroForOne","type":"bool"},{"internalType":"int256","name":"amount","type":"int256"},{"internalType":"uint256","name":"priceLimit","type":"uint256"}],"name":"swap","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_minOut","type":"uint256"}],"name":"swap2ExactIn","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minOut","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"swap2ExactInPermit2","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_minOut","type":"uint256"}],"name":"swapIn","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_minOut","type":"uint256"},{"internalType":"uint256","name":"_nonce","type":"uint256"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"uint256","name":"_maxAmount","type":"uint256"},{"internalType":"bytes","name":"_sig","type":"bytes"}],"name":"swapInPermit2","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_minOut","type":"uint256"}],"name":"swapOut","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_minOut","type":"uint256"},{"internalType":"uint256","name":"_nonce","type":"uint256"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"uint256","name":"_maxAmount","type":"uint256"},{"internalType":"bytes","name":"_sig","type":"bytes"}],"name":"swapOutPermit2","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"bool","name":"zeroForOne","type":"bool"},{"internalType":"int256","name":"amount","type":"int256"},{"internalType":"uint256","name":"priceLimit","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"maxAmount","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"swapPermit2","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"}],"name":"transferPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"int128","name":"delta","type":"int128"}],"name":"updatePosition","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"int128","name":"delta","type":"int128"},{"internalType":"uint256","name":"nonce0","type":"uint256"},{"internalType":"uint256","name":"deadline0","type":"uint256"},{"internalType":"uint256","name":"maxAmount0","type":"uint256"},{"internalType":"bytes","name":"sig0","type":"bytes"},{"internalType":"uint256","name":"nonce1","type":"uint256"},{"internalType":"uint256","name":"deadline1","type":"uint256"},{"internalType":"uint256","name":"maxAmount1","type":"uint256"},{"internalType":"bytes","name":"sig1","type":"bytes"}],"name":"updatePositionPermit2","outputs":[{"internalType":"int256","name":"","type":"int256"},{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"kind":"dev","methods":{"collect(address,uint256,uint128,uint128)":{"params":{"amount0":"the maximum amount of token0 to claim","amount1":"the maximum amount of token1 to claim","id":"the id of the position","pool":"the pool the position belongs to"},"returns":{"_0":"the amount of token0 and token1 collected"}},"collectProtocol(address,uint128,uint128)":{"params":{"amount0":"the maximum amount of token0 fees to collect","amount1":"the maximum amount of token1 fees to collect","pool":"the pool to collect fees for"},"returns":{"_0":"the amount of token0 and token1 fees collected"}},"createPool(address,uint256,uint32,uint8,uint128)":{"params":{"fee":"the fee to use","maxLiquidityPerTick":"the maximum amount of liquidity allowed in a single tick","pool":"the token to create the pool with","sqrtPriceX96":"the starting price for the pool","tickSpacing":"the spacing for valid liquidity ticks"}},"mintPosition(address,int32,int32)":{"params":{"lower":"the lower tick of the position (for concentrated liquidity)","pool":"the pool to create the position on","upper":"the upper tick of the position"}},"positionBalance(address)":{"params":{"user":"the user to get position balance for"},"returns":{"_0":"the number of positions owned by the user"}},"positionLiquidity(address,uint256)":{"params":{"id":"the id of the position","pool":"the pool the position belongs to"},"returns":{"_0":"the amount of liquidity contained in the position"}},"positionOwner(uint256)":{"params":{"id":"the id of the position"},"returns":{"_0":"the owner of the position"}},"quote(address,bool,int256,uint256)":{"params":{"amount":"the amount of token to swap, positive if exactIn, negative if exactOut","pool":"the pool to swap on","priceLimit":"the price limit for swaps, encoded as a sqrtX96 price","zeroForOne":"true if swapping token->fluid token"}},"quote2(address,address,uint256,uint256)":{"params":{"amount":"the amount of the input token to use","from":"the input token","minOut":"the minimum valid amount of the output token, reverts if not reached","to":"the output token"}},"setPoolEnabled(address,bool)":{"params":{"enabled":"true to enable to pool, false to disable it","pool":"the pool to enable or disable"}},"swap(address,bool,int256,uint256)":{"params":{"amount":"the amount of token to swap, positive if exactIn, negative if exactOut","pool":"the pool to swap on","priceLimit":"the price limit for swaps, encoded as a sqrtX96 price","zeroForOne":"true if swapping token->fluid token"},"returns":{"_0":"(token0, token1) delta"}},"swap2ExactIn(address,address,uint256,uint256)":{"params":{"_amount":"input amount (tokenA)","_minOut":"the minimum output amount (tokenB), reverting if the actual output is lower","_tokenA":"the input token","_tokenB":"the output token"},"returns":{"_0":"amount of token A in, amount of token B out"}},"swap2ExactInPermit2(address,address,uint256,uint256,uint256,uint256,bytes)":{"params":{"amount":"the amount of the input token to use","deadline":"the permit2 deadline","from":"the input token","minOut":"the minimum valid amount of the output token, reverts if not reached","nonce":"the permit2 nonce","sig":"the permit2 signature","to":"the output token"},"returns":{"_0":"(amount in, amount out)"}},"swapIn(address,uint256,uint256)":{"params":{"_amount":"input amount (token)","_minOut":"the minimum output amount (usdc), reverting if the actual output is lower","_token":"the token to swap"},"returns":{"_0":"amount of usdc out"}},"swapInPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":{"params":{"_amount":"input amount (token)","_deadline":"the deadline for the token ","_maxAmount":"the max amount of the token ","_minOut":"the minimum output amount (usdc), reverting if the actual output is lower","_nonce":"the nonce for the token ","_sig":"the signature for the token ","_token":"the token to swap"},"returns":{"_0":"amount of usdc out"}},"swapOut(address,uint256,uint256)":{"params":{"_amount":"input amount (usdc)","_minOut":"the minimum output amount (token), reverting if the actual output is lower","_token":"the token to swap"},"returns":{"_0":"amount of token out"}},"swapOutPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":{"params":{"_amount":"input amount (usdc)","_deadline":"the deadline for the token ","_maxAmount":"the max amount of the token ","_minOut":"the minimum output amount (token), reverting if the actual output is lower","_nonce":"the nonce for the token ","_sig":"the signature for the token ","_token":"the token to swap"},"returns":{"_0":"amount of token out"}},"swapPermit2(address,bool,int256,uint256,uint256,uint256,uint256,bytes)":{"params":{"amount":"the amount of token to swap, positive if exactIn, negative if exactOut","deadline":"the permit2 deadline","maxAmount":"the permit2 maxAmount","nonce":"the permit2 nonce","pool":"the pool to swap on","priceLimit":"the price limit for swaps, encoded as a sqrtX96 price","sig":"the permit2 signature","zeroForOne":"true if swapping token->fluid token"},"returns":{"_0":"(token0, token1) delta"}},"transferPosition(uint256,address,address)":{"params":{"from":"the user to transfer the position from","id":"the id of the position to transfer","to":"the user to transfer the position to"}},"updatePosition(address,uint256,int128)":{"params":{"delta":"the amount of liquidity to add or remove","id":"the id of the position","pool":"the pool the position belongs to"},"returns":{"_0":"the deltas for token0 and token1 for the user"}},"updatePositionPermit2(address,uint256,int128,uint256,uint256,uint256,bytes,uint256,uint256,uint256,bytes)":{"params":{"deadline0":"the deadline for token 0","deadline1":"the deadline for token 1","delta":"the amount of liquidity to add or remove","id":"the id of the position","maxAmount0":"the max amount for token 0","maxAmount1":"the max amount for token 1","nonce0":"the nonce for token 0","nonce1":"the nonce for token 1","pool":"the pool the position belongs to","sig0":"the signature for token 0","sig1":"the signature for token 1"},"returns":{"_0":"the deltas for token0 and token1 for the user"}}},"version":1},"userdoc":{"events":{"BurnPosition(uint256,address)":{"notice":"emitted when a position is burned"},"CollectFees(uint256,address,address,uint128,uint128)":{"notice":"emitted when a liquidity provider collects the fees associated with a position"},"CollectProtocolFees(address,address,uint128,uint128)":{"notice":"emitted when a protocol admin collects protocol fees"},"MintPosition(uint256,address,address,int32,int32)":{"notice":"emitted when a new position is minted"},"NewPool(address,uint32,uint256)":{"notice":"emitted when a new pool is created"},"Swap1(address,address,bool,uint256,uint256,int32)":{"notice":"emitted when a user swaps a token for the pool\'s fluid token, or vice-versa"},"Swap2(address,address,address,uint256,uint256,uint256,int32,int32)":{"notice":"emitted when a user swaps a nonfluid token for a nonfluid token (2-step swap)"},"TransferPosition(address,address,uint256)":{"notice":"emitted when a position changes owners"},"UpdatePositionLiquidity(uint256,int128)":{"notice":"emitted when the liquidity in a position is changed"}},"kind":"user","methods":{"burnPosition(uint256)":{"notice":"burns a position, leaving the liquidity in it inaccessibleid the id of the position to burn"},"collect(address,uint256,uint128,uint128)":{"notice":"collects fees from a position"},"collectProtocol(address,uint128,uint128)":{"notice":"collects protocol fees. only usable by the seawater admin"},"createPool(address,uint256,uint32,uint8,uint128)":{"notice":"initialises a new pool. only usable by the seawater admin"},"mintPosition(address,int32,int32)":{"notice":"creates a new position"},"positionBalance(address)":{"notice":"gets the number of positions owned by a user"},"positionLiquidity(address,uint256)":{"notice":"gets the amount of liquidity in a position"},"positionOwner(uint256)":{"notice":"gets the owner of a position"},"quote(address,bool,int256,uint256)":{"notice":"reverts with the expected amount of fUSDC or pool token for a swap with the given parametersalways revert with Error(string(amountOut))"},"quote2(address,address,uint256,uint256)":{"notice":"reverts with the expected amount of tokenOut for a 2-token swap with the given parametersalways revert with Error(string(amountOut))"},"setPoolEnabled(address,bool)":{"notice":"enables or disables a pool"},"swap(address,bool,int256,uint256)":{"notice":"swaps within a pool"},"swap2ExactIn(address,address,uint256,uint256)":{"notice":"swaps tokenA for tokenB"},"swap2ExactInPermit2(address,address,uint256,uint256,uint256,uint256,bytes)":{"notice":"performs a two stage swap across two pools using permit2 for token transferspermit2\'s max amount must be set to `amount`"},"swapIn(address,uint256,uint256)":{"notice":"swaps _token for USDC"},"swapInPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":{"notice":"swaps _token for USDC"},"swapOut(address,uint256,uint256)":{"notice":"swaps USDC for _token"},"swapOutPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":{"notice":"swaps USDC for _token"},"swapPermit2(address,bool,int256,uint256,uint256,uint256,uint256,bytes)":{"notice":"swaps within a pool using permit2 for token transfers"},"transferPosition(uint256,address,address)":{"notice":"transferPosition transfers a position. usable only by the NFT manager"},"updatePosition(address,uint256,int128)":{"notice":"refreshes a position\'s fees, and adds or removes liquidity"},"updatePositionPermit2(address,uint256,int128,uint256,uint256,uint256,bytes,uint256,uint256,uint256,bytes)":{"notice":"refreshes a position\'s fees, and adds or removes liquidity using permit2 for token transfers"}},"version":1}},"settings":{"compilationTarget":{"interfaces/ISeawaterAMM.sol":"ISeawaterAMM"},"debug":{"revertStrings":"debug"},"evmVersion":"london","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200},"remappings":[":@opensezppling/=lib/openzeppelin-contracts/",":ds-test/=lib/forge-std/lib/ds-test/src/",":forge-std/=lib/forge-std/src/"],"viaIR":true},"sources":{"interfaces/ISeawaterAMM.sol":{"keccak256":"0xd4d85018c6e7b7c2963f5af16edeadd874e670e5e365e18a66272f7057168400","urls":["bzz-raw://e4b5f7cf8577f8beee3f90617a99a561a1dbef55c2f123121419c0ef8bbe70fb","dweb:/ipfs/QmamdYQuqsnhYVotbzaQgvGFz4kmT4ebDYrpx6Q2WyfJ9r"]},"interfaces/ISeawaterEvents.sol":{"keccak256":"0x92fa6c5df90ddd8186e80f57075dc1df82703e0c2a111cf313a3e66d50a23940","urls":["bzz-raw://d2c8d446e89f8b3b0819a5b3a7c2c0e53570a561e9104dc33bbd63be4cd818fa","dweb:/ipfs/QmNiVkuLPTGfAwEfRqmVCNNAwfdQC4qrqkVYXD1Vi5NGY7"]},"interfaces/ISeawaterExecutors.sol":{"keccak256":"0x80b6914e08dd645ec8ed81fbd0cf0e765fea45c1a8bf45706663e1af4c5a4de9","urls":["bzz-raw://a5f078528f259b82e974d9d5312135b0b013bd05bf51cbe39226d43107ffcf78","dweb:/ipfs/Qmf86sceJAW2ZtVRFDeLz6bVpwB5GYdcQs331cDQEuuVKu"]}},"version":1}',
  metadata: {
    compiler: { version: "0.8.16+commit.07a7930e" },
    language: "Solidity",
    output: {
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
              indexed: true,
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
              indexed: true,
            },
          ],
          type: "event",
          name: "BurnPosition",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
              indexed: true,
            },
            {
              internalType: "address",
              name: "pool",
              type: "address",
              indexed: true,
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
              indexed: true,
            },
            {
              internalType: "uint128",
              name: "amount0",
              type: "uint128",
              indexed: false,
            },
            {
              internalType: "uint128",
              name: "amount1",
              type: "uint128",
              indexed: false,
            },
          ],
          type: "event",
          name: "CollectFees",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "pool",
              type: "address",
              indexed: true,
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
              indexed: true,
            },
            {
              internalType: "uint128",
              name: "amount0",
              type: "uint128",
              indexed: false,
            },
            {
              internalType: "uint128",
              name: "amount1",
              type: "uint128",
              indexed: false,
            },
          ],
          type: "event",
          name: "CollectProtocolFees",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
              indexed: true,
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
              indexed: true,
            },
            {
              internalType: "address",
              name: "pool",
              type: "address",
              indexed: true,
            },
            {
              internalType: "int32",
              name: "lower",
              type: "int32",
              indexed: false,
            },
            {
              internalType: "int32",
              name: "upper",
              type: "int32",
              indexed: false,
            },
          ],
          type: "event",
          name: "MintPosition",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
              indexed: true,
            },
            {
              internalType: "uint32",
              name: "fee",
              type: "uint32",
              indexed: true,
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
              indexed: true,
            },
          ],
          type: "event",
          name: "NewPool",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
              indexed: true,
            },
            {
              internalType: "address",
              name: "pool",
              type: "address",
              indexed: true,
            },
            {
              internalType: "bool",
              name: "zeroForOne",
              type: "bool",
              indexed: false,
            },
            {
              internalType: "uint256",
              name: "amount0",
              type: "uint256",
              indexed: false,
            },
            {
              internalType: "uint256",
              name: "amount1",
              type: "uint256",
              indexed: false,
            },
            {
              internalType: "int32",
              name: "finalTick",
              type: "int32",
              indexed: false,
            },
          ],
          type: "event",
          name: "Swap1",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
              indexed: true,
            },
            {
              internalType: "address",
              name: "from",
              type: "address",
              indexed: true,
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
              indexed: true,
            },
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
              indexed: false,
            },
            {
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
              indexed: false,
            },
            {
              internalType: "uint256",
              name: "fluidVolume",
              type: "uint256",
              indexed: false,
            },
            {
              internalType: "int32",
              name: "finalTick0",
              type: "int32",
              indexed: false,
            },
            {
              internalType: "int32",
              name: "finalTick1",
              type: "int32",
              indexed: false,
            },
          ],
          type: "event",
          name: "Swap2",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
              indexed: true,
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
              indexed: true,
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
              indexed: true,
            },
          ],
          type: "event",
          name: "TransferPosition",
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
              indexed: true,
            },
            {
              internalType: "int128",
              name: "delta",
              type: "int128",
              indexed: false,
            },
          ],
          type: "event",
          name: "UpdatePositionLiquidity",
          anonymous: false,
        },
        {
          inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
          stateMutability: "nonpayable",
          type: "function",
          name: "burnPosition",
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            { internalType: "uint128", name: "amount0", type: "uint128" },
            {
              internalType: "uint128",
              name: "amount1",
              type: "uint128",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "collect",
          outputs: [
            { internalType: "uint128", name: "", type: "uint128" },
            {
              internalType: "uint128",
              name: "",
              type: "uint128",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "uint128",
              name: "amount0",
              type: "uint128",
            },
            { internalType: "uint128", name: "amount1", type: "uint128" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "collectProtocol",
          outputs: [
            { internalType: "uint128", name: "", type: "uint128" },
            {
              internalType: "uint128",
              name: "",
              type: "uint128",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "uint256",
              name: "sqrtPriceX96",
              type: "uint256",
            },
            { internalType: "uint32", name: "fee", type: "uint32" },
            {
              internalType: "uint8",
              name: "tickSpacing",
              type: "uint8",
            },
            {
              internalType: "uint128",
              name: "maxLiquidityPerTick",
              type: "uint128",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "createPool",
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "int32",
              name: "lower",
              type: "int32",
            },
            { internalType: "int32", name: "upper", type: "int32" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "mintPosition",
        },
        {
          inputs: [{ internalType: "address", name: "user", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
          name: "positionBalance",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "positionLiquidity",
          outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
        },
        {
          inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
          stateMutability: "nonpayable",
          type: "function",
          name: "positionOwner",
          outputs: [{ internalType: "address", name: "", type: "address" }],
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "bool",
              name: "zeroForOne",
              type: "bool",
            },
            { internalType: "int256", name: "amount", type: "int256" },
            {
              internalType: "uint256",
              name: "priceLimit",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "quote",
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            { internalType: "uint256", name: "amount", type: "uint256" },
            {
              internalType: "uint256",
              name: "minOut",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "quote2",
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "bool",
              name: "enabled",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "setPoolEnabled",
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "bool",
              name: "zeroForOne",
              type: "bool",
            },
            { internalType: "int256", name: "amount", type: "int256" },
            {
              internalType: "uint256",
              name: "priceLimit",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swap",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "_tokenA", type: "address" },
            {
              internalType: "address",
              name: "_tokenB",
              type: "address",
            },
            { internalType: "uint256", name: "_amount", type: "uint256" },
            {
              internalType: "uint256",
              name: "_minOut",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swap2ExactIn",
          outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            { internalType: "uint256", name: "amount", type: "uint256" },
            {
              internalType: "uint256",
              name: "minOut",
              type: "uint256",
            },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            { internalType: "bytes", name: "sig", type: "bytes" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swap2ExactInPermit2",
          outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "_token", type: "address" },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
            { internalType: "uint256", name: "_minOut", type: "uint256" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swapIn",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "_token", type: "address" },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
            { internalType: "uint256", name: "_minOut", type: "uint256" },
            {
              internalType: "uint256",
              name: "_nonce",
              type: "uint256",
            },
            { internalType: "uint256", name: "_deadline", type: "uint256" },
            {
              internalType: "uint256",
              name: "_maxAmount",
              type: "uint256",
            },
            { internalType: "bytes", name: "_sig", type: "bytes" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swapInPermit2",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "_token", type: "address" },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
            { internalType: "uint256", name: "_minOut", type: "uint256" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swapOut",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "_token", type: "address" },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
            { internalType: "uint256", name: "_minOut", type: "uint256" },
            {
              internalType: "uint256",
              name: "_nonce",
              type: "uint256",
            },
            { internalType: "uint256", name: "_deadline", type: "uint256" },
            {
              internalType: "uint256",
              name: "_maxAmount",
              type: "uint256",
            },
            { internalType: "bytes", name: "_sig", type: "bytes" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swapOutPermit2",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "bool",
              name: "zeroForOne",
              type: "bool",
            },
            { internalType: "int256", name: "amount", type: "int256" },
            {
              internalType: "uint256",
              name: "priceLimit",
              type: "uint256",
            },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            { internalType: "uint256", name: "maxAmount", type: "uint256" },
            {
              internalType: "bytes",
              name: "sig",
              type: "bytes",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "swapPermit2",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            { internalType: "address", name: "to", type: "address" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "transferPosition",
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            { internalType: "int128", name: "delta", type: "int128" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "updatePosition",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
        {
          inputs: [
            { internalType: "address", name: "pool", type: "address" },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            { internalType: "int128", name: "delta", type: "int128" },
            {
              internalType: "uint256",
              name: "nonce0",
              type: "uint256",
            },
            { internalType: "uint256", name: "deadline0", type: "uint256" },
            {
              internalType: "uint256",
              name: "maxAmount0",
              type: "uint256",
            },
            { internalType: "bytes", name: "sig0", type: "bytes" },
            {
              internalType: "uint256",
              name: "nonce1",
              type: "uint256",
            },
            { internalType: "uint256", name: "deadline1", type: "uint256" },
            {
              internalType: "uint256",
              name: "maxAmount1",
              type: "uint256",
            },
            { internalType: "bytes", name: "sig1", type: "bytes" },
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "updatePositionPermit2",
          outputs: [
            { internalType: "int256", name: "", type: "int256" },
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
        },
      ],
      devdoc: {
        kind: "dev",
        methods: {
          "collect(address,uint256,uint128,uint128)": {
            params: {
              amount0: "the maximum amount of token0 to claim",
              amount1: "the maximum amount of token1 to claim",
              id: "the id of the position",
              pool: "the pool the position belongs to",
            },
            returns: { _0: "the amount of token0 and token1 collected" },
          },
          "collectProtocol(address,uint128,uint128)": {
            params: {
              amount0: "the maximum amount of token0 fees to collect",
              amount1: "the maximum amount of token1 fees to collect",
              pool: "the pool to collect fees for",
            },
            returns: { _0: "the amount of token0 and token1 fees collected" },
          },
          "createPool(address,uint256,uint32,uint8,uint128)": {
            params: {
              fee: "the fee to use",
              maxLiquidityPerTick:
                "the maximum amount of liquidity allowed in a single tick",
              pool: "the token to create the pool with",
              sqrtPriceX96: "the starting price for the pool",
              tickSpacing: "the spacing for valid liquidity ticks",
            },
          },
          "mintPosition(address,int32,int32)": {
            params: {
              lower:
                "the lower tick of the position (for concentrated liquidity)",
              pool: "the pool to create the position on",
              upper: "the upper tick of the position",
            },
          },
          "positionBalance(address)": {
            params: { user: "the user to get position balance for" },
            returns: { _0: "the number of positions owned by the user" },
          },
          "positionLiquidity(address,uint256)": {
            params: {
              id: "the id of the position",
              pool: "the pool the position belongs to",
            },
            returns: {
              _0: "the amount of liquidity contained in the position",
            },
          },
          "positionOwner(uint256)": {
            params: { id: "the id of the position" },
            returns: { _0: "the owner of the position" },
          },
          "quote(address,bool,int256,uint256)": {
            params: {
              amount:
                "the amount of token to swap, positive if exactIn, negative if exactOut",
              pool: "the pool to swap on",
              priceLimit:
                "the price limit for swaps, encoded as a sqrtX96 price",
              zeroForOne: "true if swapping token->fluid token",
            },
          },
          "quote2(address,address,uint256,uint256)": {
            params: {
              amount: "the amount of the input token to use",
              from: "the input token",
              minOut:
                "the minimum valid amount of the output token, reverts if not reached",
              to: "the output token",
            },
          },
          "setPoolEnabled(address,bool)": {
            params: {
              enabled: "true to enable to pool, false to disable it",
              pool: "the pool to enable or disable",
            },
          },
          "swap(address,bool,int256,uint256)": {
            params: {
              amount:
                "the amount of token to swap, positive if exactIn, negative if exactOut",
              pool: "the pool to swap on",
              priceLimit:
                "the price limit for swaps, encoded as a sqrtX96 price",
              zeroForOne: "true if swapping token->fluid token",
            },
            returns: { _0: "(token0, token1) delta" },
          },
          "swap2ExactIn(address,address,uint256,uint256)": {
            params: {
              _amount: "input amount (tokenA)",
              _minOut:
                "the minimum output amount (tokenB), reverting if the actual output is lower",
              _tokenA: "the input token",
              _tokenB: "the output token",
            },
            returns: { _0: "amount of token A in, amount of token B out" },
          },
          "swap2ExactInPermit2(address,address,uint256,uint256,uint256,uint256,bytes)":
            {
              params: {
                amount: "the amount of the input token to use",
                deadline: "the permit2 deadline",
                from: "the input token",
                minOut:
                  "the minimum valid amount of the output token, reverts if not reached",
                nonce: "the permit2 nonce",
                sig: "the permit2 signature",
                to: "the output token",
              },
              returns: { _0: "(amount in, amount out)" },
            },
          "swapIn(address,uint256,uint256)": {
            params: {
              _amount: "input amount (token)",
              _minOut:
                "the minimum output amount (usdc), reverting if the actual output is lower",
              _token: "the token to swap",
            },
            returns: { _0: "amount of usdc out" },
          },
          "swapInPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":
            {
              params: {
                _amount: "input amount (token)",
                _deadline: "the deadline for the token ",
                _maxAmount: "the max amount of the token ",
                _minOut:
                  "the minimum output amount (usdc), reverting if the actual output is lower",
                _nonce: "the nonce for the token ",
                _sig: "the signature for the token ",
                _token: "the token to swap",
              },
              returns: { _0: "amount of usdc out" },
            },
          "swapOut(address,uint256,uint256)": {
            params: {
              _amount: "input amount (usdc)",
              _minOut:
                "the minimum output amount (token), reverting if the actual output is lower",
              _token: "the token to swap",
            },
            returns: { _0: "amount of token out" },
          },
          "swapOutPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":
            {
              params: {
                _amount: "input amount (usdc)",
                _deadline: "the deadline for the token ",
                _maxAmount: "the max amount of the token ",
                _minOut:
                  "the minimum output amount (token), reverting if the actual output is lower",
                _nonce: "the nonce for the token ",
                _sig: "the signature for the token ",
                _token: "the token to swap",
              },
              returns: { _0: "amount of token out" },
            },
          "swapPermit2(address,bool,int256,uint256,uint256,uint256,uint256,bytes)":
            {
              params: {
                amount:
                  "the amount of token to swap, positive if exactIn, negative if exactOut",
                deadline: "the permit2 deadline",
                maxAmount: "the permit2 maxAmount",
                nonce: "the permit2 nonce",
                pool: "the pool to swap on",
                priceLimit:
                  "the price limit for swaps, encoded as a sqrtX96 price",
                sig: "the permit2 signature",
                zeroForOne: "true if swapping token->fluid token",
              },
              returns: { _0: "(token0, token1) delta" },
            },
          "transferPosition(uint256,address,address)": {
            params: {
              from: "the user to transfer the position from",
              id: "the id of the position to transfer",
              to: "the user to transfer the position to",
            },
          },
          "updatePosition(address,uint256,int128)": {
            params: {
              delta: "the amount of liquidity to add or remove",
              id: "the id of the position",
              pool: "the pool the position belongs to",
            },
            returns: { _0: "the deltas for token0 and token1 for the user" },
          },
          "updatePositionPermit2(address,uint256,int128,uint256,uint256,uint256,bytes,uint256,uint256,uint256,bytes)":
            {
              params: {
                deadline0: "the deadline for token 0",
                deadline1: "the deadline for token 1",
                delta: "the amount of liquidity to add or remove",
                id: "the id of the position",
                maxAmount0: "the max amount for token 0",
                maxAmount1: "the max amount for token 1",
                nonce0: "the nonce for token 0",
                nonce1: "the nonce for token 1",
                pool: "the pool the position belongs to",
                sig0: "the signature for token 0",
                sig1: "the signature for token 1",
              },
              returns: { _0: "the deltas for token0 and token1 for the user" },
            },
        },
        version: 1,
      },
      userdoc: {
        kind: "user",
        methods: {
          "burnPosition(uint256)": {
            notice:
              "burns a position, leaving the liquidity in it inaccessibleid the id of the position to burn",
          },
          "collect(address,uint256,uint128,uint128)": {
            notice: "collects fees from a position",
          },
          "collectProtocol(address,uint128,uint128)": {
            notice: "collects protocol fees. only usable by the seawater admin",
          },
          "createPool(address,uint256,uint32,uint8,uint128)": {
            notice: "initialises a new pool. only usable by the seawater admin",
          },
          "mintPosition(address,int32,int32)": {
            notice: "creates a new position",
          },
          "positionBalance(address)": {
            notice: "gets the number of positions owned by a user",
          },
          "positionLiquidity(address,uint256)": {
            notice: "gets the amount of liquidity in a position",
          },
          "positionOwner(uint256)": { notice: "gets the owner of a position" },
          "quote(address,bool,int256,uint256)": {
            notice:
              "reverts with the expected amount of fUSDC or pool token for a swap with the given parametersalways revert with Error(string(amountOut))",
          },
          "quote2(address,address,uint256,uint256)": {
            notice:
              "reverts with the expected amount of tokenOut for a 2-token swap with the given parametersalways revert with Error(string(amountOut))",
          },
          "setPoolEnabled(address,bool)": {
            notice: "enables or disables a pool",
          },
          "swap(address,bool,int256,uint256)": {
            notice: "swaps within a pool",
          },
          "swap2ExactIn(address,address,uint256,uint256)": {
            notice: "swaps tokenA for tokenB",
          },
          "swap2ExactInPermit2(address,address,uint256,uint256,uint256,uint256,bytes)":
            {
              notice:
                "performs a two stage swap across two pools using permit2 for token transferspermit2's max amount must be set to `amount`",
            },
          "swapIn(address,uint256,uint256)": {
            notice: "swaps _token for USDC",
          },
          "swapInPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":
            { notice: "swaps _token for USDC" },
          "swapOut(address,uint256,uint256)": {
            notice: "swaps USDC for _token",
          },
          "swapOutPermit2(address,uint256,uint256,uint256,uint256,uint256,bytes)":
            { notice: "swaps USDC for _token" },
          "swapPermit2(address,bool,int256,uint256,uint256,uint256,uint256,bytes)":
            { notice: "swaps within a pool using permit2 for token transfers" },
          "transferPosition(uint256,address,address)": {
            notice:
              "transferPosition transfers a position. usable only by the NFT manager",
          },
          "updatePosition(address,uint256,int128)": {
            notice:
              "refreshes a position's fees, and adds or removes liquidity",
          },
          "updatePositionPermit2(address,uint256,int128,uint256,uint256,uint256,bytes,uint256,uint256,uint256,bytes)":
            {
              notice:
                "refreshes a position's fees, and adds or removes liquidity using permit2 for token transfers",
            },
        },
        version: 1,
      },
    },
    settings: {
      remappings: [
        "@opensezppling/=lib/openzeppelin-contracts/",
        "ds-test/=lib/forge-std/lib/ds-test/src/",
        "forge-std/=lib/forge-std/src/",
      ],
      optimizer: { enabled: true, runs: 200 },
      metadata: { bytecodeHash: "ipfs" },
      compilationTarget: { "interfaces/ISeawaterAMM.sol": "ISeawaterAMM" },
      evmVersion: "london",
      libraries: {},
      viaIR: true,
    },
    sources: {
      "interfaces/ISeawaterAMM.sol": {
        keccak256:
          "0xd4d85018c6e7b7c2963f5af16edeadd874e670e5e365e18a66272f7057168400",
        urls: [
          "bzz-raw://e4b5f7cf8577f8beee3f90617a99a561a1dbef55c2f123121419c0ef8bbe70fb",
          "dweb:/ipfs/QmamdYQuqsnhYVotbzaQgvGFz4kmT4ebDYrpx6Q2WyfJ9r",
        ],
        license: null,
      },
      "interfaces/ISeawaterEvents.sol": {
        keccak256:
          "0x92fa6c5df90ddd8186e80f57075dc1df82703e0c2a111cf313a3e66d50a23940",
        urls: [
          "bzz-raw://d2c8d446e89f8b3b0819a5b3a7c2c0e53570a561e9104dc33bbd63be4cd818fa",
          "dweb:/ipfs/QmNiVkuLPTGfAwEfRqmVCNNAwfdQC4qrqkVYXD1Vi5NGY7",
        ],
        license: null,
      },
      "interfaces/ISeawaterExecutors.sol": {
        keccak256:
          "0x80b6914e08dd645ec8ed81fbd0cf0e765fea45c1a8bf45706663e1af4c5a4de9",
        urls: [
          "bzz-raw://a5f078528f259b82e974d9d5312135b0b013bd05bf51cbe39226d43107ffcf78",
          "dweb:/ipfs/Qmf86sceJAW2ZtVRFDeLz6bVpwB5GYdcQs331cDQEuuVKu",
        ],
        license: null,
      },
    },
    version: 1,
  },
  id: 2,
} as const;
