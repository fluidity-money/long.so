"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { SwapPro } from "@/components/SwapPro";
import { useHotkeys } from "react-hotkeys-hook";
import Token from "@/assets/icons/token.svg";
import Ethereum from "@/assets/icons/ethereum.svg";
import { Badge } from "@/components/ui/badge";
import { Line } from "rc-progress";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import ReactECharts from "echarts-for-react";
import Link from "next/link";

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

export default function PoolPage() {
  const router = useRouter();

  useHotkeys("esc", () => router.back());

  const params = useParams();

  return (
    <div className="flex w-full flex-col">
      <div className="flex max-w-full flex-col-reverse justify-center gap-8 lg:flex-row">
        <div className="flex flex-col items-center">
          <SwapPro override badgeTitle />
        </div>

        <div className="flex flex-col items-center">
          <div className="z-10 flex w-full flex-col items-center px-4">
            <motion.div
              layoutId="modal"
              className="flex w-[19.8125rem] flex-col rounded-lg bg-black p-2 pt-0 text-white md:h-[502px] md:w-[393px]"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="p-4 text-2xs">Manage Pool</div>
                <Button
                  variant="secondary"
                  className="h-[26px] w-12 px-[9px] py-[7px] text-2xs"
                  onClick={() => {
                    router.back();
                  }}
                >
                  {"<-"} Esc
                </Button>
              </div>

              <div className="mt-px flex flex-row items-center justify-between px-4">
                <div className="flex flex-row items-center">
                  <Ethereum className={"size-[24px] invert"} />
                  <Badge className="iridescent z-20 -ml-1 flex flex-row gap-2 border-4 border-black pl-1 text-black">
                    <Token className={"size-[24px]"} />
                    <div className="text-nowrap text-sm">fUSDC-ETH</div>
                  </Badge>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Badge className="iridescent flex h-4 w-[93px] flex-row pl-0.5 text-black md:w-[132px]">
                    <div className="flex flex-row">
                      <Token className={"size-[14px]"} />
                      <Token className={"-ml-[5px] size-[14px]"} />
                      <Token className={"-ml-[5px] size-[14px]"} />
                    </div>
                    <div className="text-nowrap text-4xs font-medium md:text-2xs">
                      Live Utility Rewards
                    </div>
                  </Badge>

                  <p className="text-3xs">5days | 24hrs | 30min</p>
                </div>
              </div>

              <div className="flex flex-col gap-8 p-4">
                <div className="flex flex-row gap-2">
                  <Link
                    href={`/stake/pool/${params.id}/add-liquidity`}
                    legacyBehavior
                  >
                    <Button
                      variant="secondary"
                      className="flex-1 text-3xs md:text-2xs"
                      size="sm"
                    >
                      + Add Liquidity
                    </Button>
                  </Link>
                  <Link
                    href={`/stake/pool/${params.id}/withdraw-liquidity`}
                    legacyBehavior
                  >
                    <Button
                      variant="secondary"
                      className="flex-1 text-3xs md:text-2xs"
                      size="sm"
                    >
                      - Withdraw Liquidity
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <div className="text-3xs md:text-2xs">My Pool Balance</div>
                    <div className="text-xl md:text-2xl">$190,301</div>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="text-nowrap text-3xs md:text-2xs">
                      Unclaimed Rewards
                    </div>
                    <div className="text-xl md:text-2xl">$52,420</div>
                  </div>

                  <div>
                    <Button
                      variant="secondary"
                      className="h-[19px] w-[75px] px-[27px] py-[5px] md:h-[22px] md:w-[92px]"
                      size="sm"
                    >
                      <div className="text-3xs">Claim Yield</div>
                    </Button>
                  </div>
                </div>

                <ReactECharts
                  opts={{
                    height: 52,
                  }}
                  style={{
                    height: 52,
                  }}
                  option={{
                    grid: {
                      left: "0", // or a small value like '10px'
                      right: "0", // or a small value
                      top: "0", // or a small value
                      bottom: "0", // or a small value
                    },
                    tooltip: {
                      trigger: "axis", // Trigger tooltip on axis movement
                      axisPointer: {
                        type: "cross", // Display crosshair style pointers
                      },
                      borderWidth: 0,
                      backgroundColor: "#EBEBEB",
                      textStyle: {
                        color: "#1E1E1E",
                      },
                      formatter:
                        "<div class='flex flex-col items-center'>${c} <div class='text-gray-2 text-center w-full'>{b}</div></div>",
                    },
                    xAxis: {
                      type: "category",
                      data: data.map((d) => format(d.date, "P")),
                      show: false,
                      axisPointer: {
                        label: {
                          show: false,
                        },
                      },
                    },
                    yAxis: {
                      type: "value",
                      show: false,
                      axisPointer: {
                        label: {
                          show: false,
                        },
                      },
                    },
                    series: [
                      {
                        type: "bar",
                        data: data.map((d) => d.uv),
                        itemStyle: {
                          color: "#EBEBEB",
                        },
                        barWidth: "60%", // Adjust bar width (can be in pixels e.g., '20px')
                        barGap: "5%", // Adjust the gap between bars in different series
                      },
                    ],
                  }}
                />

                <div className="flex flex-col gap-[7px]">
                  <div className="flex flex-row justify-between">
                    <div className="text-xs">Pool Reward Range</div>

                    <div className="text-xs">
                      40% ~ <span className="font-bold">100%</span>
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="flex flex-row justify-between text-2xs">
                      <div>Earned Fees APR</div>

                      <div className="flex flex-row items-center gap-2">
                        <Token size="small" />
                        <div>1% ~ 5%</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between text-2xs">
                      <div>Liquidity Incentives</div>

                      <div className="flex flex-row items-center gap-2">
                        <Token size="small" />
                        <div className="z-20 -ml-3">
                          <Token size="small" />
                        </div>
                        <div>15% ~ 25%</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between text-2xs">
                      <div>Super Incentives</div>

                      <div className="flex flex-row items-center gap-2">
                        <Token size="small" />
                        <div>20% ~ 30%</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between text-2xs">
                    <div>Utility Incentives</div>

                    <div className="flex flex-row items-center gap-2">
                      <Token size="small" />
                      <div>20% ~ 30%</div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-start gap-[10px] text-sm">
                    <div className="mt-[6px] h-[25px] w-0.5 bg-white" />

                    <div className="flex flex-col gap-1">
                      <div className="text-3xs">200/1,000 tokens given out</div>
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
                        className="iridescent h-[19.24px] w-[102.15px] px-4 py-0.5 md:px-8 md:text-base"
                        size="sm"
                      >
                        <div className="text-2xs ">Boost Incentives</div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
