"use client";

import { Menu } from "@/components";
import List from "@/assets/icons/list.svg";
import { clsx } from "clsx";
import Grid from "@/assets/icons/grid.svg";
import { AllPoolsTable } from "@/app/stake/_AllPoolsTable/AllPoolsTable";
import { columns, Pool } from "@/app/stake/_AllPoolsTable/columns";
import { useState } from "react";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import Search from "@/assets/icons/Search.svg";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  displayMode,
  setDisplayMode,
  id,
}: {
  displayMode: "list" | "grid";
  setDisplayMode: (mode: "list" | "grid") => void;
  id: string;
}) => {
  return (
    <Menu id={`all-pools-list-grid-${id}`}>
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
  );
};

export const AllPools = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  const [newPools, setNewPools] = useState(false);
  const [boostedPools, setBoostedPools] = useState(false);
  const [myAssets, setMyAssets] = useState(false);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-4 flex w-full max-w-screen-lg flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div className="text-xs">All Pools</div>

          {/* only shown on mobile */}
          <div className="md:hidden">
            <DisplayModeMenu
              id={"1"}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
            />
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-row justify-between pr-24">
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

          <div className="flex flex-1 flex-row gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center border-b border-black">
                <Search className="size-4" />
                <Input
                  className="h-8 w-[350px] border-0 bg-white text-xs"
                  placeholder="Search for tokens by name, symbol, or contract address."
                />
              </div>
              <div className="flex flex-row justify-between">
                <Badge
                  className={cn("h-6 py-0 pl-0", {
                    "bg-white text-black hover:bg-white/80": !newPools,
                  })}
                >
                  <Switch
                    id={"new-pools"}
                    className={cn("my-0 -ml-2 scale-50", {
                      invert: !newPools,
                    })}
                    checked={newPools}
                    onCheckedChange={setNewPools}
                  />
                  <Label htmlFor={"new-pools"} className="text-2xs">
                    New Pools
                  </Label>
                </Badge>
                <Badge
                  className={cn("h-6 py-0 pl-0", {
                    "bg-white text-black hover:bg-white/80": !boostedPools,
                  })}
                >
                  <Switch
                    id={"boosted-pools"}
                    className={cn("my-0 -ml-2 scale-50", {
                      invert: !boostedPools,
                    })}
                    checked={boostedPools}
                    onCheckedChange={setBoostedPools}
                  />
                  <Label htmlFor={"boosted-pools"} className="text-2xs">
                    Boosted Pools
                  </Label>
                </Badge>
                <Badge
                  className={cn("h-6 py-0 pl-0", {
                    "bg-white text-black hover:bg-white/80": !myAssets,
                  })}
                >
                  <Switch
                    id={"my-assets"}
                    className={cn("my-0 -ml-2 scale-50", {
                      invert: !myAssets,
                    })}
                    checked={myAssets}
                    onCheckedChange={setMyAssets}
                  />
                  <Label htmlFor={"my-assets"} className="text-2xs">
                    My Assets
                  </Label>
                </Badge>
              </div>
            </div>

            {/* not shown on mobile */}
            <div className="hidden flex-col justify-end md:flex">
              <div>
                <DisplayModeMenu
                  id={"2"}
                  displayMode={displayMode}
                  setDisplayMode={setDisplayMode}
                />
              </div>
            </div>
          </div>
        </div>

        <AllPoolsTable columns={columns} data={pools} />
      </div>
    </div>
  );
};
