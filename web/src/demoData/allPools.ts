import { Pool } from "@/app/stake/_AllPoolsTable/columns";

export const mockAllPools: Pool[] = [
  {
    id: "1",
    tokens: [
      {
        address: "0x0",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        icon: "/icons/usd-coin-usdc-logo.svg",
      },
      {
        name: "fUSDC",
        symbol: "fUSDC",
        decimals: 6,
        icon: "/icons/fUSDC.svg",
        address: "0x0",
      },
    ],
    annualPercentageYield: 12,
    claimable: true,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
    liquidityRange: ["0", "0"],
  },
  {
    id: "2",
    tokens: [
      {
        address: "0x0",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        icon: "/icons/usd-coin-usdc-logo.svg",
      },

      {
        name: "fUSDC",
        symbol: "fUSDC",
        decimals: 6,
        icon: "/icons/fUSDC.svg",
        address: "0x0",
      },
    ],
    annualPercentageYield: 5,
    claimable: false,
    fees: 13,
    rewards: 413,
    totalValueLocked: 1213,
    volume: 5421,
    boosted: true,
    liquidityRange: ["0", "0"],
  },
  {
    id: "3",
    tokens: [
      {
        address: "0x0",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        icon: "/icons/usd-coin-usdc-logo.svg",
      },

      {
        name: "fUSDC",
        symbol: "fUSDC",
        decimals: 6,
        icon: "/icons/fUSDC.svg",
        address: "0x0",
      },
    ],
    annualPercentageYield: 4,
    claimable: true,
    fees: 16,
    rewards: 131,
    totalValueLocked: 5412,
    volume: 8734,
    liquidityRange: ["0", "0"],
  },
  {
    id: "4",
    tokens: [
      {
        address: "0x0",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        icon: "/icons/usd-coin-usdc-logo.svg",
      },

      {
        name: "fUSDC",
        symbol: "fUSDC",
        decimals: 6,
        icon: "/icons/fUSDC.svg",
        address: "0x0",
      },
    ],
    annualPercentageYield: 12,
    claimable: true,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
    boosted: true,
    liquidityRange: ["0", "0"],
  },
  {
    id: "5",
    tokens: [
      {
        address: "0x0",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        icon: "/icons/usd-coin-usdc-logo.svg",
      },

      {
        name: "fUSDC",
        symbol: "fUSDC",
        decimals: 6,
        icon: "/icons/fUSDC.svg",
        address: "0x0",
      },
    ],
    annualPercentageYield: 5,
    claimable: false,
    fees: 13,
    rewards: 413,
    totalValueLocked: 1213,
    volume: 5421,
    boosted: true,
    liquidityRange: ["0", "0"],
  },
  {
    id: "6",
    tokens: [
      {
        address: "0x0",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        icon: "/icons/usd-coin-usdc-logo.svg",
      },

      {
        name: "fUSDC",
        symbol: "fUSDC",
        decimals: 6,
        icon: "/icons/fUSDC.svg",
        address: "0x0",
      },
    ],
    annualPercentageYield: 4,
    claimable: true,
    fees: 16,
    rewards: 131,
    totalValueLocked: 5412,
    volume: 8734,
    liquidityRange: ["0", "0"],
  },
];
