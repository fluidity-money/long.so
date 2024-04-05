"use client";

import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";
import { Check } from "lucide-react";
import Cog from "@/assets/icons/cog.svg";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Disconnect from "@/assets/icons/disconnect.svg";
import ReactECharts from "echarts-for-react";
import { format, subDays, subHours, subMinutes, subWeeks } from "date-fns";
import { TransactionHistoryTable } from "@/app/_TransactionHistoryTable/TransactionHistoryTable";
import {
  columns,
  TransactionHistory,
} from "@/app/_TransactionHistoryTable/columns";
import { useEffect, useRef, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { nanoid } from "nanoid";
import Token from "@/assets/icons/token.svg";
import Ethereum from "@/assets/icons/ethereum.svg";
import SegmentedControl from "@/components/ui/segmented-control";
import { DurationSegmentedControl } from "@/components/DurationSegmentedControl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { useStakeWelcomeBackStore } from "@/stores/useStakeWelcomeBackStore";
import { useRouter } from "next/navigation";
import { useInventorySheet } from "@/stores/useInventorySheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/InventoryContent/DataTable";
import {
  columns as yieldColumns,
  Yield,
} from "@/components/InventoryContent/columns";
import { usdFormat } from "@/lib/usdFormat";
import Position from "@/assets/icons/position.svg";
import ArrowUpRight from "@/assets/icons/arrow-up-right.svg";
import { useAccount, useDisconnect, useEnsName } from "wagmi";

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

const transactionHistory: TransactionHistory[] = [
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subMinutes(new Date(), 1),
    rewards: 2.01,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
      {
        name: "fUSDC",
        icon: <Token />,
      },
    ],
    date: subHours(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subDays(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
      {
        name: "fUSDC",
        icon: <Token />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
  {
    id: nanoid(),
    tokens: [
      {
        name: "fUSDC",
        icon: <Token />,
      },
      {
        name: "ETH",
        icon: <Ethereum className={"invert"} />,
      },
    ],
    date: subWeeks(new Date(), 1),
    rewards: 12.33,
  },
];

const yieldData: Yield[] = [
  {
    id: nanoid(),
    yield: 12.33,
    status: "claimable",
    pool: "ETH-fUSDC",
  },
  {
    id: nanoid(),
    yield: 12.33,
    status: "claimable",
    pool: "ETH x fUSDC",
  },
  {
    id: nanoid(),
    yield: 12.33,
    status: "claimed",
    pool: "ETH x fUSDC",
  },
  {
    id: nanoid(),
    yield: 12.33,
    status: "claimed",
    pool: "ETH x fUSDC",
  },
];

const myPositionsData = [
  {
    id: nanoid(),
    pool: "USDC x fUSDC",
    yield: 183.01,
    position: "$10.1k",
  },
  {
    id: nanoid(),
    pool: "USDC x fUSDC",
    yield: 183.01,
    position: "$10.1k",
  },
  {
    id: nanoid(),
    pool: "USDC x fUSDC",
    yield: 0,
    position: "$20",
  },
  {
    id: nanoid(),
    pool: "USDC x fUSDC",
    yield: 183.01,
    position: "$10.1k",
  },
  {
    id: nanoid(),
    pool: "USDC x fUSDC",
    yield: 183.01,
    position: "$10.1k",
  },
  {
    id: nanoid(),
    pool: "USDC x fUSDC",
    yield: 0,
    position: "$20",
  },
];

export const InventoryContent = () => {
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const ref = useDetectClickOutside({
    onTriggered: () => setConfirmDisconnect(false),
  });

  const [copied, setCopied] = useState(false);

  const [content, setContent] = useState<"pools" | "trade">("trade");

  const { disconnect } = useDisconnect();

  /**
   * When copied is set to true this will reset
   * the state after 2 seconds
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  const [activeGraphDuration, setActiveGraphDuration] = useState<
    "7D" | "1M" | "6M" | "1Y" | "ALL"
  >("7D");

  // refs for segmented control
  const unclaimedRef = useRef();
  const allRef = useRef();
  const historicalRef = useRef();

  const [yieldType, setYieldType] = useState<
    "unclaimed" | "all" | "historical"
  >("unclaimed");

  const { setYieldBreakdown } = useStakeWelcomeBackStore();

  const router = useRouter();

  const { setIsOpen } = useInventorySheet();

  const { address } = useAccount();
  const { data: ensName } = useEnsName({
    address,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <Image
            src={require("@/assets/profile-picture.png")}
            alt={"profile picture"}
            className={"size-[18px] rounded border border-gray-200"}
          />

          <div className="inline-flex h-4 items-center justify-start gap-2.5 rounded-[3px] bg-gray-200 px-1 py-0.5">
            <div className="flex items-center justify-end gap-1">
              <CopyToClipboard
                text={ensName ?? address ?? ""}
                onCopy={() => setCopied(true)}
              >
                {copied ? (
                  <Check className="h-[8.54px] w-2 text-black" />
                ) : (
                  <div className="relative h-[8.54px] w-2">
                    <div className="absolute left-0 top-0 h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900" />
                    <div className="absolute left-[2.10px] top-[2px] h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900 bg-gray-200" />
                  </div>
                )}
              </CopyToClipboard>

              <div className="text-[10px] font-medium text-stone-900">
                {ensName ? (
                  ensName
                ) : (
                  <>
                    {address?.slice(0, 5)} ... {address?.slice(-3)}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-[20px]">
          <Cog />
          <Badge
            ref={ref}
            variant="secondary"
            className={cn(
              "h-[18px] w-[20px] cursor-pointer items-center gap-1 px-0.5 transition-all",
              {
                "bg-transparent": !confirmDisconnect,
                "w-[95px] ": confirmDisconnect,
              },
            )}
            onClick={() => {
              if (confirmDisconnect) {
                disconnect();
              } else {
                setConfirmDisconnect(true);
              }
            }}
          >
            <Disconnect
              className={cn("size-[15px]", {
                invert: confirmDisconnect,
              })}
            />
            {confirmDisconnect && "Disconnect"}
          </Badge>
        </div>
      </div>

      <div className="mt-[29px] flex flex-col items-center md:mt-[34px]">
        <SegmentedControl
          name={"inventory-content"}
          variant={"secondary"}
          callback={(val) => setContent(val)}
          segments={[
            {
              label: "Trades",
              value: "trade" as const,
              ref: useRef(),
            },
            {
              label: "Pools",
              value: "pools" as const,
              ref: useRef(),
            },
          ]}
        />
      </div>

      <Tabs defaultValue="trade" value={content}>
        <TabsContent value="trade">
          <div className="mt-[34px] flex flex-col items-center ">
            <div className={"text-[14px] font-medium "}>
              My Total Trade Rewards
            </div>

            <Badge
              variant={"iridescent"}
              className={"mt-[12px] text-[30px] font-medium"}
            >
              $1,337
            </Badge>

            <div className="mt-[19px] w-[223px] text-center text-[10px] font-normal text-neutral-400 md:mt-[28px]">
              Earn more by making more transactions!
            </div>

            <div className="mt-[42px] flex w-full flex-row items-center justify-between">
              <div className="text-[10px] font-medium">
                Trader Rewards Over Time
              </div>
              <DurationSegmentedControl
                variant={"secondary"}
                className={"hidden text-[10px] md:flex"}
              />
              <Select>
                <SelectTrigger className="w-[90px] border-0 bg-transparent text-right text-[10px] md:hidden">
                  <SelectValue defaultValue={"7D"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7D">7 Days</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="ALL">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ReactECharts
              className="mt-[10px] h-[70px] w-full  md:mt-[20px]"
              opts={{
                height: 70,
              }}
              style={{
                height: 70,
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
                    barWidth: "70%", // Adjust bar width (can be in pixels e.g., '20px')
                    barGap: "30%", // Adjust the gap between bars in different series
                  },
                ],
              }}
            />

            <div className={"mt-[13px] w-full text-left text-[10px]"}>
              22nd February 2024
            </div>

            <div className="mt-[30px] w-full text-left text-[10px]">
              My Transaction History
            </div>

            <TransactionHistoryTable
              columns={columns}
              data={transactionHistory}
            />
          </div>
        </TabsContent>
        <TabsContent value="pools">
          <div className={"flex flex-col items-center"}>
            <div
              className={cn(
                "mt-[22px] flex h-[266px] w-[284px] flex-col items-center overflow-y-scroll rounded p-[10px] transition-colors md:w-[300px]",
                {
                  "iridescent text-black": yieldType === "unclaimed",
                  "border border-white text-white": yieldType !== "unclaimed",
                },
              )}
            >
              <div
                className={"flex w-full flex-row items-center justify-between"}
              >
                <div className={"text-[10px]"}>My Yield</div>

                <SegmentedControl
                  name={"yield-type"}
                  className={"text-[10px]"}
                  variant={yieldType === "unclaimed" ? undefined : "secondary"}
                  callback={(val) => setYieldType(val)}
                  segments={[
                    {
                      label: "Unclaimed",
                      value: "unclaimed" as const,
                      ref: unclaimedRef,
                    },
                    {
                      label: "All",
                      value: "all" as const,
                      ref: allRef,
                    },
                    {
                      label: "Historical",
                      value: "historical" as const,
                      ref: historicalRef,
                    },
                  ]}
                />
              </div>

              {yieldType === "unclaimed" && (
                <div className="flex flex-col items-center">
                  <div className={"mt-[14px] text-[30px]"}>$41.12</div>

                  <div>
                    <Badge className={"h-[14px] px-0.5 text-[8px]"}>
                      <Token />
                      <Token className={"-ml-1"} />
                      <Token className={"-ml-1"} />
                      <Token className={"-ml-1 mr-1"} />
                      Unclaimed Rewards
                    </Badge>
                  </div>

                  <div
                    className={
                      "mt-[18px] flex h-[64px] w-[240px] flex-col justify-between"
                    }
                  >
                    <div
                      className={
                        "flex w-full flex-row justify-between text-[10px]"
                      }
                    >
                      <div>Pool Fees</div>
                      <div className="flex flex-row items-center gap-1">
                        <Token /> $21.72
                      </div>
                    </div>

                    <div
                      className={
                        "flex w-full flex-row justify-between text-[10px]"
                      }
                    >
                      <div>Liquidity Boosts</div>
                      <div className="flex flex-row items-center gap-1">
                        <Token /> $13.06
                      </div>
                    </div>

                    <div
                      className={
                        "flex w-full flex-row justify-between text-[10px]"
                      }
                    >
                      <div>Super Boosts</div>
                      <div className="flex flex-row items-center gap-1">
                        <Token /> $8.34
                      </div>
                    </div>

                    <div
                      className={
                        "flex w-full flex-row justify-between text-[10px]"
                      }
                    >
                      <div>Utility Boosts</div>
                      <div className="flex flex-row items-center gap-1">
                        <Token /> $2.99
                      </div>
                    </div>
                  </div>

                  <Button
                    className={"mt-[17px] w-full"}
                    onClick={() => {
                      setYieldBreakdown(true);
                      setIsOpen(false);
                      router.push("/stake");
                    }}
                  >
                    <div className={"iridescent-text text-[10px]"}>
                      Claim All Yield
                    </div>
                  </Button>

                  <Badge
                    className={
                      "-mt-1.5 h-[12px] gap-1 border border-black px-1 text-[7px]"
                    }
                    variant={"iridescent"}
                  >
                    <Token className={"size-[10px]"} />
                    <div>$41.12</div>
                  </Badge>
                </div>
              )}

              {yieldType === "all" && (
                <div className={"mt-[15px] flex w-full flex-col items-center"}>
                  <DataTable columns={yieldColumns} data={yieldData} />
                </div>
              )}

              {yieldType === "historical" && (
                <div className={"mt-[15px] flex w-full flex-col items-center"}>
                  <DataTable
                    columns={yieldColumns}
                    data={yieldData.filter((v) => v.status === "claimed")}
                  />
                </div>
              )}
            </div>

            <div className={"w-full"}>
              <div className={"mt-[32px] flex flex-row justify-between"}>
                <div className={"text-[10px]"}>My Positions</div>
                <div className={"text-[10px]"}>
                  <div>Sort By Yield</div>
                </div>
              </div>

              <div
                className={
                  "mt-[21px] flex h-[155px] flex-row flex-wrap justify-center gap-[10px] overflow-y-scroll md:h-full"
                }
              >
                {myPositionsData.map((position) => (
                  <div key={position.id}>
                    {/* only on mobile */}
                    <div className="relative h-[83px] w-[77px] md:hidden">
                      <div className="absolute left-0 top-0 inline-flex items-start justify-start gap-2.5 rounded-[7px] border border-gray-200 bg-stone-900 px-[5px] pb-[5px] pt-2.5">
                        <div className="relative h-[68px] w-[67px]">
                          <div className="absolute left-[14px] top-0 flex h-[22.57px] w-[39.63px] flex-row">
                            <Token className={"size-[25px] "} />
                            <Token className={"-ml-3 size-[25px]"} />
                          </div>

                          <div className="absolute left-[17.40px] top-[18.37px] inline-flex h-[7px] w-[33px] items-center justify-center gap-[3px] rounded-[25px] border border-white bg-black px-0.5 py-px">
                            <div className="iridescent-text text-nowrap text-[4px]">
                              {position.pool}
                            </div>
                          </div>

                          <div className="absolute top-[30px] w-full text-center text-xs text-gray-200">
                            {usdFormat(position.yield)}
                          </div>

                          <div
                            className={cn(
                              "absolute left-[19.40px] top-[45px] text-center text-[4px]",
                              {
                                "iridescent-text": position.yield > 0,
                                "text-neutral-400": position.yield === 0,
                              },
                            )}
                          >
                            {position.yield > 0
                              ? "Available Yield"
                              : "No Yield Yet"}
                          </div>

                          <div className="absolute left-0 top-[55px] inline-flex h-[13px] w-[67px] flex-col items-center justify-center gap-2.5 rounded-[100px] bg-gray-200 px-[5px] py-0.5">
                            <div className="inline-flex items-center justify-start">
                              <div className="flex h-1.5 items-end justify-center">
                                <Position className={"h-1.5"} />
                              </div>
                              <div className="text-nowrap text-[6px] text-black">
                                {position.position} Position
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute left-[6px] top-[6px] size-1 rounded-full bg-green-200" />
                    </div>

                    {/* only on desktop */}
                    <div className="relative hidden h-[159px] w-[145px] md:inline-flex">
                      <div className="absolute left-0 top-0 h-[159px] w-[145px] rounded-[5px] border border-gray-200 bg-stone-900" />
                      <div className="absolute left-[19px] top-[103px] inline-flex w-[107px] items-center justify-between">
                        <div className="relative h-[18px] w-[33.50px]">
                          <div className="absolute left-[0.50px] top-[8px] inline-flex h-2.5 w-[33px] items-center justify-start">
                            <div className="flex h-1.5 items-end justify-center">
                              <Position className={"-ml-1 h-1.5 invert"} />
                            </div>
                            <div className=" text-[8px] font-medium text-gray-200">
                              {position.position}
                            </div>
                          </div>
                          <div className="absolute left-0 top-0 text-[6px] font-medium text-neutral-400">
                            Amount
                          </div>
                        </div>

                        <div className="relative h-[18px] w-[50px]">
                          <div className="absolute left-0 top-0  text-[6px] font-medium text-neutral-400">
                            Liq. Range
                          </div>
                          <div className="absolute left-[32px] top-px text-right  text-[5px] font-medium text-green-200">
                            ●
                          </div>
                          <div className="absolute left-0 top-[8px] inline-flex h-2.5 w-[50px] items-center justify-start gap-[3px]">
                            <div className=" text-[8px] font-medium text-gray-200">
                              3.10k
                            </div>
                            <div className=" text-[8px] font-medium text-gray-200">
                              -
                            </div>
                            <div className="text-right  text-[8px] font-medium text-gray-200">
                              3.98k
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute left-[46px] top-[37.82px] text-center text-[6px] font-semibold text-neutral-400">
                        50ETH - 50ƒUSDC
                      </div>
                      <div className="absolute left-[53px] top-[12px] flex h-[20.65px] w-[39.93px] flex-row">
                        <Token className={"size-[25px] "} />
                        <Token className={"-ml-3 size-[25px]"} />
                      </div>
                      <div className="absolute top-[52px] inline-flex w-full items-center justify-center">
                        <div className="text-center text-[19px] text-gray-200">
                          {usdFormat(position.yield)}
                        </div>
                      </div>
                      <div className="absolute top-[82px] inline-flex w-full items-center justify-center">
                        <Badge variant={"iridescent"} size={"sm"}>
                          Available Yield
                        </Badge>
                      </div>
                      <div className="absolute left-[7px] top-[128px] flex h-[23px] w-[132px] gap-[4px]">
                        <Button
                          variant={"secondary"}
                          size={"sm"}
                          className={"h-[23px] flex-1 gap-[3px] text-[9px]"}
                        >
                          View Pool <ArrowUpRight className={"size-[5px]"} />
                        </Button>

                        <Button
                          variant={"secondary"}
                          size={"sm"}
                          className={"h-[23px]"}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
