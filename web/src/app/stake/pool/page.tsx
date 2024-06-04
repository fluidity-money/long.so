"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SwapPro } from "@/components/SwapPro";
import { useHotkeys } from "react-hotkeys-hook";
import Token from "@/assets/icons/token.svg";
import Ethereum from "@/assets/icons/ethereum.svg";
import { Badge } from "@/components/ui/badge";
import { Line } from "rc-progress";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import ReactECharts from "echarts-for-react";
import Link from "next/link";
import { useEffect } from "react";
import { graphql, useFragment } from "@/gql";
import { useGraphqlGlobal } from "@/hooks/useGraphql";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { usdFormat } from "@/lib/usdFormat";

const ManagePoolFragment = graphql(`
  fragment ManagePoolFragment on SeawaterPool {
    address
    id
    token {
      symbol
      name
    }
    liquidityIncentives {
      valueScaled
    }
    superIncentives {
      valueScaled
    }
    utilityIncentives {
      amountGivenOut
      maximumAmount
    }
    earnedFeesAPRFUSDC
  }
`);

export default function PoolPage() {
  const router = useRouter();

  useHotkeys("esc", () => router.back());

  // get the id from the query params
  const params = useSearchParams();
  const id = params.get("id");
  const positionId = params.get("positionId")

  const { data } = useGraphqlGlobal();
  const allPoolsData = useFragment(ManagePoolFragment, data?.pools);

  const poolData = allPoolsData?.find((pool) => pool.id === id);

  const showMockData = useFeatureFlag("ui show demo data");
  const showBoostIncentives = useFeatureFlag("ui show boost incentives");
  const showUtilityIncentives = useFeatureFlag("ui show utility incentives");
  const showLiquidityIncentives = useFeatureFlag("ui show liquidity incentives");
  const showSuperIncentives = useFeatureFlag("ui show super incentives");
  const showLiveUtilityRewards = useFeatureFlag("ui show live utility rewards");
  const showTokensGivenOut = useFeatureFlag("ui show tokens given out");
  const showClaimYield = useFeatureFlag("ui show claim yield");
  const showPoolRewardRange = useFeatureFlag("ui show pool reward range");
  const showEarnedFeesApr = useFeatureFlag("ui show earned fees apr");

  /**
   * Redirect to the stake page if the id is not present
   */
  useEffect(() => {
    if (!id) router.push("/stake");
  }, [router, id]);

  // if the id is not present, return null
  // will be handled by the useEffect above
  if (!id) return null;

  // if we aren't showing mock data and we don't have pool data, return null
  // this should only be the case when the data is initially loading, or an invalid id is passed
  // TODO: provide feedback for invalid IDs
  if (!showMockData && !poolData) return null;

  return (
    <div className="flex w-full flex-col">
      <div className="flex max-w-full flex-col-reverse justify-center gap-8 lg:flex-row">
        <div className="flex flex-col items-center">
          <SwapPro override badgeTitle />
        </div>

        <div className="flex flex-col items-center">
          <div className="z-10 flex w-full flex-col items-center px-4">
            <motion.div
              layoutId="modal"
              className="flex w-[19.8125rem] flex-col rounded-lg bg-black p-2 pt-0 text-white md:w-[393px]"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="p-4 text-2xs">Manage Pool</div>
                <Button
                  variant="secondary"
                  className="h-[26px] w-12 px-[9px] py-[7px] text-2xs"
                  onClick={() => router.back()}
                >
                  {"<-"} Esc
                </Button>
              </div>

              <div className="mt-px flex flex-row items-center justify-between px-4">
                <div className="flex flex-row items-center">
                  <Ethereum className={"size-[24px] invert"} />
                  <Badge className="iridescent z-20 -ml-1 flex flex-row gap-2 border-4 border-black pl-1 text-black">
                    <Token className={"size-[24px]"} />
                    <div className="text-nowrap text-sm">
                      fUSDC-{showMockData ? "ETH" : poolData?.token?.symbol}
                    </div>
                  </Badge>
                </div>

                {showLiveUtilityRewards && (
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="iridescent flex h-4 w-[93px] flex-row pl-0.5 text-black md:w-[132px]">
                      <div className="flex flex-row">
                        <Token className={"size-[14px]"} />
                        <Token className={"ml-[-5px] size-[14px]"} />
                        <Token className={"ml-[-5px] size-[14px]"} />
                      </div>
                      <div className="text-nowrap text-4xs font-medium md:text-2xs">
                        Live Utility Rewards
                      </div>
                    </Badge>

                    <p className="text-3xs">5days | 24hrs | 30min</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-8 p-4">
                <div className="flex flex-row gap-2">
                  <Link
                    href={`/stake/pool/add-liquidity?id=${id}&positionId=${positionId}`}
                    legacyBehavior
                  >
                    <Button
                      variant="secondary"
                      className="flex-1 text-3xs md:text-2xs"
                      size="sm"
                    >
                      + Add Liquidity
                    </Button>
                  </Link>
                  <Link
                    href={`/stake/pool/withdraw-liquidity?id=${id}`}
                    legacyBehavior
                  >
                    <Button
                      variant="secondary"
                      className="flex-1 text-3xs md:text-2xs"
                      size="sm"
                    >
                      - Withdraw Liquidity
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <div className="text-3xs md:text-2xs">My Pool Balance</div>
                    <div className="text-xl md:text-2xl">
                      {/* TODO: get my pool balance */}
                      {showMockData ? "$190,301" : usdFormat(0)}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="text-nowrap text-3xs md:text-2xs">
                      Unclaimed Rewards
                    </div>
                    <div className="text-xl md:text-2xl">
                      {/* TODO:get unclaimed rewards */}
                      {showMockData ? "$52,420" : usdFormat(0)}
                    </div>
                  </div>

                  {showClaimYield && (
                    <div>
                      <Button
                        variant="secondary"
                        className="h-[19px] w-[75px] px-[27px] py-[5px] md:h-[22px] md:w-[92px]"
                        size="sm"
                      >
                        <div className="text-3xs">Claim Yield</div>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-[7px]">
                  {showPoolRewardRange && (
                    <div className="flex flex-row justify-between">
                      <div className="text-xs">Pool Reward Range</div>

                      <div className="text-xs">
                        {/* TODO: get pool reward range */}
                        {showMockData ? 40 : 0}% ~{" "}
                        <span className="font-bold">
                          {showMockData ? 100 : 0}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-2">
                    {showEarnedFeesApr && (
                      <div className="flex flex-row justify-between text-2xs">
                        <div>Earned Fees APR</div>

                        <div className="flex flex-row items-center gap-2">
                          <Token size="small" />
                          <div>
                            {/* TODO: this data is not a range */}
                            {showMockData ? 1 : poolData?.earnedFeesAPRFUSDC}% ~{" "}
                            {showMockData ? 5 : poolData?.earnedFeesAPRFUSDC}%
                          </div>
                        </div>
                      </div>
                    )}

                    {showLiquidityIncentives && (
                      <div className="flex flex-row justify-between text-2xs">
                        <div>Liquidity Incentives</div>

                        <div className="flex flex-row items-center gap-2">
                          <Token size="small" />
                          <div className="z-20 -ml-3">
                            <Token size="small" />
                          </div>
                          <div>
                            {/* TODO: is the liquidity incentives value a percentage? data is not a range */}
                            {showMockData
                              ? 15
                              : poolData?.liquidityIncentives.valueScaled}
                            % ~{" "}
                            {showMockData
                              ? 25
                              : poolData?.liquidityIncentives.valueScaled}
                            %
                          </div>
                        </div>
                      </div>
                    )}

                    {showSuperIncentives && (
                      <div className="flex flex-row justify-between text-2xs">
                        <div>Super Incentives</div>

                        <div className="flex flex-row items-center gap-2">
                          <Token size="small" />
                          <div>
                            {showMockData
                              ? 20
                              : poolData?.superIncentives.valueScaled}
                            % ~{" "}
                            {showMockData
                              ? 30
                              : poolData?.superIncentives.valueScaled}
                            %
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {showUtilityIncentives && (
                    <div className="flex flex-row justify-between text-2xs">
                      <div>Utility Incentives</div>

                      <div className="flex flex-row items-center gap-2">
                        <Token size="small" />
                        <div>
                          {/* TODO: get utility incentives percentage range */}
                          {showMockData ? 20 : 0}% ~ {showMockData ? 30 : 0}%
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-row items-center justify-start gap-[10px] text-sm">
                    <div className="mt-[6px] h-[25px] w-0.5 bg-white" />

                    {showTokensGivenOut && (
                      <div className="flex flex-col gap-1">
                        <div className="text-3xs">
                          {showMockData
                            ? 200
                            : poolData?.utilityIncentives[0]?.amountGivenOut ?? 0}
                          /
                          {showMockData
                            ? "1,000"
                            : poolData?.utilityIncentives[0]?.maximumAmount ??
                              0}{" "}
                          tokens given out
                        </div>
                        <Line
                          percent={
                            showMockData
                              ? 20
                              : parseFloat(
                                  poolData?.utilityIncentives[0]
                                    ?.amountGivenOut ?? "0",
                                ) /
                                parseFloat(
                                  poolData?.utilityIncentives[0]?.maximumAmount ??
                                    "0",
                                )
                          }
                          strokeColor="#EBEBEB"
                          strokeWidth={4}
                          className="rounded-full border border-white"
                          trailWidth={0}
                          trailColor="#1E1E1E"
                        />
                      </div>
                    )}

                    <div className="flex flex-1" />

                    {showBoostIncentives && (
                      <div>
                        <Button
                          variant="secondary"
                          className="iridescent h-[19.24px] w-[102.15px] px-4 py-0.5 md:px-8 md:text-base"
                          size="sm"
                        >
                          <div className="text-2xs ">Boost Incentives</div>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
