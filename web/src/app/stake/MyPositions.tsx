"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Token } from "@/components";
import List from "@/assets/icons/list.svg";
import { clsx } from "clsx";
import Grid from "@/assets/icons/grid.svg";
import { cn } from "@/lib/utils";
import { MyPositionsTable } from "@/app/stake/_MyPositionsTable/MyPositionsTable";
import { columns, Pool } from "@/app/stake/_MyPositionsTable/columns";
import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";
import Position from "@/assets/icons/position.svg";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";

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

export const MyPositions = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  const [expanded, setExpanded] = useState(false);

  const router = useRouter();

  return (
    <motion.div
      layoutId="modal"
      className="flex w-full flex-col gap-4 rounded-lg bg-black p-4 text-white"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-2xs">My Positions</div>
        <Menu id="my-positions-list-grid" background="dark">
          <Menu.Item
            className={"mx-1 p-0"}
            selected={displayMode === "list"}
            onClick={() => setDisplayMode("list")}
          >
            <div className={"flex flex-row items-center gap-1 text-2xs"}>
              <List
                className={clsx({
                  invert: displayMode === "list",
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
                  invert: displayMode === "grid",
                })}
              />
              Grid
            </div>
          </Menu.Item>
        </Menu>
      </div>

      <div
        className={cn("mb-4 h-[150px] overflow-y-scroll transition-[height]", {
          "h-[300px]": expanded,
        })}
      >
        {pools.length === 0 ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center">
            <div className="text-2xs">
              Your active staked positions will appear here.
            </div>
          </div>
        ) : displayMode === "list" ? (
          <MyPositionsTable columns={columns} data={pools} />
        ) : (
          <div
            className={cn("flex flex-row gap-4", {
              "flex-wrap": expanded,
            })}
          >
            {pools.map((pool) => (
              <div
                key={pool.id}
                className="flex h-[150px] w-[145px] cursor-pointer flex-col items-center gap-1 rounded-xl border border-white p-2"
                onClick={() => router.push(`/stake/pool/${pool.id}`)}
              >
                <div className="flex w-full flex-row">
                  <div className="size-2 rounded-full bg-red-500" />
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <Token className="ml-1" />
                    <Token className="-ml-2" />
                  </div>
                  <div className="flex flex-row justify-center">
                    <Badge variant="secondary" className="p-0.5 px-1 text-3xs">
                      {pool.tokens[0].name}
                      {" x "}
                      {pool.tokens[1].name}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div>{usdFormat(pool.staked)}</div>
                  <div className="text-3xs text-gray-2">No Yield Yet</div>
                </div>

                <Badge
                  variant="secondary"
                  className="gap-2 text-nowrap text-2xs"
                >
                  <Position />
                  <div>$20 Position</div>
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {pools.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="z-20 mt-[calc(-3rem+1px)] h-4 w-full bg-gradient-to-t from-black to-transparent" />
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
      )}

      <div className="flex max-w-full flex-row gap-2">
        {pools.length > 0 && (
          <div className="flex flex-1 flex-col items-center">
            <Button
              className="w-full text-xs text-black"
              variant="iridescent"
              size="sm"
            >
              Claim all yield
            </Button>
            <Badge
              variant="iridescent"
              className="-mt-2 gap-2 border-2 border-black text-2xs"
            >
              {usdFormat(920.12)}
            </Badge>
          </div>
        )}
        <Button className="flex-1 text-xs" variant="secondary" size="sm">
          + Create New Pool
        </Button>
      </div>
    </motion.div>
  );
};
