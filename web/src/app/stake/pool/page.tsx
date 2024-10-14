"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SwapPro } from "@/components/SwapPro";
import { useHotkeys } from "react-hotkeys-hook";
import Token from "@/assets/icons/token.svg";
import { Badge } from "@/components/ui/badge";
import { Line } from "rc-progress";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { graphql, useFragment } from "@/gql";
import { useGraphqlGlobal } from "@/hooks/useGraphql";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { usdFormat } from "@/lib/usdFormat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getFormattedPriceFromTick,
  getFormattedPriceFromUnscaledAmount,
} from "@/lib/amounts";
import { useStakeStore } from "@/stores/useStakeStore";
import { useSwapStore } from "@/stores/useSwapStore";
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import useWriteContract from "@/fixtures/wagmi/useWriteContract";
import {
  getSqrtRatioAtTick,
  getTokenAmountsNumeric,
  sqrtPriceX96ToPrice,
} from "@/lib/math";
import { TokenIcon } from "@/components/TokenIcon";
import { usePositions } from "@/hooks/usePostions";
import {
  useTokens,
  getTokenFromAddress,
  Token as TokenType,
} from "@/config/tokens";
import { useContracts } from "@/config/contracts";
import { superpositionTestnet } from "@/config/chains";
import { simulateContract } from "wagmi/actions";
import config from "@/config";

export type CampaignPrices = {
  [k: `0x${string}`]: { decimals: number; tokenPrice: bigint };
};

const ManagePoolFragment = graphql(`
  fragment ManagePoolFragment on SeawaterPool {
    address
    id
    liquidity {
      liquidity
    }
    token {
      symbol
      name
      decimals
    }
    earnedFeesAPRFUSDC
    liquidityCampaigns {
      campaignId
      tickLower
      tickUpper
      fromTimestamp
      endTimestamp
    }
  }
`);

export default function PoolPage() {
  const router = useRouter();
  const { chainId } = useAccount();
  const expectedChainId = useChainId();
  const fUSDC = useTokens(expectedChainId, "fusdc");
  const ammContract = useContracts(expectedChainId, "amm");
  const leoContract = useContracts(expectedChainId, "leo");
  const ownershipNFTContract = useContracts(expectedChainId, "ownershipNFTs");
  useHotkeys("esc", () => router.back());

  // get the id from the query params
  const params = useSearchParams();
  const id = params.get("id");
  const positionIdParam = Number(params.get("positionId"));

  const { data: globalData } = useGraphqlGlobal();
  const allPoolsData = useFragment(ManagePoolFragment, globalData?.pools);
  const { positions: positionsData_, updatePositionLocal } = usePositions();
  const positionsData = useMemo(
    () =>
      positionsData_.filter(
        (p) =>
          p.pool.token.address === id &&
          parseFloat(p.liquidity.fusdc.valueUsd) +
            parseFloat(p.liquidity.token1.valueUsd) >
            0,
      ),
    [id, positionsData_],
  );

  const { token0, token1, setToken0, setToken1 } = useStakeStore();

  const { setToken0: setToken0Swap, setToken1: setToken1Swap } = useSwapStore();

  const isCorrectChain = useMemo(
    () => chainId === expectedChainId,
    [chainId, expectedChainId],
  );

  const handleTokens = useCallback(
    function (token0: TokenType, token1: TokenType) {
      // Graph is rendered by SwapPro, which uses the swap store
      // So we have to set both of these.
      setToken0(token0);
      setToken1(token1);
      setToken0Swap(token0);
      setToken1Swap(token1);
    },
    [setToken0, setToken1, setToken0Swap, setToken1Swap],
  );

  useEffect(() => {
    if (!id) return;
    const token = getTokenFromAddress(expectedChainId, id);
    if (!token) return;
    handleTokens(token, fUSDC);
  }, [id, expectedChainId, fUSDC, handleTokens]);

  const poolData = allPoolsData?.find((pool) => pool.id === id);

  const { liquidityCampaigns } = poolData || { liquidityCampaigns: [] };

  const setPositionId = (posId: number) =>
    router.replace(`?id=${id}&positionId=${posId}`);

  // position is the currently selected position based on
  // the query parameters
  const position = useMemo(() => {
    if (positionIdParam)
      return positionsData?.find((p) => p.positionId === positionIdParam);
    return positionsData?.[0];
  }, [positionIdParam, positionsData]);

  const {
    positionId,
    upper: upperTick,
    lower: lowerTick,
    isVested,
  } = position || {};

  const poolBalance = useMemo(
    () =>
      usdFormat(
        positionsData
          ? positionsData.reduce(
              (total, { liquidity: { fusdc, token1 } }) =>
                total +
                parseFloat(fusdc.valueUsd) +
                parseFloat(token1.valueUsd),
              0,
            )
          : 0,
      ),
    [positionsData],
  );

  // Current liquidity of the position
  const { data: positionLiquidity } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "positionLiquidity8D11C045",
    args: [token0.address, BigInt(positionId ?? 0)],
  });

  // Current tick of the pool
  const { data: { result: curTickNum } = { result: 0 } } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "curTick181C6FD9",
    args: [token0.address],
  });
  const curTick = BigInt(curTickNum);

  const { data: poolSqrtPriceX96 } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "sqrtPriceX967B8F5FC5",
    args: [token0.address],
  });

  const tokenPrice = poolSqrtPriceX96
    ? sqrtPriceX96ToPrice(poolSqrtPriceX96.result, token0.decimals)
    : 0n;

  const {
    writeContractAsync: writeContractCollect,
    data: collectData,
    error: collectError,
    isPending: isCollectPending,
    reset: resetCollect,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractVestPosition,
    data: vestPositionData,
    error: vestPositionError,
    isPending: isVestPositionPending,
    reset: resetVestPosition,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractApproveOwnershipNFT,
    data: approveOwnershipNFTData,
    error: approveOwnershipNFTError,
    isPending: isApproveOwnershipNFTPending,
    reset: resetApproveOwnershipNFT,
  } = useWriteContract();
  const vestError = vestPositionError || approveOwnershipNFTError;
  const vestPending =
    isVestPositionPending ||
    isApproveOwnershipNFTPending ||
    !!vestPositionData ||
    !!approveOwnershipNFTData;

  const { data: unclaimedRewardsData } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "collect7F21947C",
    args: [[token0.address], [BigInt(positionId ?? 0)]],
  });

  const { data: unclaimedLeoRewardsData } = useSimulateContract({
    address: leoContract.address,
    abi: leoContract.abi,
    functionName: "collect",
    args: [
      [{ token: token0.address, id: BigInt(positionId ?? 0) }],
      liquidityCampaigns?.map((c) => c.campaignId as `0x${string}`),
    ],
  });

  // campaignTokenPrices is the price of each token used in a campaign for this position
  const [campaignTokenPrices, setCampaignTokenPrices] =
    useState<CampaignPrices>({});
  useEffect(() => {
    (async () => {
      const prices: CampaignPrices = {};
      // no campaign rewards
      if (!unclaimedLeoRewardsData) return prices;
      for (const reward of unclaimedLeoRewardsData.result.campaignRewards) {
        // looking at a seawater reward, not a leo reward
        if (!("campaignToken" in reward)) continue;
        const campaignToken =
          reward.campaignToken.toLowerCase() as `0x${string}`;
        // already seen this token
        if (campaignToken in prices) continue;
        // find token details
        const token = getTokenFromAddress(expectedChainId, campaignToken);
        if (!token) {
          console.warn("Token not found, skipping!", campaignToken);
          continue;
        }
        // look up price
        const { result: poolSqrtPriceX96 } = await simulateContract(
          config.wagmiConfig,
          {
            address: ammContract.address,
            abi: ammContract.abi,
            functionName: "sqrtPriceX967B8F5FC5",
            args: [token.address],
          },
        );
        // store converted price
        const tokenPrice = sqrtPriceX96ToPrice(
          poolSqrtPriceX96,
          token.decimals,
        );
        prices[campaignToken] = { decimals: token.decimals, tokenPrice };
      }
      setCampaignTokenPrices(prices);
    })();
  }, [
    unclaimedLeoRewardsData,
    setCampaignTokenPrices,
    ammContract.abi,
    ammContract.address,
    expectedChainId,
  ]);

  const unclaimedRewards = useMemo(() => {
    if (!(unclaimedRewardsData || unclaimedLeoRewardsData) || !positionId)
      return "$0.00";

    // Sum all Leo rewards, scaled by the price of their token
    const campaignRewards =
      unclaimedLeoRewardsData?.result.campaignRewards.reduce(
        (acc, campaignReward) => {
          if (!("campaignToken" in campaignReward)) return acc;
          const campaignToken =
            campaignReward.campaignToken.toLowerCase() as `0x${string}`;
          if (!(campaignToken in campaignTokenPrices)) return acc;
          const tokenDetails = campaignTokenPrices[campaignToken];
          const reward = getFormattedPriceFromUnscaledAmount(
            campaignReward.rewards,
            tokenDetails.decimals,
            tokenDetails.tokenPrice,
            fUSDC.decimals,
          );
          return acc + reward;
        },
        0,
      ) ?? 0;

    // Sum regular rewards
    const [{ amount0, amount1 }] = unclaimedRewardsData?.result || [
      { amount0: 0n, amount1: 0n },
    ];
    const token0AmountScaled = getFormattedPriceFromUnscaledAmount(
      amount0,
      token0.decimals,
      tokenPrice,
      fUSDC.decimals,
    );
    const token1AmountScaled = Number(amount1) / 10 ** fUSDC.decimals;
    return usdFormat(token0AmountScaled + token1AmountScaled + campaignRewards);
  }, [
    unclaimedRewardsData,
    unclaimedLeoRewardsData,
    fUSDC.decimals,
    positionId,
    token0.decimals,
    tokenPrice,
    campaignTokenPrices,
  ]);

  const collect = useCallback(
    (id: bigint) => {
      if (unclaimedLeoRewardsData?.result)
        writeContractCollect({
          address: leoContract.address,
          abi: leoContract.abi,
          functionName: "collect",
          args: [
            [{ token: token0.address, id }],
            liquidityCampaigns?.map((c) => c.campaignId as `0x${string}`),
          ],
        });
      else
        writeContractCollect({
          address: ammContract.address,
          abi: ammContract.abi,
          functionName: "collect7F21947C",
          args: [[token0.address], [id]],
        });
    },
    [
      writeContractCollect,
      token0,
      ammContract,
      unclaimedLeoRewardsData?.result,
      leoContract,
      liquidityCampaigns,
    ],
  );

  const vestPosition = useCallback(
    (id: bigint) => {
      writeContractVestPosition({
        address: leoContract.address,
        abi: leoContract.abi,
        functionName: "vestPosition",
        args: [token0.address, id],
      });
    },
    [
      writeContractVestPosition,
      leoContract.address,
      leoContract.abi,
      token0.address,
    ],
  );

  const vestPositionResult = useWaitForTransactionReceipt({
    hash: vestPositionData,
  });

  const approveOwnershipNFT = useCallback(
    (id: bigint) =>
      writeContractApproveOwnershipNFT({
        address: ownershipNFTContract.address,
        abi: ownershipNFTContract.abi,
        functionName: "approve",
        args: [leoContract.address, id],
      }),
    [
      writeContractApproveOwnershipNFT,
      ownershipNFTContract.address,
      ownershipNFTContract.abi,
      leoContract.address,
    ],
  );
  // wait for the approveOwnershipNFT transaction to complete
  const approveOwnershipNFTResult = useWaitForTransactionReceipt({
    hash: approveOwnershipNFTData,
  });
  useEffect(() => {
    // if we're vesting in Leo, have approved the ownership transfer, but haven't vested the position, do so now
    if (
      approveOwnershipNFTResult.isSuccess &&
      !isVested &&
      vestPositionResult.fetchStatus === "idle" &&
      !vestPositionResult.data &&
      positionId
    )
      vestPosition(BigInt(positionId));
  }, [
    vestPosition,
    isVested,
    positionId,
    approveOwnershipNFTResult.isSuccess,
    vestPositionResult.data,
    vestPositionResult.fetchStatus,
  ]);

  // update local position when vesting is completed
  useEffect(() => {
    if (position && vestPositionResult.isSuccess) {
      updatePositionLocal({
        ...position,
        isVested: true,
      });
    }
  }, [updatePositionLocal, vestPositionResult.isSuccess, position]);

  // reset callbacks when switching positions
  useEffect(() => {
    resetApproveOwnershipNFT();
    resetVestPosition();
    resetCollect();
  }, [position, resetVestPosition, resetApproveOwnershipNFT, resetCollect]);

  const positionBalance = useMemo(() => {
    if (!positionLiquidity || !position) return 0;
    const [amount0, amount1] = getTokenAmountsNumeric(
      Number(positionLiquidity.result),
      Number(getSqrtRatioAtTick(curTick)),
      position.lower,
      position.upper,
    );
    return usdFormat(
      (amount0 * Number(tokenPrice)) /
        10 ** (token0.decimals + fUSDC.decimals) +
        amount1 / 10 ** token1.decimals,
    );
  }, [
    position,
    positionLiquidity,
    tokenPrice,
    token0,
    token1,
    curTick,
    fUSDC.decimals,
  ]);

  const showMockData = useFeatureFlag("ui show demo data");
  const showBoostIncentives = useFeatureFlag("ui show boost incentives");
  const showUtilityIncentives = useFeatureFlag("ui show utility incentives");
  const showLiquidityIncentives = useFeatureFlag(
    "ui show liquidity incentives",
  );
  const showSuperIncentives = useFeatureFlag("ui show super incentives");
  const showLiveUtilityRewards = useFeatureFlag("ui show live utility rewards");
  const showTokensGivenOut = useFeatureFlag("ui show tokens given out");
  const showClaimYield = useFeatureFlag("ui show claim yield");
  const showPoolRewardRange = useFeatureFlag("ui show pool reward range");
  const showEarnedFeesApr = useFeatureFlag("ui show earned fees apr");

  const showLeo =
    useFeatureFlag("ui show leo") &&
    isCorrectChain &&
    expectedChainId === superpositionTestnet.id;

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

  const superIncentives = 0;

  const liquidityCampaignsApy = 0;

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
                  <TokenIcon
                    src={token0.icon}
                    className={"size-[24px] invert"}
                  />
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
                  {!position ? (
                    <Link href={`/stake/pool/create?id=${id}`} legacyBehavior>
                      <Button
                        variant="secondary"
                        className="flex-1 text-3xs md:text-2xs"
                        size="sm"
                      >
                        + Create New Position
                      </Button>
                    </Link>
                  ) : (
                    <>
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
                        href={`/stake/pool/withdraw-liquidity?positionId=${positionId}`}
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
                    </>
                  )}
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <div className="text-3xs md:text-2xs">My Pool Balance</div>
                    <div className="text-xl md:text-2xl">
                      {/* TODO: get my pool balance */}
                      {showMockData ? "$190,301" : poolBalance}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="text-nowrap text-3xs md:text-2xs">
                      Unclaimed Rewards
                    </div>
                    <div className="text-xl md:text-2xl">
                      {/* TODO:get unclaimed rewards */}
                      {showMockData ? "$52,420" : unclaimedRewards}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <div className="text-3xs md:text-2xs">
                      Current Position Range
                    </div>
                    <div className="text-xl md:text-2xl">
                      {lowerTick
                        ? getFormattedPriceFromTick(
                            lowerTick,
                            token0.decimals,
                            token1.decimals,
                          )
                        : usdFormat(0)}
                      -
                      {upperTick
                        ? getFormattedPriceFromTick(
                            upperTick,
                            token0.decimals,
                            token1.decimals,
                          )
                        : usdFormat(0)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="text-3xs md:text-2xs">
                      Current Position Balance
                    </div>
                    <div className="text-xl md:text-2xl">{positionBalance}</div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <div className="text-3xs md:text-2xs">Select Position</div>
                    <Select
                      value={`${positionId}`}
                      onValueChange={(value) => setPositionId(Number(value))}
                      defaultValue={`${position?.positionId}`}
                    >
                      <SelectTrigger className="h-6 w-auto border-0 bg-black p-0 text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {positionsData?.map((position) => (
                          <SelectItem
                            key={`${position.positionId}`}
                            value={`${position.positionId}`}
                          >
                            {position.positionId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                            {showMockData ? 15 : 0}% ~ {showMockData ? 25 : ""}%
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
                            {showMockData ? 20 : superIncentives}% ~{" "}
                            {showMockData ? 30 : superIncentives}%
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
                          {showMockData ? 200 : 0}/{showMockData ? "1,000" : 0}{" "}
                          tokens given out
                        </div>
                        <Line
                          percent={showMockData ? 20 : 0}
                          strokeColor="#EBEBEB"
                          strokeWidth={4}
                          className="rounded-full border border-white"
                          trailWidth={0}
                          trailColor="#1E1E1E"
                        />
                      </div>
                    )}

                    <div className="flex flex-1" />
                    {showLeo && (
                      <div>
                        <Button
                          variant={vestError ? "destructive" : "secondary"}
                          className="h-[19px] w-[75px] select-none px-[27px] py-[5px] md:h-[22px] md:w-[92px]"
                          size="sm"
                          disabled={isVested || vestPending}
                          onClick={() =>
                            positionId &&
                            approveOwnershipNFT(BigInt(positionId))
                          }
                        >
                          <div className="text-3xs">
                            {isVested
                              ? "Vested"
                              : vestError
                                ? "Failed"
                                : vestPositionData
                                  ? "Vested!"
                                  : vestPending
                                    ? "Vesting..."
                                    : "Vest Position"}
                          </div>
                        </Button>
                      </div>
                    )}
                    {showClaimYield && (
                      <div>
                        <Button
                          variant={collectError ? "destructive" : "secondary"}
                          className="h-[19px] w-[75px] select-none px-[27px] py-[5px] md:h-[22px] md:w-[92px]"
                          size="sm"
                          disabled={!!collectData || isCollectPending}
                          onClick={() =>
                            positionId && collect(BigInt(positionId))
                          }
                        >
                          <div className="text-3xs">
                            {collectError
                              ? "Failed"
                              : collectData
                                ? "Claimed!"
                                : isCollectPending
                                  ? "Claiming..."
                                  : "Claim Yield"}
                          </div>
                        </Button>
                      </div>
                    )}

                    {showBoostIncentives && (
                      <div>
                        <Button
                          variant="secondary"
                          className="iridescent h-[19.24px] w-[102.15px] px-4 py-0.5 md:px-8 md:text-base"
                          size="sm"
                        >
                          <div className="text-2xs">Boost Incentives</div>
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
