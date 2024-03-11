"use client";

import { useSwapPro } from "@/stores/useSwapPro";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Menu } from "@/components";
import { useState } from "react";

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
        <div className="text-sm md:hidden">fUSDC/ETH Price</div>
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

  return (
    <div className="z-10 flex flex-col items-center justify-center px-4 pl-8">
      <div
        className={cn(
          "flex  w-[100%] max-w-[400px] flex-col gap-4 overflow-x-clip md:max-w-[600px]",
          swapPro ? "md:mr-10" : "md:h-0 md:w-0",
        )}
      >
        <TypographyH3 className="hidden font-normal md:inline-flex">
          fUSDC/ETH
        </TypographyH3>

        <Graph />

        <div className="flex hidden w-full flex-row items-center justify-between md:inline-flex">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Value</TableHead>
                <TableHead className="w-[180px]">fUSDC/ETH</TableHead>
                <TableHead>Rewards</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$100</TableCell>
                <TableCell className="font-medium">fUSDC {"->"} ETH</TableCell>
                <TableCell>$0.21</TableCell>
                <TableCell>1 min</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
