"use client";

import { useSwapPro } from "@/stores/useSwapPro";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import { useRef, useState } from "react";
import { startCase } from "lodash";
import { DataTable } from "@/app/_DataTable/DataTable";
import { columns, Transaction } from "@/app/_DataTable/columns";
import { format, startOfDay, subDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Token from "@/assets/icons/token.svg";
import Ethereum from "@/assets/icons/ethereum.svg";
import { DurationSegmentedControl } from "@/components/DurationSegmentedControl";
import SegmentedControl from "@/components/ui/segmented-control";

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

const Graph = () => {
  const [activeGraphType, setActiveGraphType] = useState<
    "price" | "volume" | "liquidity"
  >("volume");

  return (
    <>
      <div className={"flex flex-row justify-start"}>
        <SegmentedControl
          segments={[
            {
              label: "Price",
              value: "price",
              ref: useRef(),
            },
            {
              label: "Volume",
              value: "volume",
              ref: useRef(),
            },
            {
              label: "Liquidity",
              value: "liquidity",
              ref: useRef(),
            },
          ]}
        />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between">
          <div>
            <div className="text-sm md:hidden">
              {/* this text is only shown on mobile */}
              fUSDC/ETH {startCase(activeGraphType)}
            </div>
          </div>

          <DurationSegmentedControl />
        </div>
        <TypographyH2 className="border-b-0">$12.05</TypographyH2>

        <div className="flex flex-col gap-2">
          <ReactECharts
            opts={{
              height: 150,
            }}
            style={{
              height: 150,
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
                backgroundColor: "#1E1E1E",
                textStyle: {
                  color: "#EBEBEB",
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
                    color: "#1E1E1E",
                  },
                  barWidth: "60%", // Adjust bar width (can be in pixels e.g., '20px')
                  barGap: "5%", // Adjust the gap between bars in different series
                },
              ],
            }}
          />

          <div className="text-2xs">5th October 2023</div>
        </div>
      </div>
    </>
  );
};

const variants = {
  hidden: { opacity: 0, width: 0 },
  visible: { opacity: 1, width: "auto" },
};

export const SwapPro = ({
  override,
  badgeTitle,
}: {
  override?: boolean;
  badgeTitle?: boolean;
}) => {
  const { swapPro, setSwapPro } = useSwapPro();

  const { isLtSm } = useMediaQuery();

  return (
    <motion.div
      initial={"hidden"}
      variants={variants}
      animate={swapPro || override || isLtSm ? "visible" : "hidden"}
      className="z-10 flex flex-col items-center justify-center"
      transition={{
        type: "spring",
        stiffness: 150,
        duration: 0.2,
        opacity: { ease: "linear", duration: 0.2 },
      }}
    >
      <div
        className={
          "flex w-full flex-col gap-4 overflow-x-clip p-4 pl-8 sm:w-[500px] md:mr-10 md:w-[500px] lg:w-[500px] xl:w-[600px]"
        }
      >
        {badgeTitle ? (
          <div className="flex flex-row items-center">
            <Ethereum className={"size-[30px]"} />
            <Badge className="z-50 -ml-2 pl-1">
              <div className="flex flex-row items-center gap-1">
                <Token className={"size-[28px] invert"} />
                <div className="text-xl">fUSDC - ETH</div>
              </div>
            </Badge>
          </div>
        ) : (
          <TypographyH3 className="hidden font-normal md:inline-flex">
            fUSDC/ETH
          </TypographyH3>
        )}

        <Graph />

        <div className="hidden w-full flex-row flex-wrap items-center justify-between gap-2 md:flex">
          <div>
            <p className="text-2xs">Liquidity</p>
            <p className="text-xl">$1.01M</p>
          </div>

          <div>
            <p className="text-2xs">Volume 24H</p>
            <p className="text-xl">$115.21K</p>
          </div>

          <div>
            <p className="text-2xs">Stake APY</p>
            <p className="text-xl">1.62%</p>
          </div>

          <div>
            <p className="text-2xs">24H Trade Rewards</p>
            <p className="text-xl">$300.56</p>
          </div>
        </div>

        <div className="mt-[35px]">
          <div className="flex w-full flex-row items-center justify-between">
            <h3 className="text-sm">Transaction History</h3>
            <div>
              <span className="cursor-pointer text-sm underline">
                My Transactions
              </span>{" "}
              {"->"}
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
    </motion.div>
  );
};
