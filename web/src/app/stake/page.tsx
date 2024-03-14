"use client";

import { Menu } from "@/components";
import { useState } from "react";
import { CampaignBanner } from "@/components/CampaignBanner";
import List from "@/assets/icons/list.svg";
import Grid from "@/assets/icons/grid.svg";
import { clsx } from "clsx";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { MyPositions } from "@/app/stake/MyPositions";
import { AllPoolsTable } from "@/app/stake/_AllPoolsTable/AllPoolsTable";
import { columns, Pool } from "@/app/stake/_AllPoolsTable/columns";
import { nanoid } from "nanoid";
import { ContentType } from "recharts/types/component/Tooltip";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { format, subDays } from "date-fns";
import { usdFormat } from "@/lib/usdFormat";

const data = [
  {
    name: "Page A",
    date: new Date(),
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    date: subDays(new Date(), 1),
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    date: subDays(new Date(), 2),
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    date: subDays(new Date(), 3),
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    date: subDays(new Date(), 4),
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    date: subDays(new Date(), 5),
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    date: subDays(new Date(), 6),
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page H",
    date: subDays(new Date(), 7),
    uv: 3490,
    pv: 4300,
    amt: 2400,
  },
  {
    name: "Page A",
    date: subDays(new Date(), 8),
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    date: subDays(new Date(), 9),
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    date: subDays(new Date(), 10),
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    date: subDays(new Date(), 11),
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    date: subDays(new Date(), 12),
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    date: subDays(new Date(), 13),
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    date: subDays(new Date(), 14),
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page H",
    date: subDays(new Date(), 15),
    uv: 3490,
    pv: 4300,
    amt: 2400,
  },
  {
    name: "Page A",
    date: subDays(new Date(), 16),
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    date: subDays(new Date(), 17),
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    date: subDays(new Date(), 18),
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    date: subDays(new Date(), 19),
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    date: subDays(new Date(), 20),
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    date: subDays(new Date(), 21),
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    date: subDays(new Date(), 22),
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Page H",
    date: subDays(new Date(), 23),
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

const CustomTooltip: ContentType<ValueType, NameType> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col items-center rounded-xl bg-black p-4 text-white">
        <p className="text-sm">{usdFormat(payload[0].value as number)}</p>
        <p className="text-xs text-gray-2">
          {format(payload[0].payload.date, "P")}
        </p>
      </div>
    );
  }

  return null;
};

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

        <div className="hidden w-full max-w-[500px] flex-1 flex-col md:flex">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="text-nowrap text-2xs">My Yield Over Time</div>

            <Menu id="yield-over-time-graph-duration">
              <Menu.Item
                className="mx-1 p-0.5 text-xs"
                selected={activeGraphDuration === "7D"}
                onClick={() => setActiveGraphDuration("7D")}
              >
                7D
              </Menu.Item>
              <Menu.Item
                className="mx-1 p-0.5 text-xs"
                selected={activeGraphDuration === "1M"}
                onClick={() => setActiveGraphDuration("1M")}
              >
                1M
              </Menu.Item>
              <Menu.Item
                className="mx-1 p-0.5 text-xs"
                selected={activeGraphDuration === "6M"}
                onClick={() => setActiveGraphDuration("6M")}
              >
                6M
              </Menu.Item>
              <Menu.Item
                className="mx-1 p-0.5 text-xs"
                selected={activeGraphDuration === "1Y"}
                onClick={() => setActiveGraphDuration("1Y")}
              >
                1Y
              </Menu.Item>
              <Menu.Item
                className="mx-1 p-0.5 text-xs"
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
              <BarChart data={data} dataKey={"date"}>
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

                <Tooltip content={<CustomTooltip />} />

                {/* Bar for the black bottom section */}
                <Bar
                  dataKey="uv"
                  stackId="stack"
                  shape={<CustomBar fill="#000" />}
                />

                {/* Bar with the gradient on top */}
                <Bar dataKey="pv" stackId="stack" shape={<CustomBar />} />
              </BarChart>
            </ResponsiveContainer>

            <div className="text-xs text-gray-2">Showing October 2023</div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Stake;
