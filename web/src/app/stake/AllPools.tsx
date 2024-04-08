"use client";

import List from "@/assets/icons/list.svg";
import Grid from "@/assets/icons/grid.svg";
import { AllPoolsTable } from "@/app/stake/_AllPoolsTable/AllPoolsTable";
import { columns, Pool } from "@/app/stake/_AllPoolsTable/columns";
import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { AllPoolsFilter } from "@/app/stake/AllPoolsFilter";
import SegmentedControl from "@/components/ui/segmented-control";
import Ethereum from "@/assets/icons/ethereum.svg";
import { Badge } from "@/components/ui/badge";
import IridescentToken from "@/assets/icons/iridescent-token.svg";
import { usdFormat } from "@/lib/usdFormat";

const pools: Pool[] = [
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 12,
    claimable: true,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 5,
    claimable: false,
    fees: 13,
    rewards: 413,
    totalValueLocked: 1213,
    volume: 5421,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 4,
    claimable: true,
    fees: 16,
    rewards: 131,
    totalValueLocked: 5412,
    volume: 8734,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 12,
    claimable: true,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 5,
    claimable: false,
    fees: 13,
    rewards: 413,
    totalValueLocked: 1213,
    volume: 5421,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 4,
    claimable: true,
    fees: 16,
    rewards: 131,
    totalValueLocked: 5412,
    volume: 8734,
  },
];

const DisplayModeMenu = ({
  setDisplayMode,
}: {
  setDisplayMode: (mode: "list" | "grid") => void;
}) => {
  return (
    <SegmentedControl
      name={"display-mode"}
      callback={(val) => setDisplayMode(val)}
      segments={[
        {
          label: (
            <div className={"flex flex-row items-center gap-1"}>
              <List className={"invert"} />
              List
            </div>
          ),
          value: "list",
          ref: useRef(),
        },
        {
          label: (
            <div className={"flex flex-row items-center gap-1"}>
              <Grid className={"invert"} />
              Grid
            </div>
          ),
          value: "grid",
          ref: useRef(),
        },
      ]}
    />
  );
};

export const AllPools = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-4 flex w-full max-w-screen-lg flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div className="text-2xs md:text-sm">All Pools</div>

          {/* only shown on mobile */}
          <div className="md:hidden">
            <DisplayModeMenu setDisplayMode={setDisplayMode} />
          </div>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-4">
          <div className="flex flex-1 flex-row justify-between">
            <div className="flex flex-col">
              <div className="text-3xs md:text-2xs">TVL</div>
              <div className="text-2xl md:text-3xl">$12.1M</div>
            </div>

            <div className="flex flex-col">
              <div className="text-3xs md:text-2xs">Incentives</div>
              <div className="text-2xl md:text-3xl">$200k</div>
            </div>

            <div className="flex flex-col">
              <div className="text-3xs md:text-2xs">Rewards Claimed</div>
              <div className="text-2xl md:text-3xl">$59.1K</div>
            </div>
          </div>

          <div className="flex flex-1 flex-row justify-center gap-4">
            <AllPoolsFilter />

            {/* not shown on mobile */}
            <div className="hidden flex-col justify-end md:flex">
              <div>
                <DisplayModeMenu setDisplayMode={setDisplayMode} />
              </div>
            </div>
          </div>
        </div>

        {displayMode === "list" && (
          <AllPoolsTable columns={columns} data={pools} />
        )}

        {displayMode === "grid" && (
          <div className={"flex flex-row flex-wrap gap-[20px] pl-[12px]"}>
            {pools.map((pool) => (
              <div
                key={pool.id}
                className={
                  "relative h-[169px] w-[179px] rounded-[5px] bg-black text-white"
                }
              >
                <div className={"absolute -top-2 left-0 flex flex-row"}>
                  <Ethereum
                    className={"size-[24px] rounded-full border border-white"}
                  />
                  <Badge
                    variant={"outline"}
                    className={"-ml-1.5 bg-black pl-0.5 text-white"}
                  >
                    <IridescentToken className={"size-[18px]"} />
                    {pool.tokens[0].name}-{pool.tokens[1].name}
                  </Badge>
                </div>

                <div
                  className={
                    "mt-[34px] w-full text-center text-xl font-semibold"
                  }
                >
                  {usdFormat(pool.rewards)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
