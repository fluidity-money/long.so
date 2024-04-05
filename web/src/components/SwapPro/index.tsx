"use client";

import { useSwapPro } from "@/stores/useSwapPro";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import { useMemo, useRef, useState } from "react";
import { startCase } from "lodash";
import { DataTable } from "@/app/_DataTable/DataTable";
import { columns, Transaction } from "@/app/_DataTable/columns";
import { format, startOfDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Token from "@/assets/icons/token.svg";
import Ethereum from "@/assets/icons/ethereum.svg";
import { DurationSegmentedControl } from "@/components/DurationSegmentedControl";
import SegmentedControl from "@/components/ui/segmented-control";
import { useWelcomeStore } from "@/stores/useWelcomeStore";
import { cn } from "@/lib/utils";
import { getSwapProGraphData } from "@/components/SwapPro/SwapProGraphData";

const durationToDays = {
  "7D": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
  ALL: 365,
};

const Graph = () => {
  const [activeGraphType, setActiveGraphType] = useState<
    "price" | "volume" | "liquidity"
  >("volume");

  const [duration, setDuration] = useState<"7D" | "1M" | "6M" | "1Y" | "ALL">(
    "7D",
  );

  const swapProGraphData = useMemo(
    () => getSwapProGraphData(durationToDays[duration]),
    [duration, activeGraphType],
  );

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

          <DurationSegmentedControl callback={(val) => setDuration(val)} />
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
                data: swapProGraphData.map((d) => format(d.date, "P")),
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
                  data: swapProGraphData.map((d) => d.uv),
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
  const { welcome } = useWelcomeStore();

  const { isLtSm } = useMediaQuery();

  const isOpen = !welcome && (swapPro || override || isLtSm);

  return (
    <motion.div
      initial={"hidden"}
      variants={variants}
      animate={isOpen ? "visible" : "hidden"}
      className={cn("z-10 flex flex-col items-center justify-center", {
        hidden: !isOpen,
      })}
      transition={{
        type: "spring",
        bounce: 0.5,
        duration: 0.5,
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
