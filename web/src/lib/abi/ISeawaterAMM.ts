export const output = {
  "abi": [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_proxyAdmin",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_seawaterAdmin",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_nftManager",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_executorSwap",
          "type": "address",
          "internalType": "contract ISeawaterExecutorSwap"
        },
        {
          "name": "_executorSwapPermit2",
          "type": "address",
          "internalType": "contract ISeawaterExecutorSwapPermit2"
        },
        {
          "name": "_executorQuote",
          "type": "address",
          "internalType": "contract ISeawaterExecutorQuote"
        },
        {
          "name": "_executorPosition",
          "type": "address",
          "internalType": "contract ISeawaterExecutorPosition"
        },
        {
          "name": "_executorUpdatePosition",
          "type": "address",
          "internalType": "contract ISeawaterExecutorUpdatePosition"
        },
        {
          "name": "_executorAdmin",
          "type": "address",
          "internalType": "contract ISeawaterExecutorAdmin"
        },
        {
          "name": "_executorFallback",
          "type": "address",
          "internalType": "contract ISeawaterExecutorFallback"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "fallback",
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burnPositionAE401070",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
    "type": "function",
    "name": "collect7F21947C",
    "inputs": [
      {
        "name": "pools",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct ISeawaterExecutorPosition.CollectResult[]",
        "components": [
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
        ]
      }
    ],
    "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "collectProtocolE4E70DA4",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
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
      "name": "createPoolD650E2D0",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "",
          "type": "uint8",
          "internalType": "uint8"
        },
        {
          "name": "",
          "type": "uint128",
          "internalType": "uint128"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "curTick181C6FD9",
      "inputs": [
        {
          "name": "",
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
      "name": "enablePool579DA658",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "feeGrowthGlobal038B5665B",
      "inputs": [
        {
          "name": "",
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
      "name": "feeGrowthGlobal14EACF1BE",
      "inputs": [
        {
          "name": "",
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
      "name": "feesOwed22F28DBD",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
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
      "name": "incrPosition05FD2263",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
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
      "name": "mintPositionBC5B086D",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "int32",
          "internalType": "int32"
        },
        {
          "name": "",
          "type": "int32",
          "internalType": "int32"
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
      "name": "positionBalance4F32C7DB",
      "inputs": [
        {
          "name": "",
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
      "name": "positionLiquidity8D11C045",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
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
      "name": "positionOwnerD7878480",
      "inputs": [
        {
          "name": "",
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
      "name": "quote2CD06B86E",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
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
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "quote72E2ADE7",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "sqrtPriceX967B8F5FC5",
      "inputs": [
        {
          "name": "",
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
      "name": "swap2ExactIn41203F1D",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
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
      "name": "swap2ExactInPermit236B2FDD8",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
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
      "name": "swapIn32502CA71",
      "inputs": [
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amountIn",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "minOut",
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
      "name": "swapInPermit2CEAAB576",
      "inputs": [
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amountIn",
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
      "name": "swapOut5E08A399",
      "inputs": [
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amountIn",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "minOut",
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
      "name": "swapOutPermit23273373B",
      "inputs": [
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amountIn",
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
      "name": "swapPermit2EE84AD91",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
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
      "name": "swap_5a7d1bbd",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "",
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
      "name": "tickSpacing653FE28F",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint8",
          "internalType": "uint8"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferPositionEEC7A3CD",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateExecutors",
      "inputs": [
        {
          "name": "executorSwap",
          "type": "address",
          "internalType": "contract ISeawaterExecutorSwap"
        },
        {
          "name": "executorSwapPermit2",
          "type": "address",
          "internalType": "contract ISeawaterExecutorSwapPermit2"
        },
        {
          "name": "executorQuote",
          "type": "address",
          "internalType": "contract ISeawaterExecutorQuote"
        },
        {
          "name": "executorPosition",
          "type": "address",
          "internalType": "contract ISeawaterExecutorPosition"
        },
        {
          "name": "executorUpdatePosition",
          "type": "address",
          "internalType": "contract ISeawaterExecutorUpdatePosition"
        },
        {
          "name": "executorAdmin",
          "type": "address",
          "internalType": "contract ISeawaterExecutorAdmin"
        },
        {
          "name": "executorFallback",
          "type": "address",
          "internalType": "contract ISeawaterExecutorFallback"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updatePosition622A559D",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
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
      "name": "updatePositionPermit2F24010C3",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "int128",
          "internalType": "int128"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
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
      "name": "updateProxyAdmin",
      "inputs": [
        {
          "name": "newAdmin",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
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
          "name": "decimals",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        },
        {
          "name": "tickSpacing",
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
          "name": "token0",
          "type": "int256",
          "indexed": false,
          "internalType": "int256"
        },
        {
          "name": "token1",
          "type": "int256",
          "indexed": false,
          "internalType": "int256"
        }
      ],
      "anonymous": false
    }
  ]
} as const;
