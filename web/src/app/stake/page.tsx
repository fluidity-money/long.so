"use client";

import { Menu } from "@/components";
import { useState } from "react";
import { columns, Pool } from "@/app/stake/_DataTable/columns";
import { DataTable } from "@/app/stake/_DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { CampaignBanner } from "@/components/CampaignBanner";
import List from "@/assets/icons/list.svg";
import Grid from "@/assets/icons/grid.svg";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";

const pools: Pool[] = [
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "ETH" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDT" }, { name: "ETH" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "USDT" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "ETH" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDT" }, { name: "ETH" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "USDT" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "ETH" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDT" }, { name: "ETH" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
  {
    id: nanoid(),
    tokens: [{ name: "USDC" }, { name: "USDT" }],
    duration: 100,
    staked: 100,
    totalYield: 100,
  },
];

// const pools: Pool[] = [];

const Stake = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="z-10 flex flex-col items-center px-4">
      <div className="flex w-full max-w-[500px] flex-col gap-2">
        <CampaignBanner />

        <div className="flex w-full flex-col gap-4 rounded-lg bg-black p-4 text-white">
          <div className="flex flex-row items-center justify-between">
            <div className="text-2xs">My Positions</div>
            <Menu id="my-positions-list-grid" background="dark">
              <Menu.Item
                className={"mx-1 px-0 py-0"}
                selected={displayMode === "list"}
                onClick={() => setDisplayMode("list")}
              >
                <div className={"text-2xs flex flex-row items-center gap-1"}>
                  <List
                    className={clsx({
                      invert: displayMode === "list",
                    })}
                  />
                  List
                </div>
              </Menu.Item>
              <Menu.Item
                className={"mx-1 px-0 py-0"}
                selected={displayMode === "grid"}
                onClick={() => setDisplayMode("grid")}
              >
                <div className={"text-2xs flex flex-row items-center gap-1"}>
                  <Grid
                    className={clsx({
                      invert: displayMode === "grid",
                    })}
                  />
                  Grid
                </div>
              </Menu.Item>
            </Menu>
          </div>

          {displayMode === "list" ? (
            <div
              className={cn("h-[180px] overflow-y-scroll transition-[height]", {
                "h-[300px]": expanded,
              })}
            >
              {pools.length > 0 ? (
                <DataTable columns={columns} data={pools} />
              ) : (
                <div className="flex min-h-[180px] flex-col items-center justify-center">
                  <div className="text-2xs">
                    Your active staked positions will appear here.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>Grid</div>
          )}

          <div className="flex flex-col items-center">
            <div className="z-20 -mt-8 h-4 w-full bg-gradient-to-t from-black to-transparent" />
            <Button
              variant="link"
              className="group flex flex-row gap-2 text-white hover:no-underline"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <>
                  <div className="group-hover:underline">Hide</div>
                  <div className="-rotate-90">{"->"}</div>
                </>
              ) : (
                <>
                  <div className="group-hover:underline">Expand</div>
                  <div className="rotate-90">{"->"}</div>
                </>
              )}
            </Button>
          </div>

          <div className="flex max-w-full flex-row gap-2">
            {pools.length > 0 && (
              <Button
                className="flex-1 text-xs text-black"
                variant="iridescent"
                size="sm"
              >
                Claim all yield
              </Button>
            )}
            <Button className="flex-1 text-xs" variant="secondary" size="sm">
              + Create New Pool
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
