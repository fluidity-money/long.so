"use client";

import { motion } from "framer-motion";
import { Menu } from "@/components";
import { useState } from "react";
import { columns, Pool } from "@/app/stake/_DataTable/columns";
import { DataTable } from "@/app/stake/_DataTable/DataTable";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";

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

const Stake = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  return (
    <div className="z-10 flex flex-col items-center px-4">
      <motion.div
        layoutId="modal"
        className="flex w-full max-w-[500px] flex-col gap-4 rounded-lg bg-black p-4 text-white"
      >
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xs">My Positions</div>
          <Menu id="my-positions-list-grid" background="dark">
            <Menu.Item
              className={"mx-1 px-0 py-0"}
              selected={displayMode === "list"}
              onClick={() => setDisplayMode("list")}
            >
              <div className="text-2xs">List</div>
            </Menu.Item>
            <Menu.Item
              className={"mx-1 px-0 py-0"}
              selected={displayMode === "grid"}
              onClick={() => setDisplayMode("grid")}
            >
              <div className="text-2xs">Grid</div>
            </Menu.Item>
          </Menu>
        </div>

        <DataTable columns={columns} data={pools} />

        <div className="flex max-w-full flex-row gap-2">
          <Button
            className="flex-1 text-xs text-black"
            variant="iridescent"
            size="sm"
          >
            Claim all yield
          </Button>
          <Button className="flex-1 text-xs" variant="secondary" size="sm">
            + Create New Pool
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Stake;
