"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SwapPro } from "@/components/SwapPro";
import { useHotkeys } from "react-hotkeys-hook";
import { Token } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { Line } from "rc-progress";

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
export default function PoolPage() {
  const router = useRouter();

  useHotkeys("esc", () => router.back());

  return (
    <div className="flex w-full flex-col">
      <div className="flex max-w-full flex-col-reverse justify-center gap-8 lg:flex-row">
        <div className="hidden md:inline-flex">
          <SwapPro override badgeTitle />
        </div>

        <div className="flex flex-col items-center">
          <div className="z-10 flex w-full max-w-[500px] flex-col px-4">
            <div className="flex flex-col gap-4 rounded-lg bg-black p-2 pt-0 text-white">
              <div className="flex flex-row items-center justify-between">
                <div className="p-4 text-xs">Manage Pool</div>
                <Button
                  variant="secondary"
                  className="h-8 px-2 text-xs"
                  onClick={() => {
                    router.back();
                  }}
                >
                  {"<-"} Esc
                </Button>
              </div>

              <div className="flex flex-row justify-between px-4">
                <div className="flex flex-row items-center">
                  <Token />
                  <Badge className="iridescent z-20 -ml-2 flex flex-row gap-2 border-4 border-black pl-1 text-black">
                    <Token />
                    <div className="text-nowrap text-lg md:text-xl">
                      fUSDC-ETH
                    </div>
                  </Badge>
                </div>

                <div className="flex flex-col items-end">
                  <Badge className="iridescent z-20 flex h-8 flex-row gap-2 border-4 border-black pl-1 text-black">
                    <div className="flex flex-row">
                      <Token size="small" />
                      <Token size="small" />
                      <Token size="small" />
                    </div>
                    <div className="text-2xs text-nowrap md:text-xs">
                      Live Utility Rewards
                    </div>
                  </Badge>

                  <p className="text-2xs">5days | 24hrs | 30min</p>
                </div>
              </div>

              <div className="flex flex-col gap-8 p-4">
                <div className="flex flex-row gap-2">
                  <Button
                    variant="secondary"
                    className="text-2xs flex-1"
                    size="sm"
                  >
                    + Add Liquidity
                  </Button>
                  <Button
                    variant="secondary"
                    className="text-2xs flex-1"
                    size="sm"
                  >
                    - Withdraw Liquidity
                  </Button>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <div className="text-2xs md:text-xs">My Pool Balance</div>
                    <div className="text-xl md:text-2xl">$190,301</div>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="text-2xs text-nowrap md:text-xs">
                      Unclaimed Rewards
                    </div>
                    <div className="text-xl md:text-2xl">$52,420</div>
                  </div>

                  <div>
                    <Button
                      variant="secondary"
                      className="h-8 px-8 py-0.5"
                      size="sm"
                    >
                      <div className="text-2xs">Claim Yield</div>
                    </Button>
                  </div>
                </div>

                <ResponsiveContainer height={150} width="100%">
                  <BarChart data={data}>
                    <Bar dataKey="uv" fill="#EBEBEB" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <div>Pool Reward Range</div>

                    <div>40% ~ 100%</div>
                  </div>

                  <div className="p-2">
                    <div className="flex flex-row justify-between text-sm">
                      <div>Earned Fees APR</div>

                      <div className="flex flex-row items-center gap-2">
                        <Token size="small" />
                        <div>1% ~ 5%</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between text-sm">
                      <div>Liquidity Incentives</div>

                      <div className="flex flex-row items-center gap-2">
                        <Token size="small" />
                        <div className="z-20 -ml-3">
                          <Token size="small" />
                        </div>
                        <div>15% ~ 25%</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between text-sm">
                      <div>Super Incentives</div>

                      <div className="flex flex-row items-center gap-2">
                        <Token size="small" />
                        <div>20% ~ 30%</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between text-sm">
                    <div>Utility Incentives</div>

                    <div className="flex flex-row items-center gap-2">
                      <Token size="small" />
                      <div>20% ~ 30%</div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-start gap-4 text-sm">
                    <div className="h-10 w-0.5 bg-white" />

                    <div className="flex flex-col gap-2">
                      <div className="text-2xs">200/1,000 tokens given out</div>
                      <Line
                        percent={20}
                        strokeColor="#EBEBEB"
                        strokeWidth={4}
                        className="rounded-full border border-white"
                        trailWidth={0}
                        trailColor="#1E1E1E"
                      />
                    </div>

                    <div className="flex flex-1" />

                    <div>
                      <Button
                        variant="secondary"
                        className="iridescent h-8 px-4 py-0.5 text-xs md:px-8 md:text-base"
                        size="sm"
                      >
                        <div className="">Boost Incentives</div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
