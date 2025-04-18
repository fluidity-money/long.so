"use client";
import React, { useEffect, useRef } from "react";
import { CandlestickSeries, ColorType, createChart } from "lightweight-charts";
import { useGetBars } from "@/hooks/useGraphql";

const LightChart = ({
  pairAddress,
  networkId,
  quoteToken,
}: {
  networkId: number;
  pairAddress: string;
  quoteToken: "0" | "1";
}) => {
  const chartContainerRef = useRef(null);
  const { data: bars } = useGetBars({ pairAddress, networkId, quoteToken });
  useEffect(() => {
    if (bars && chartContainerRef.current) {
      const chartOptions = {
        width: 1200,
        height: 350,
        layout: {
          textColor: "black",
          background: { type: ColorType.Solid, color: "black" },
        },
      };
      const chart = createChart(chartContainerRef.current, chartOptions);
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
      // const histogramSeries = chart.addSeries(HistogramSeries, { color: '#26a69a' });
      // const baselineSeries = chart.addSeries(BaselineSeries, {  });
      // histogramSeries.setData(bars.histogram)
      candlestickSeries.setData(bars.candlestick);
    }
  }, [bars]);
  return (
    <div
      ref={chartContainerRef}
      className="relative"
      style={{ width: 1200, height: 350 }}
    ></div>
  );
};

export default LightChart;
