"use client";

import { useSwapPro } from "@/stores/useSwapPro";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Menu } from "@/components";
import { useState } from "react";
import { startCase } from "lodash";
import { useModalStore } from "@/app/TokenModal";
import { DataTable } from "@/app/_DataTable/DataTable";
import { columns, Transaction } from "@/app/_DataTable/columns";
import { startOfDay } from "date-fns";

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

const Graph = () => {
  const [activeGraphType, setActiveGraphType] = useState<
    "price" | "volume" | "liquidity"
  >("volume");

  const [activeGraphDuration, setActiveGraphDuration] = useState<
    "7D" | "1M" | "6M" | "1Y" | "ALL"
  >("7D");

  return (
    <>
      <Menu id="graph">
        <Menu.Item
          className="mx-1 px-1 py-1"
          selected={activeGraphType === "price"}
          onClick={() => setActiveGraphType("price")}
        >
          Price
        </Menu.Item>
        <Menu.Item
          className="mx-1 px-1 py-1"
          selected={activeGraphType === "volume"}
          onClick={() => setActiveGraphType("volume")}
        >
          Volume
        </Menu.Item>
        <Menu.Item
          className="mx-1 px-1 py-1"
          selected={activeGraphType === "liquidity"}
          onClick={() => setActiveGraphType("liquidity")}
        >
          Liquidity
        </Menu.Item>
      </Menu>

      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between">
          <div>
            <div className="text-sm md:hidden">
              {/* this text is only shown on mobile */}
              fUSDC/ETH {startCase(activeGraphType)}
            </div>
          </div>

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
        <TypographyH2 className="border-b-0">$12.05</TypographyH2>

        <div className="flex flex-col gap-2">
          <ResponsiveContainer height={150} width="100%">
            <BarChart data={data}>
              <Bar dataKey="uv" fill="#1E1E1E" />
            </BarChart>
          </ResponsiveContainer>

          <div className="text-xs">5th October 2023</div>
        </div>
      </div>
    </>
  );
};

export const SwapPro = () => {
  const { swapPro, setSwapPro } = useSwapPro();

  const { enabled } = useModalStore();

  if (enabled) return null;

  return (
    <div className="z-10 flex flex-col items-center justify-center">
      <div
        className={cn(
          "flex w-full flex-col gap-4 overflow-x-clip p-4 sm:w-[500px]",
          swapPro
            ? "px-4 pl-8 md:mr-10 md:w-[500px] lg:w-[500px] xl:w-[600px]"
            : "md:h-0 md:w-0 md:p-0",
        )}
      >
        <TypographyH3 className="hidden font-normal md:inline-flex">
          fUSDC/ETH
        </TypographyH3>

        <Graph />

        <div className="flex hidden w-full flex-row flex-wrap items-center justify-between gap-2 md:inline-flex">
          <div>
            <p className="text-xs">Liquidity</p>
            <p className="text-2xl">$1.01M</p>
          </div>

          <div>
            <p className="text-xs">Volume 24H</p>
            <p className="text-2xl">$115.21K</p>
          </div>

          <div>
            <p className="text-xs">Stake APY</p>
            <p className="text-2xl">1.62%</p>
          </div>

          <div>
            <p className="text-xs">24H Trade Rewards</p>
            <p className="text-2xl">$300.56</p>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex w-full flex-row items-center justify-between">
            <h3>Transaction History</h3>
            <div>
              <span className="underline">My Transactions</span> {"->"}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={
            [
              {
                id: "1",
                value: 100,
                rewards: 200,
                time: startOfDay(new Date()),
                amountFrom: 30.2,
                amountTo: 0.0001,
              },
              {
                id: "2",
                value: 300,
                rewards: 20,
                time: startOfDay(new Date()),
                amountFrom: 30.2,
                amountTo: 0.0001,
              },
            ] as Transaction[]
          }
        />
      </div>
    </div>
  );
};
