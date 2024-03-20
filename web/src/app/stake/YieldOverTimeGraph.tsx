"use client";

import { Menu } from "@/components";
import { useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import { format, subDays } from "date-fns";

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

const colorGradient = new echarts.graphic.LinearGradient(
  0,
  0,
  0,
  1, // Gradient direction from top(0,0) to bottom(0,1)
  [
    { offset: 0, color: "rgba(243, 184, 216, 0.4)" },
    { offset: 0.25, color: "rgba(183, 147, 233, 0.4)" },
    { offset: 0.5, color: "rgba(159, 212, 243, 0.4)" },
    { offset: 0.75, color: "rgba(255, 210, 196, 0.4)" },
    { offset: 1, color: "rgba(251, 243, 243, 0.4)" },
  ],
);

export const YieldOverTimeGraph = () => {
  const [activeGraphDuration, setActiveGraphDuration] = useState<
    "7D" | "1M" | "6M" | "1Y" | "ALL"
  >("7D");

  return (
    <>
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

      <div className="mt-8 flex flex-col gap-2">
        <ReactECharts
          className="h-[200px]"
          opts={{
            height: 200,
          }}
          style={{
            height: 200,
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
                name: "Series 2",
                type: "bar",
                stack: "total", // Same 'stack' value as Series 1 to stack them together
                data: data.map((d) => d.uv),
                itemStyle: {
                  color: "#1E1E1E",
                  borderRadius: [0, 0, 5, 5],
                },
                barWidth: "90%", // Adjust bar width (can be in pixels e.g., '20px')
                barGap: "5%", // Adjust the gap between bars in different series
              },
              {
                name: "series 1",
                stack: "total",
                data: data.map((d) => d.pv),
                type: "bar",

                itemStyle: {
                  color: colorGradient,
                  borderRadius: [5, 5, 0, 0], // Specify radius for all corners
                  // Border configuration
                  borderColor: "#1E1E1E", // Border color
                  borderWidth: 2, // Border width
                  borderType: "solid", // Border type
                },
              },
            ],
          }}
        />

        <div className="text-xs text-gray-2">Showing October 2023</div>
      </div>
    </>
  );
};
