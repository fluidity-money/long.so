import { useMemo, useRef, useState } from "react";
import { getSwapProGraphData } from "@/components/SwapPro/SwapProGraphData";
import SegmentedControl from "@/components/ui/segmented-control";
import { startCase } from "lodash";
import { DurationSegmentedControl } from "@/components/DurationSegmentedControl";
import { TypographyH2 } from "@/components/ui/typography";
import ReactECharts from "echarts-for-react";
import { format } from "date-fns";

const durationToDays = {
  "7D": 7,
  "1M": 30,
  "6M": 26,
  "1Y": 52,
  ALL: 52,
};

export const Graph = () => {
  const [activeGraphType] = useState<"price" | "volume" | "liquidity">(
    "volume",
  );

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
