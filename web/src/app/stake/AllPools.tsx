"use client";

import { Menu } from "@/components";
import List from "@/assets/icons/list.svg";
import { clsx } from "clsx";
import Grid from "@/assets/icons/grid.svg";
import { AllPoolsTable } from "@/app/stake/_AllPoolsTable/AllPoolsTable";
import { columns, Pool } from "@/app/stake/_AllPoolsTable/columns";
import { useState } from "react";
import { nanoid } from "nanoid";

const pools: Pool[] = [
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 12,
    claimable: false,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 12,
    claimable: false,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "fUSDC" }],
    annualPercentageYield: 12,
    claimable: false,
    fees: 14,
    rewards: 321,
    totalValueLocked: 4312,
    volume: 1231,
  },
];

export const AllPools = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-4 flex w-full max-w-screen-lg flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div className="text-xs">All Pools</div>

          <Menu id="unknown-list-grid">
            <Menu.Item
              className={"mx-1 p-0"}
              selected={displayMode === "list"}
              onClick={() => setDisplayMode("list")}
            >
              <div className={"flex flex-row items-center gap-1 text-2xs"}>
                <List
                  className={clsx({
                    invert: displayMode !== "list",
                  })}
                />
                List
              </div>
            </Menu.Item>
            <Menu.Item
              className={"mx-1 p-0"}
              selected={displayMode === "grid"}
              onClick={() => setDisplayMode("grid")}
            >
              <div className={"flex flex-row items-center gap-1 text-2xs"}>
                <Grid
                  className={clsx({
                    invert: displayMode !== "grid",
                  })}
                />
                Grid
              </div>
            </Menu.Item>
          </Menu>
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-2xs">TVL</div>
            <div className="text-2xl">$12.1M</div>
          </div>

          <div className="flex flex-col">
            <div className="text-2xs">Incentives</div>
            <div className="text-2xl">$200k</div>
          </div>

          <div className="flex flex-col">
            <div className="text-2xs">Rewards Claimed</div>
            <div className="text-2xl">$59.1K</div>
          </div>
        </div>

        <AllPoolsTable columns={columns} data={pools} />
      </div>
    </div>
  );
};
