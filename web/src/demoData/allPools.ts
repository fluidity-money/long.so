import { Pool } from "@/app/stake/_AllPoolsTable/columns";

export const mockAllPools: Pool[] = [
  {
    id: "1",
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 12,
    claimable: true,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
  },
  {
    id: "2",
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 5,
    claimable: false,
    fees: 13,
    rewards: 413,
    totalValueLocked: 1213,
    volume: 5421,
    boosted: true,
  },
  {
    id: "3",
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 4,
    claimable: true,
    fees: 16,
    rewards: 131,
    totalValueLocked: 5412,
    volume: 8734,
  },
  {
    id: "4",
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 12,
    claimable: true,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
    boosted: true,
  },
  {
    id: "5",
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 5,
    claimable: false,
    fees: 13,
    rewards: 413,
    totalValueLocked: 1213,
    volume: 5421,
    boosted: true,
  },
  {
    id: "6",
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 4,
    claimable: true,
    fees: 16,
    rewards: 131,
    totalValueLocked: 5412,
    volume: 8734,
  },
];
