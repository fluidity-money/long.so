"use client";

import {CampaignBanner} from "@/components/CampaignBanner";
import {Badge} from "@/components/ui/badge";
import Ethereum from "@/assets/icons/ethereum.svg";
import ArrowDown from "@/assets/icons/arrow-down-white.svg";
import Padlock from "@/assets/icons/padlock.svg";
import Token from "@/assets/icons/token.svg";
import {useEffect, useMemo, useRef, useState} from "react";
import ReactECharts from "echarts-for-react";
import {format, subDays} from "date-fns";
import * as echarts from "echarts/core";
import SelectedRange from "@/assets/icons/legend/selected-range.svg";
import CurrentPrice from "@/assets/icons/legend/current-price.svg";
import LiquidityDistribution from "@/assets/icons/legend/liquidity-distribution.svg";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useHotkeys} from "react-hotkeys-hook";
import {AnimatePresence, motion} from "framer-motion";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {Input} from "@/components/ui/input";
import {useStakeStore} from "@/stores/useStakeStore";
import SegmentedControl from "@/components/ui/segmented-control";
import {useAccount, useBalance, useSimulateContract} from "wagmi";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import Gas from "@/assets/icons/gas.svg";
import Link from "next/link";
import Menu from "@/components/Menu";
import Index from "@/components/Slider";
import {erc20Abi} from "viem";
import {useWeb3Modal} from "@web3modal/wagmi/react";

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
        name: "Page C",
        date: subDays(new Date(), 2),
        uv: 2000,
        pv: 9800,
        amt: 2290,
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
        name: "Page C",
        date: subDays(new Date(), 2),
        uv: 2000,
        pv: 9800,
        amt: 2290,
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
        {offset: 0, color: "rgba(243, 184, 216, 1)"},
        {offset: 0.25, color: "rgba(183, 147, 233,1)"},
        {offset: 0.5, color: "rgba(159, 212, 243, 1)"},
        {offset: 0.75, color: "rgba(255, 210, 196,1)"},
        {offset: 1, color: "rgba(251, 243, 243, 1)"},
    ],
);

interface StakeFormProps {
    mode: "new" | "existing";
    poolId?: string;
}

export const StakeForm = ({mode, poolId}: StakeFormProps) => {
    const [feeTier, setFeeTier] = useState<"auto" | "manual">("auto");

    const [breakdownHidden, setBreakdownHidden] = useState(true);

    const {
        multiSingleToken,
        setMultiSingleToken,
        token0,
        token0Amount,
        setToken0Amount,
    } = useStakeStore();

    const router = useRouter();

    useHotkeys("esc", () => router.back());

    const onSubmit = () => {
        if (mode === "new") {
            router.push("/stake/pool/create/confirm");
        } else {
            router.push(`/stake/pool/${poolId}/confirm-liquidity`);
        }
    };

    const {address} = useAccount();

    const {data: balanceData, isLoading} = useBalance({
        address,
    });

    const chartRef = useRef<ReactECharts>(null);

    const [liquidityRangeType, setLiquidityRangeType] = useState<
        "full-range" | "auto" | "custom"
    >("full-range");

    // token0 hooks
    const {data: token0Deicmals, error} = useSimulateContract({
        address: token0.address,
        abi: erc20Abi,
        // @ts-expect-error
        functionName: "decimals",
    });

    console.log(error);

    const {data: token0Balance} = useSimulateContract({
        address: token0.address,
        abi: erc20Abi,
        // @ts-expect-error I don't know why but this needs to use useSimulateContract instead of useReadContract which breaks all the types
        functionName: "balanceOf",
        // @ts-expect-error
        args: [address as Hash],
    });

    const chartOptions = useMemo(() => {
        return {
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
            toolbox: {
                show: false,
            },
            brush: {
                show: liquidityRangeType === "custom",
                xAxisIndex: "all",
                brushLink: "all",
                outOfBrush: {
                    color: "#1E1E1E",
                },
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
                    data: data.map((d) => d.pv),
                    type: "bar",
                    barWidth: "90%", // Adjust bar width (can be in pixels e.g., '20px')
                    barGap: "5%",
                    itemStyle: {
                        color: colorGradient,
                        borderRadius: [5, 5, 0, 0], // Specify radius for all corners
                        // Border configuration
                        ...(liquidityRangeType === "custom"
                            ? {
                                borderColor: "#EBEBEB", // Border color
                                borderWidth: 1, // Border width
                                borderType: "dashed", // Border type
                            }
                            : {
                                borderColor: "#1E1E1E", // Border color
                                borderWidth: 1, // Border width
                                borderType: "solid", // Border type
                            }),
                    },
                },
            ],
        };
    }, [data, liquidityRangeType]);

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current.getEchartsInstance();
            chart.setOption(chartOptions);

            if (liquidityRangeType === "custom") {
                chart.dispatchAction({
                    type: "brush",
                    areas: [
                        {
                            brushType: "lineX",
                            coordRange: [5, 25],
                            xAxisIndex: 0,
                        },
                    ],
                });
            } else {
                chart.dispatchAction({
                    type: "brush",
                    areas: [],
                });
            }
        }
    }, [chartOptions, liquidityRangeType]);

    const {open} = useWeb3Modal();


    return (
        <div className="z-10 flex flex-col items-center">
            <div className="w-[318px] md:w-[392px]">
                <CampaignBanner/>
            </div>

            <div className="mt-[23px] flex flex-col gap-[5px] md:gap-[7px]">
                <motion.div
                    layoutId="modal"
                    className="relative h-[102px] w-[318px] justify-between rounded-lg bg-black p-[17px] text-white md:h-[150px] md:w-[392px] md:p-[25px]"
                >
                    <motion.div layout className="flex flex-col">
                        <div
                            className={cn("absolute -top-[15px] left-0 hidden md:flex", {
                                flex: mode === "existing",
                            })}
                        >
                            <Ethereum className="size-[30px] rounded-full border-[3px] border-white"/>
                            <Badge
                                variant="outline"
                                className="-ml-2 h-[30px] justify-between border-[3px] bg-black pl-px text-white"
                            >
                                <Token className="size-[25px] invert"/>
                                ƒUSDC - {token0.symbol}
                            </Badge>
                        </div>

                        {mode === "existing" && (
                            <div className="absolute -top-[15px] right-0">
                                <Menu
                                    id={"tokens"}
                                    background="dark"
                                    className={
                                        "flex h-[26px] w-[132px] flex-row items-center justify-center gap-2 rounded-lg bg-black md:h-[28px] md:w-[154px]"
                                    }
                                >
                                    <Menu.Item
                                        className={"h-[18px]"}
                                        selected={multiSingleToken === "multi"}
                                        onClick={() => setMultiSingleToken("multi")}
                                    >
                                        <div className="text-nowrap px-1 text-3xs font-medium md:text-2xs">
                                            Multi-Token
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item
                                        className={"h-[18px]"}
                                        selected={multiSingleToken === "single"}
                                        onClick={() => setMultiSingleToken("single")}
                                        variant={"iridescent"}
                                    >
                                        <div className="text-nowrap px-1 text-3xs font-medium md:text-2xs">
                                            Single-Token
                                        </div>
                                    </Menu.Item>
                                </Menu>
                            </div>
                        )}

                        <div className="absolute -right-16 top-0 hidden md:inline-flex">
                            <Button
                                size={"sm"}
                                className="h-[30px] w-[48px]"
                                onClick={() => router.back()}
                            >
                                {"<-"} Esc
                            </Button>
                        </div>

                        <div className="flex w-full flex-row items-center justify-between md:mt-[10px]">
                            <div className="text-3xs md:text-2xs">Prime Asset</div>

                            <div className="text-3xs md:text-2xs">{token0.name}</div>
                        </div>

                        <div className="mt-[7px] flex w-full flex-row items-center justify-between gap-4">
                            <Input
                                className="-ml-2 border-0 bg-black pl-2 text-2xl"
                                autoFocus
                                variant={"no-ring"}
                                value={token0Amount}
                                onChange={(e) => setToken0Amount(e.target.value)}
                            />

                            <Link
                                href={"/stake/pool/create/select-prime-asset"}
                                legacyBehavior
                            >
                                <Badge
                                    variant="outline"
                                    className="flex h-[26px] cursor-pointer flex-row justify-between gap-1 pl-0.5 pr-1 text-white md:h-[33px] md:pl-[4px] md:text-base"
                                >
                                    <Ethereum className="size-[20px] invert md:size-[25px]"/>
                                    <div>{token0.symbol}</div>
                                    <ArrowDown className="h-[5.22px] w-[9.19px] md:h-[6.46px] md:w-[11.38px]"/>
                                </Badge>
                            </Link>
                        </div>

                        <div className="mt-[5px] flex w-full flex-row items-center justify-between">
                            <div className="text-2xs md:text-gray-1">$1,025.23</div>

                            <div className="flex flex-row gap-[8px] text-3xs md:text-2xs">
                                {token0Balance && token0Deicmals && (
                                    <>
                                        <div>
                                            Balance:{" "}
                                            {(
                                                (token0Balance.result as unknown as bigint) /
                                                BigInt(10 ** token0Deicmals.result)
                                            ).toString()}
                                        </div>
                                        <div
                                            className="cursor-pointer underline"
                                            onClick={() =>
                                                setToken0Amount(
                                                    (
                                                        (token0Balance.result as unknown as bigint) /
                                                        BigInt(10 ** token0Deicmals.result)
                                                    ).toString(),
                                                )
                                            }
                                        >
                                            Max
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <AnimatePresence mode={"popLayout"} initial={true}>
                    {(mode === "new" || multiSingleToken === "multi") && (
                        <motion.div
                            initial={{y: -102, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: -102, opacity: 0}}
                            className="flex h-[102px] w-[318px] flex-col justify-between rounded-lg bg-black p-[17px] text-white md:h-[126px] md:w-[392px] md:p-[25px]"
                        >
                            <div className="flex w-full flex-row items-center justify-between">
                                <div className="text-3xs md:text-2xs">Super Asset</div>

                                <div className="text-3xs md:text-2xs">Fluid USDC</div>
                            </div>

                            <div className="mt-[7px] flex w-full flex-row items-center justify-between">
                                <div className="text-2xl">0.87</div>

                                <Badge
                                    variant="outline"
                                    className="flex h-[26px] w-[82px] flex-row justify-between pl-0.5 pr-1 text-white md:h-[33px] md:w-[107px] md:pl-[4px] md:text-base"
                                >
                                    <Ethereum className="size-[20px] invert md:size-[25px]"/>
                                    <div className="iridescent-text">ƒUSDC</div>
                                    <Padlock className="ml-[2px] h-[7.53px] w-[6.45px] md:h-[10.3px] md:w-[8.82px]"/>
                                </Badge>
                            </div>

                            <div className="mt-[5px] flex w-full flex-row items-center justify-between">
                                <div className="text-2xs md:text-gray-1">$1,024.82</div>

                                <div className="text-3xs md:text-2xs">Balance: 0.5</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <motion.div
                className={"flex flex-col items-center"}
                initial={{
                    opacity: 0,
                    y: 100,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: 100,
                }}
            >
                <div className="mt-[12px] flex w-[318px] flex-row items-center justify-between md:w-[392px]">
                    <div className="text-3xs md:text-2xs">Fee Tier</div>

                    <SegmentedControl
                        variant={"secondary"}
                        className={"h-[26px] rounded-lg bg-black text-3xs md:text-2xs"}
                        callback={(val) => setFeeTier(val)}
                        segments={[
                            {
                                label: "Auto",
                                value: "auto" as const,
                                ref: useRef(),
                            },
                            {
                                label: "Manual",
                                value: "manual" as const,
                                ref: useRef(),
                            },
                        ]}
                    />
                </div>

                <AnimatePresence initial={false} mode="popLayout">
                    {feeTier === "auto" && (
                        <motion.div
                            key={"auto"}
                            initial={{x: -320, opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            exit={{x: -320, opacity: 0}}
                            className="shine mt-[12px] flex h-[60px] w-[318px] flex-row items-center justify-between rounded-lg px-[22px] py-[15px] md:h-[69px] md:w-[392px]"
                        >
                            <div className="flex flex-col items-center gap-[3px]">
                                <div className="iridescent-text text-xs font-medium md:text-sm">
                                    0 ~ 0.3%
                                </div>
                                <Badge
                                    variant="iridescent"
                                    className="h-[10px] px-[7px] text-4xs font-normal md:h-[12px] md:text-3xs"
                                >
                                    Fee Percentage
                                </Badge>
                            </div>

                            <div className="iridescent-text w-[200px] text-3xs md:w-[247px] md:text-2xs">
                                The protocol automatically adjust your fees in order to maximise
                                rewards and reduce impermanent loss
                            </div>
                        </motion.div>
                    )}
                    {feeTier === "manual" && (
                        <motion.div
                            key={"manual"}
                            initial={{x: 320, opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            exit={{x: 320, opacity: 0}}
                        >
                            <RadioGroup.Root
                                className="mt-[12px] flex h-[60px] w-[318px] flex-row items-center justify-between gap-[5px] rounded-lg md:h-[69px] md:w-[392px]"
                                defaultValue="0.05"
                            >
                                <RadioGroup.Item
                                    value="0.01"
                                    className="flex h-[66px] w-[75px] flex-col items-center rounded-md border border-black px-[7px] pb-[7px] pt-[9px] hover:bg-gray-0 data-[state=checked]:bg-black data-[state=checked]:text-white md:h-[80px] md:w-[93px] md:gap-1"
                                >
                                    <div className="text-2xs font-medium md:text-xs">0.01%</div>
                                    <div className="text-center text-3xs text-gray-2 ">
                                        Best for Very <br/> Stable Pairs
                                    </div>
                                    <div className="rounded bg-[#D8D8D8] px-1 text-4xs text-gray-2 md:text-3xs">
                                        (0% popularity)
                                    </div>
                                </RadioGroup.Item>

                                <RadioGroup.Item
                                    value={"0.05"}
                                    className="flex h-[66px] w-[75px] flex-col items-center rounded-md border border-black px-[7px] pb-[7px] pt-[9px] hover:bg-gray-0 data-[state=checked]:bg-black data-[state=checked]:text-white md:h-[80px] md:w-[93px] md:gap-1"
                                >
                                    <div className="text-2xs font-medium md:text-xs">0.05%</div>
                                    <div className="text-center text-3xs text-gray-2 ">
                                        Best for <br/> Stable Pairs
                                    </div>
                                    <div
                                        className="iridescent rounded bg-[#D8D8D8] px-1 text-4xs text-black md:text-3xs">
                                        (99% popularity)
                                    </div>
                                </RadioGroup.Item>

                                <RadioGroup.Item
                                    value={"0.10"}
                                    className="flex h-[66px] w-[75px] flex-col items-center rounded-md border border-black px-[7px] pb-[7px] pt-[9px] hover:bg-gray-0 data-[state=checked]:bg-black data-[state=checked]:text-white md:h-[80px] md:w-[93px] md:gap-1"
                                >
                                    <div className="text-2xs font-medium md:text-xs">0.10%</div>
                                    <div className="text-center text-3xs text-gray-2 ">
                                        Best for <br/> Stable Pairs
                                    </div>
                                    <div className="rounded bg-[#D8D8D8] px-1 text-4xs text-gray-2 md:text-3xs">
                                        (0% popularity)
                                    </div>
                                </RadioGroup.Item>

                                <RadioGroup.Item
                                    value={"0.15"}
                                    className="flex h-[66px] w-[75px] flex-col items-center rounded-md border border-black px-[7px] pb-[7px] pt-[9px] hover:bg-gray-0 data-[state=checked]:bg-black data-[state=checked]:text-white md:h-[80px] md:w-[93px] md:gap-1"
                                >
                                    <div className="text-2xs font-medium md:text-xs">0.15%</div>
                                    <div className="text-center text-3xs text-gray-2 ">
                                        Best for <br/> Stable Pairs
                                    </div>
                                    <div className="rounded bg-[#D8D8D8] px-1 text-4xs text-gray-2 md:text-3xs">
                                        (0% popularity)
                                    </div>
                                </RadioGroup.Item>
                            </RadioGroup.Root>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    className="mt-[20px] h-[212px] w-[318px] rounded-lg bg-black px-[20px] py-[11px] text-white md:h-[248px] md:w-[392px]">
                    <div className="flex w-full flex-row items-center justify-between">
                        <div className="text-3xs md:text-2xs">Liquidity Range</div>

                        <SegmentedControl
                            variant={"secondary"}
                            className={"text-3xs md:text-2xs"}
                            callback={(val) => setLiquidityRangeType(val)}
                            segments={[
                                {
                                    label: "Full Range",
                                    value: "full-range",
                                    ref: useRef(),
                                },
                                {
                                    label: "Auto",
                                    value: "auto",
                                    ref: useRef(),
                                },
                                {
                                    label: "Custom",
                                    value: "custom",
                                    ref: useRef(),
                                },
                            ]}
                        />
                    </div>

                    <div
                        className="mt-[22px] flex flex-row items-center justify-between px-[5px] md:mt-[24px] md:w-[270px]">
                        <div className="flex flex-col">
                            <div className="text-3xs text-gray-2 md:text-2xs">Low Price</div>
                            <div className={"border-b border-white text-2xs md:text-base"}>
                                780.28123
                            </div>
                            <div className="mt-1 flex flex-row items-center gap-1 text-3xs">
                                <Ethereum className="invert"/> USDC per ETH
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="text-3xs text-gray-2 md:text-2xs">High Price</div>
                            <div className={"border-b border-white text-2xs md:text-base"}>
                                ∞
                            </div>
                            <div className="mt-1 flex flex-row items-center gap-1 text-3xs">
                                <Ethereum className="invert"/> USDC per ETH
                            </div>
                        </div>
                    </div>

                    <div className="mt-[22px]">
                        <div className="text-3xs text-gray-2 md:text-2xs">Visualiser</div>
                        <ReactECharts
                            className="mt-1"
                            opts={{
                                height: 44,
                            }}
                            style={{
                                height: 44,
                            }}
                            ref={chartRef}
                            onChartReady={(chart) => {
                                if (liquidityRangeType === "custom") {
                                    chart.dispatchAction({
                                        type: "brush",
                                        areas: [
                                            {
                                                brushType: "lineX",
                                                coordRange: [5, 25],
                                                xAxisIndex: 0,
                                            },
                                        ],
                                    });
                                }
                            }}
                            option={chartOptions}
                        />

                        <div className="mt-[16px] flex flex-row justify-around text-4xs md:text-2xs">
                            <div className="flex flex-row items-center gap-1">
                                <SelectedRange/> Selected Range
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <CurrentPrice/> Current Price
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <LiquidityDistribution/> Liquidity Distribution
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-[21px] flex w-[318px] flex-row justify-end md:w-[392px]">
                    <div
                        onClick={() => setBreakdownHidden((v) => !v)}
                        className="flex cursor-pointer flex-row"
                    >
                        {breakdownHidden ? (
                            <>
                                <div className="text-2xs underline">Show Breakdown</div>
                                <div className="ml-1 rotate-90 text-2xs">{"<-"}</div>
                            </>
                        ) : (
                            <>
                                <div className="text-2xs underline">Hide breakdown</div>
                                <div className="ml-1 rotate-90 text-2xs">{"->"}</div>
                            </>
                        )}
                    </div>
                </div>

                <div
                    className={cn(
                        "mt-[10px] flex h-[60px] w-[318px] flex-col gap-[5px] overflow-hidden text-2xs transition-[height] md:w-[392px]",
                        {
                            "h-0": breakdownHidden,
                        },
                    )}
                >
                    <div className="flex flex-row justify-between">
                        <div>Fees</div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className={"flex flex-row items-center gap-1"}>
                                        <Gas/>
                                        $3.55
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    side={"bottom"}
                                    className={
                                        "rounded-lg border-0 bg-black pb-[14px] text-[8px] text-neutral-400"
                                    }
                                >
                                    <div className={""}>Fees</div>
                                    <div className={"mt-[7px] flex flex-row gap-[4px]"}>
                                        <div
                                            className={
                                                "flex w-[55.23px] flex-col items-center gap-[4px]"
                                            }
                                        >
                                            <div>$0.15</div>
                                            <div
                                                className={
                                                    "h-[3px] w-full rounded-[1px] bg-neutral-400"
                                                }
                                            />
                                            <div>Pool Fees</div>
                                        </div>
                                        <div
                                            className={
                                                "flex w-[138.88px] flex-col items-center gap-[4px]"
                                            }
                                        >
                                            <div>$3.40</div>
                                            <div
                                                className={
                                                    "h-[3px] w-full rounded-[1px] bg-neutral-400"
                                                }
                                            />
                                            <div>Network Fees</div>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div>Rewards</div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge className="h-[17px] px-1 text-2xs font-normal">
                                        <Token/>
                                        <Token className={"-ml-1"}/>
                                        <Token className={"-ml-1 mr-1"}/>
                                        <div className="iridescent-text">$6.11 - $33.12</div>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent
                                    side={"bottom"}
                                    className={
                                        "iridescent w-[221px] rounded-lg border-black pb-[14px] text-[8px] text-black"
                                    }
                                >
                                    <div className={"mt-[12px]"}>Super Route</div>
                                    <div className={"mt-[12px] flex flex-row"}>
                                        <div className={"flex flex-col items-center"}>
                                            <Token className={"size-[15px]"}/>
                                            <div>fUSDC</div>
                                        </div>
                                        <div className={"flex flex-1 flex-col justify-center"}>
                                            <div
                                                className={
                                                    "mb-3 w-full border border-dashed border-neutral-400"
                                                }
                                            />
                                        </div>
                                        <div className={"flex flex-col items-center"}>
                                            <div className={"flex flex-row"}>
                                                <Token className={"size-[15px]"}/>
                                                <Token className={"-ml-1 size-[15px]"}/>
                                            </div>
                                            Fluid Pool
                                        </div>
                                        <div className={"flex flex-1 flex-col justify-center"}>
                                            <div
                                                className={
                                                    "mb-3 w-full border border-dashed border-neutral-400"
                                                }
                                            />
                                        </div>
                                        <div className={"flex flex-col items-center"}>
                                            <Token className={"size-[15px]"}/>
                                            <div>ETH</div>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div>Route</div>
                        <div>Super Route</div>
                    </div>
                </div>

                <div
                    className="mt-[15px] h-[210px] w-[318px] rounded-lg bg-black px-[11px] pt-[16px] text-xs text-white md:w-[392px]">
                    <div>Yield Breakdown</div>

                    <div className="mt-[14px] flex w-full flex-col gap-[5px] pl-[5px] text-2xs">
                        <div className="flex flex-row justify-between">
                            <div>Pool Fees</div>

                            <div className={"flex flex-row items-center"}>
                                <Token/>
                                <Token className={"-ml-1 mr-1"}/>
                                $0 - $21.72
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div>Liquidity Boosts</div>

                            <div className={"flex flex-row items-center"}>
                                <Token/>
                                <Token className={"-ml-1 mr-1"}/>
                                $0.20 - $13.06
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div>Super Boosts</div>

                            <div className={"flex flex-row items-center"}>
                                <Token/>
                                <Token className={"-ml-1 mr-1"}/>
                                $5.91 - $8.34
                            </div>
                        </div>
                    </div>

                    <div className={"mt-[20px] flex flex-row justify-between pl-[5px]"}>
                        <div className="font-medium">Total</div>

                        <Badge
                            variant="iridescent"
                            className="h-[17px] px-1 text-2xs font-normal"
                        >
                            <Token/>
                            <Token className={"-ml-1"}/>
                            <Token className={"-ml-1 mr-1"}/>
                            <div>$6.11 - $33.12</div>
                        </Badge>
                    </div>

                    <div className="mt-[20px] flex flex-row gap-1 text-2xs">
                        <div className="flex w-[3%] flex-col">
                            <div>3%</div>
                            <div className="h-1 w-full rounded bg-white"></div>
                        </div>

                        <div className="flex w-[7%] flex-col items-center">
                            <div>7%</div>
                            <div className="h-1 w-full rounded bg-white"></div>
                        </div>

                        <div className="flex w-[30%] flex-col items-center">
                            <div>30%</div>
                            <div className="h-1 w-full rounded bg-white"></div>
                            <div>Super Boosts</div>
                        </div>

                        <div className="flex w-3/5 flex-col items-center">
                            <div>60%</div>
                            <div className="iridescent h-1 w-full rounded"></div>
                            <div>Utility Boosts</div>
                        </div>
                    </div>
                </div>

                <div className="mt-[20px] w-[318px] md:hidden">
                    <Index onSlideComplete={onSubmit}>
                        <div className="text-xs">Stake</div>
                    </Index>
                </div>

                <div className="mt-[20px] hidden md:inline-flex md:w-[392px]">
                    {address ? (
                        <Button className="w-full" onClick={onSubmit}>
                            Stake
                        </Button>
                    ) : (
                        <Button className={"w-full"} onClick={() => open()}>Connect Wallet</Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
