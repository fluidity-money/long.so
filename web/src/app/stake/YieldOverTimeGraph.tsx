"use client";

import { Menu } from "@/components";
import { useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";

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
            xAxis: {
              type: "category",
              data: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ],
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
                data: [
                  120, 132, 101, 134, 90, 120, 132, 101, 134, 90, 120, 132, 101,
                  134, 90, 120, 132, 101, 134, 90, 109,
                ],
                itemStyle: {
                  // Custom styling for Series 2
                  color: "black",
                  barBorderRadius: [0, 0, 5, 5],
                },
                barWidth: "90%", // Adjust bar width (can be in pixels e.g., '20px')
                barGap: "5%", // Adjust the gap between bars in different series
              },
              {
                name: "series 1",
                stack: "total",
                data: [
                  120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110,
                  130, 120, 200, 150, 80, 70, 110, 130,
                ],
                type: "bar",

                itemStyle: {
                  color: colorGradient,

                  barBorderRadius: [5, 5, 0, 0], // Specify radius for all corners
                  // Border configuration
                  borderColor: "#000", // Border color
                  borderWidth: 2, // Border width
                  borderType: "solid", // Border type
                },
              },
            ],
            tooltip: {
              trigger: "axis", // Trigger tooltip on axis movement
              axisPointer: {
                type: "cross", // Display crosshair style pointers
              },
            },
          }}
        />

        <div className="text-xs text-gray-2">Showing October 2023</div>
      </div>
    </>
  );
};
