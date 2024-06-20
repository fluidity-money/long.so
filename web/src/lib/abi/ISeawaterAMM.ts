export const output = {
  "abi": [
    {
      "type": "function",
      "name": "burnPosition",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "collect",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "amount0",
          "type": "uint128",
          "internalType": "uint128"
        },
        {
          "name": "amount1",
          "type": "uint128",
          "internalType": "uint128"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint128",
          "internalType": "uint128"
        },
        {
          "name": "",
          "type": "uint128",
          "internalType": "uint128"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "collectProtocol",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount0",
          "type": "uint128",
          "internalType": "uint128"
        },
        {
          "name": "amount1",
          "type": "uint128",
          "internalType": "uint128"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint128",
          "internalType": "uint128"
        },
        {
          "name": "",
          "type": "uint128",
          "internalType": "uint128"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createPool",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "sqrtPriceX96",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "fee",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "tickSpacing",
          "type": "uint8",
          "internalType": "uint8"
        },
        {
          "name": "maxLiquidityPerTick",
          "type": "uint128",
          "internalType": "uint128"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "curTick",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int32",
          "internalType": "int32"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "feeGrowthGlobal0",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "feeGrowthGlobal1",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "mintPosition",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "lower",
          "type": "int32",
          "internalType": "int32"
        },
        {
          "name": "upper",
          "type": "int32",
          "internalType": "int32"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "positionBalance",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "positionLiquidity",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint128",
          "internalType": "uint128"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "positionOwner",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "quote",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "amount",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "priceLimit",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "quote2",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "minOut",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setPoolEnabled",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "enabled",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "sqrtPriceX96",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swap",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "amount",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "priceLimit",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swap2ExactIn",
      "inputs": [
        {
          "name": "_tokenA",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_tokenB",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_minOut",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swap2ExactInPermit2",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "minOut",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "nonce",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "deadline",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "sig",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swapIn",
      "inputs": [
        {
          "name": "_token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_minOut",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swapInPermit2",
      "inputs": [
        {
          "name": "_token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_minOut",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_nonce",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_deadline",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_maxAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_sig",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swapOut",
      "inputs": [
        {
          "name": "_token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_minOut",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swapOutPermit2",
      "inputs": [
        {
          "name": "_token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_minOut",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_nonce",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_deadline",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_maxAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_sig",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "swapPermit2",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "amount",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "priceLimit",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "nonce",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "deadline",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "maxAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "sig",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferPosition",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "from",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updatePosition",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "delta",
          "type": "int128",
          "internalType": "int128"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updatePositionPermit2",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "delta",
          "type": "int128",
          "internalType": "int128"
        },
        {
          "name": "nonce0",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "deadline0",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "maxAmount0",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "sig0",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "nonce1",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "deadline1",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "maxAmount1",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "sig1",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "BurnPosition",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "owner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CollectFees",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "pool",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount0",
          "type": "uint128",
          "indexed": false,
          "internalType": "uint128"
        },
        {
          "name": "amount1",
          "type": "uint128",
          "indexed": false,
          "internalType": "uint128"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CollectProtocolFees",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount0",
          "type": "uint128",
          "indexed": false,
          "internalType": "uint128"
        },
        {
          "name": "amount1",
          "type": "uint128",
          "indexed": false,
          "internalType": "uint128"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "MintPosition",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "owner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pool",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "lower",
          "type": "int32",
          "indexed": false,
          "internalType": "int32"
        },
        {
          "name": "upper",
          "type": "int32",
          "indexed": false,
          "internalType": "int32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewPool",
      "inputs": [
        {
          "name": "token",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "fee",
          "type": "uint32",
          "indexed": true,
          "internalType": "uint32"
        },
        {
          "name": "price",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "decimals",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Swap1",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pool",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "zeroForOne",
          "type": "bool",
          "indexed": false,
          "internalType": "bool"
        },
        {
          "name": "amount0",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "amount1",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "finalTick",
          "type": "int32",
          "indexed": false,
          "internalType": "int32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Swap2",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amountIn",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "amountOut",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "fluidVolume",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "finalTick0",
          "type": "int32",
          "indexed": false,
          "internalType": "int32"
        },
        {
          "name": "finalTick1",
          "type": "int32",
          "indexed": false,
          "internalType": "int32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TransferPosition",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "UpdatePositionLiquidity",
      "inputs": [
        {
          "name": "id",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "delta",
          "type": "int128",
          "indexed": false,
          "internalType": "int128"
        }
      ],
      "anonymous": false
    }
  ],
} as const;
