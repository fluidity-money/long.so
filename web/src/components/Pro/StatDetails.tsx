"use client";
import { cn } from "@/lib/utils";
import { useGetPairDetails, useGetPairStatDetails } from "@/hooks/useGraphql";
import { requestGetPairDetails, requestGetPairStatDetails } from "@/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useCallback } from "react";

const statModes = [
  "stats_min5",
  "stats_hour1",
  "stats_hour4",
  "stats_hour12",
  "stats_day1",
] as const;
const statModeTitles = ["5m", "1hr", "4hr", "12hr", "24hr"];
const modeChangeMap = {
  [statModes[0]]: "change5m",
  [statModes[1]]: "change1",
  [statModes[2]]: "change4",
  [statModes[3]]: "change12",
  [statModes[4]]: "change24",
} as const;
const StatTitleItem = ({
  title,
  mode,
  change,
}: {
  title: string;
  mode: string;
  change?: null | string;
}) => (
  <TabsTrigger
    className={cn(
      "group flex flex-1 flex-col gap-2 text-gray-200 data-[state=active]:flex-[2]",
    )}
    value={mode}
  >
    <span className="group-data-[state=active]:iridescent z-[2] justify-center rounded-sm border border-black bg-[#000] px-2 py-1 text-xs group-data-[state=active]:border-0 group-data-[state=active]:text-black">
      {title}
    </span>
    <span
      className={cn(
        change && +change > 0 ? "text-green-light" : "text-destructive",
        "block text-center text-[9px] font-semibold",
      )}
    >
      {change ? (+change * 100).toFixed(2) : 0}%
    </span>
  </TabsTrigger>
);
const StatContentItem = ({
  className,
  title,
  value,
}: {
  className?: string;
  title: string;
  value: string | number;
}) => (
  <div className={cn(className, "flex grow flex-col gap-1")}>
    <span className="text-[10px] text-neutral-400">{title}</span>
    <span className="text-sm text-gray-200">{value}</span>
  </div>
);

export default function StatDetails({
  pairAddress,
  quoteToken,
  networkId,
  initialData,
  pairDetails,
  tokenAddress,
}: {
  pairAddress: string;
  quoteToken: "0" | "1";
  networkId: number;
  initialData: Awaited<ReturnType<typeof requestGetPairStatDetails>>;
  pairDetails: Awaited<ReturnType<typeof requestGetPairDetails>>;
  tokenAddress: string;
}) {
  const { data } = useGetPairStatDetails({
    pairAddress,
    quoteToken,
    networkId,
    initialData,
  });
  const { data: changeData } = useGetPairDetails({
    tokenAddress,
    initialData: pairDetails,
  });
  const contentHeader = useCallback(
    (mode: (typeof statModes)[number]) => [
      {
        title: "Txns",
        value: data?.[mode].transactions.currentValue,
      },
      {
        title: "Volume",
        value: data?.[mode].volume.currentValue,
      },
      {
        title: "Traders",
        value: data?.[mode].traders.currentValue,
      },
    ],
    [data],
  );
  const contentBody = useCallback(
    (mode: (typeof statModes)[number]) => [
      [
        {
          title: "Buys",
          value: data![mode].buys.currentValue,
        },
        {
          title: "Sells",
          value: data![mode].sells.currentValue,
        },
      ],
      [
        {
          title: "Buy Vol",
          value: +data![mode].buyVolume.currentValue,
        },
        {
          title: "Sell Vol",
          value: +data![mode].sellVolume.currentValue,
        },
      ],
      [
        {
          title: "Buyers",
          value: data![mode].buyers.currentValue,
        },
        {
          title: "Sellers",
          value: data![mode].sellers.currentValue,
        },
      ],
    ],
    [data],
  );
  return (
    <Tabs defaultValue={statModes[0]}>
      <TabsList className="relative mb-2 flex gap-1">
        {statModes.map((mode, idx) => (
          <StatTitleItem
            title={statModeTitles[idx]}
            key={mode}
            mode={mode}
            change={changeData![modeChangeMap[mode]]}
          />
        ))}
        <div className="absolute inset-x-0 top-[10px] z-0 h-1 bg-black" />
      </TabsList>
      {statModes.map((mode) => (
        <TabsContent value={mode} key={mode}>
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-1 items-center gap-0.5">
              {contentHeader(mode).map((i) => (
                <div className="flex-1 bg-black px-3 py-1" key={i.title}>
                  <StatContentItem
                    className="flex-1"
                    title={i.title}
                    value={i.value}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-[2] flex-col gap-1 rounded-sm bg-black px-3 py-2">
              {contentBody(mode).map((item) => (
                <div className="flex flex-1 flex-col gap-1" key={item[0].title}>
                  <div className="flex flex-1">
                    {item.map((i, idx) => (
                      <StatContentItem
                        key={i.title}
                        title={i.title}
                        value={i.value}
                        className={cn(idx === 1 && "text-end")}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div
                      style={{
                        flex: isNaN(
                          item[0].value /
                            item.reduce((acc, v) => acc + v.value, 0),
                        )
                          ? 0
                          : item[0].value /
                            item.reduce((acc, v) => acc + v.value, 0),
                      }}
                      className={cn("bg-green-light h-1")}
                    />
                    <div
                      style={{
                        flex: isNaN(
                          item[1].value /
                            item.reduce((acc, v) => acc + v.value, 0),
                        )
                          ? 0
                          : item[1].value /
                            item.reduce((acc, v) => acc + v.value, 0),
                      }}
                      className={cn("bg-destructive h-1")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
