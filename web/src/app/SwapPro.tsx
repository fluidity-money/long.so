"use client";

import { useSwapPro } from "@/stores/useSwapPro";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyH3 } from "@/components/ui/typography";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

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

export const SwapPro = () => {
  const { swapPro, setSwapPro } = useSwapPro();

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`z-10 flex flex-col gap-4 overflow-x-hidden transition-[width] sm:w-full ${swapPro ? " md:mr-10 md:w-[600px]" : "md:mr-0 md:w-0"}`}
      >
        <p>fUSDC/ETH</p>

        <Tabs defaultValue="volume">
          <TabsList>
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          </TabsList>
          <TabsContent value="price">
            <div className="flex flex-col gap-8">
              <TypographyH3>$12.05</TypographyH3>

              <div className="flex flex-col gap-4">
                <ResponsiveContainer height={150} width="100%">
                  <BarChart data={data}>
                    <Bar dataKey="uv" fill="#1E1E1E" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="text-xs">5th October 2023</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="volume">
            <div className="flex flex-col gap-8">
              <TypographyH3>$12.1M</TypographyH3>

              <div className="flex flex-col gap-4">
                <ResponsiveContainer height={150} width="100%">
                  <BarChart data={data}>
                    <Bar dataKey="uv" fill="#1E1E1E" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="text-xs">5th October 2023</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="liquidity">
            <div className="flex flex-col gap-8">
              <TypographyH3>$150.5K</TypographyH3>

              <div className="flex flex-col gap-4">
                <ResponsiveContainer height={150} width="100%">
                  <BarChart data={data}>
                    <Bar dataKey="uv" fill="#1E1E1E" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="text-xs">5th October 2023</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-xs">Liquidity</p>
            <p>$1.01M</p>
          </div>

          <div>
            <p className="text-xs">Volume 24H</p>
            <p>$115.21K</p>
          </div>

          <div>
            <p className="text-xs">Stake APY</p>
            <p>1.62%</p>
          </div>

          <div>
            <p className="text-xs">24H Trade Rewards</p>
            <p>$300.56</p>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between">
          <h3>Transaction History</h3>
          <div>
            <span className="underline">My Transactions</span> {"->"}
          </div>
        </div>
      </div>
    </div>
  );
};
