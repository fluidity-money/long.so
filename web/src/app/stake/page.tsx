"use client";

import { Menu, Token } from "@/components";
import { useState } from "react";
import { columns, Pool } from "@/app/stake/_DataTable/columns";
import { DataTable } from "@/app/stake/_DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { CampaignBanner } from "@/components/CampaignBanner";
import List from "@/assets/icons/list.svg";
import Grid from "@/assets/icons/grid.svg";
import Position from "@/assets/icons/position.svg";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";
import { useRouter } from "next/navigation";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { ResponsiveBar } from "@nivo/bar";
import { linearGradientDef } from "@nivo/core";

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

const MyPositions = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  const [expanded, setExpanded] = useState(false);

  const router = useRouter();

  return (
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
          <DataTable columns={columns} data={pools} />
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
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <Token className="ml-1" />
                    <Token className="-ml-2" />
                  </div>
                  <div className="flex flex-row justify-center">
                    <Badge variant="secondary" className="text-3xs p-0.5 px-1">
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
                  className="text-2xs gap-2 text-nowrap"
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
      )}

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
  );
};

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page H",
    uv: 3490,
    pv: 4300,
    amt: 2400,
  },
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page H",
    uv: 3490,
    pv: 4300,
    amt: 2400,
  },
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page H",
    uv: 3490,
    pv: 4300,
    amt: 2400,
  },
];

// Custom bar component to include borders
const CustomBar = (props: any) => {
  const { fill, x, y, width, height } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="black"
        strokeWidth={2}
        fill={fill ?? `url(#gradientFill)`}
      />
    </g>
  );
};

const MyChart = () => (
  <ResponsiveBar
    data={data}
    keys={["value1", "value2"]}
    indexBy="country"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.3}
    groupMode="stacked"
    colors={{ scheme: "nivo" }} // Start with a basic color scheme
    defs={[
      linearGradientDef("gradientA", [
        { offset: 0, color: "blue", opacity: 0.8 },
        { offset: 100, color: "red", opacity: 0.8 },
      ]),
    ]}
    fill={[
      // Black fill for the bottom bar
      { match: { id: "value1" }, id: "black" },
      // Gradient fill for top bar
      { match: { id: "value2" }, id: "gradientA" },
    ]}
    borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
    }}
    // ... other Nivo bar chart properties
  />
);

const Stake = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  const [activeGraphDuration, setActiveGraphDuration] = useState<
    "7D" | "1M" | "6M" | "1Y" | "ALL"
  >("7D");

  return (
    <div className="z-10 flex flex-col items-center gap-2 px-4">
      <div className="w-full max-w-[500px]">
        <CampaignBanner />
      </div>
      <div className="flex w-full flex-row justify-center gap-8">
        <div className="flex w-full max-w-[500px] flex-1 flex-col gap-2">
          <MyPositions />
        </div>

        <div className="flex hidden w-full max-w-[500px] flex-1 flex-col md:inline-flex">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="text-2xs text-nowrap">My Yield Over Time</div>

            <Menu id="graph-duration">
              <Menu.Item
                className="mx-1 px-0.5 py-0.5 text-xs"
                selected={activeGraphDuration === "7D"}
                onClick={() => setActiveGraphDuration("7D")}
              >
                7D
              </Menu.Item>
              <Menu.Item
                className="mx-1 px-0.5 py-0.5 text-xs"
                selected={activeGraphDuration === "1M"}
                onClick={() => setActiveGraphDuration("1M")}
              >
                1M
              </Menu.Item>
              <Menu.Item
                className="mx-1 px-0.5 py-0.5 text-xs"
                selected={activeGraphDuration === "6M"}
                onClick={() => setActiveGraphDuration("6M")}
              >
                6M
              </Menu.Item>
              <Menu.Item
                className="mx-1 px-0.5 py-0.5 text-xs"
                selected={activeGraphDuration === "1Y"}
                onClick={() => setActiveGraphDuration("1Y")}
              >
                1Y
              </Menu.Item>
              <Menu.Item
                className="mx-1 px-0.5 py-0.5 text-xs"
                selected={activeGraphDuration === "ALL"}
                onClick={() => setActiveGraphDuration("ALL")}
              >
                ALL
              </Menu.Item>
            </Menu>
          </div>

          <div className="text-3xl">$12,500.42</div>

          <div className="mt-16 flex flex-col gap-2">
            <ResponsiveContainer height={150} width="100%">
              <BarChart data={data}>
                <defs>
                  <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="rgba(243, 184, 216, 0.4)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="25%"
                      stopColor="rgba(183, 147, 233, 0.4)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="50%"
                      stopColor="rgba(159, 212, 243, 0.4)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="75%"
                      stopColor="rgba(255, 210, 196, 0.4)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor="rgba(251, 243, 243, 0.4)"
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>

                <Tooltip />

                {/* Bar for the black bottom section */}
                <Bar
                  dataKey="uv"
                  stackId="stack"
                  shape={<CustomBar fill="#000" />}
                />

                {/* Bar with the gradient on top */}
                <Bar dataKey="uv" stackId="stack" shape={<CustomBar />} />
              </BarChart>
            </ResponsiveContainer>

            <div className="text-xs text-gray-2">Showing October 2023</div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="mt-24 flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <div className="text-xs">All Pools</div>

            <Menu id="my-positions-list-grid">
              <Menu.Item
                className={"mx-1 px-0 py-0"}
                selected={displayMode === "list"}
                onClick={() => setDisplayMode("list")}
              >
                <div className={"text-2xs flex flex-row items-center gap-1"}>
                  <List
                    className={clsx({
                      invert: displayMode !== "list",
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
        </div>
      </div>
    </div>
  );
};

export default Stake;
