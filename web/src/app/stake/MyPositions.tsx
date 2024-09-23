"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import List from "@/assets/icons/list.svg";
import Grid from "@/assets/icons/grid.svg";
import { cn } from "@/lib/utils";
import { MyPositionsTable } from "@/app/stake/_MyPositionsTable/MyPositionsTable";
import { columns, Pool } from "@/app/stake/_MyPositionsTable/columns";
import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";
import Position from "@/assets/icons/position.svg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import TokenIridescent from "@/assets/icons/token-iridescent.svg";
import SegmentedControl from "@/components/ui/segmented-control";
import { useAccount, useChainId, useSimulateContract } from "wagmi";
import useWriteContract from "@/fixtures/wagmi/useWriteContract";
import { mockMyPositions } from "@/demoData/myPositions";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { TokenIcon } from "@/components/TokenIcon";
import { useStakeStore } from "@/stores/useStakeStore";
import { sqrtPriceX96ToPrice } from "@/lib/math";
import { usePositions } from "@/hooks/usePostions";
import { LoaderIcon } from "lucide-react";
import { useTokens, type Token, getTokenFromAddress } from "@/config/tokens";
import { useContracts } from "@/config/contracts";

export const MyPositions = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const chainId = useChainId();
  const fUSDC = useTokens(chainId, "fusdc");
  const ammContract = useContracts(chainId, "amm");
  const leoContract = useContracts(chainId, "leo");
  const [expanded, setExpanded] = useState(false);

  const router = useRouter();

  const { address } = useAccount();
  const { token0 } = useStakeStore();

  const showDemoData = useFeatureFlag("ui show demo data");
  const showClaimAllYield = useFeatureFlag("ui show claim all yield");

  const { positions: walletData, isLoading } = usePositions();

  // this is every position, with their respective pools
  const pools = useMemo((): Pool[] | undefined => {
    if (showDemoData && address) return mockMyPositions;

    return walletData
      .map((position) => ({
        positionId: position.positionId,
        id: position.pool.token.address,
        duration: Math.round(
          // now - created
          new Date().valueOf() - new Date(position.created * 1000).valueOf(),
        ),
        tokens: [
          fUSDC,
          {
            name: position.pool.token.name,
            address: position.pool.token.address as `0x${string}`,
            symbol: position.pool.token.symbol,
            decimals: position.pool.token.decimals,
          },
        ] satisfies [Token, Token],
        staked:
          parseFloat(position.liquidity.fusdc.valueUsd) +
          parseFloat(position.liquidity.token1.valueUsd),
        // TODO set this based on unclaimedRewardsData
        totalYield: 0,
        isVested: position.isVested,
        liquidityCampaigns: position.pool.liquidityCampaigns,
      }))
      .filter((position) => position.staked > 0);
  }, [showDemoData, address, walletData]);

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
    writeContractAsync: writeContractCollectSeawater,
    data: collectSeawaterData,
    error: collectSeawaterError,
    isPending: isCollectSeawaterPending,
  } = useWriteContract();

  const {
    writeContractAsync: writeContractCollectLeo,
    data: collectLeoData,
    error: collectLeoError,
    isPending: isCollectLeoPending,
  } = useWriteContract();

  const collectData = collectSeawaterData && collectLeoData;
  const collectError = collectSeawaterError || collectLeoError;
  const isCollectPending = isCollectSeawaterPending || isCollectLeoPending;

  const [campaignIds, vestedPositions, nonVestedPositions] = useMemo(
    () =>
      [
        // unique campaign IDs
        [...new Set(
          pools?.flatMap(p => p.liquidityCampaigns?.map(l =>
            l.campaignId as `0x${string}`)
          ))
        ] ?? [],
        // positions that are leo
        pools?.filter(p => p.isVested).map(p => ({
          // tokens are always [fUSDC, token]
          token: p.tokens[1].address,
          id: BigInt(p.positionId)
        })) ?? [],
        // positions that aren't leo
        pools?.filter(p => !p.isVested) ?? [],
      ] as const,
    [pools],
  )

  const collectSeawaterArgs = useMemo(
    () =>
      [
        nonVestedPositions.map((p) => p.id as `0x${string}`),
        nonVestedPositions.map((p) => BigInt(p.positionId))
      ] as const,
    [nonVestedPositions],
  );

  const { data: unclaimedRewardsData } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "collect7F21947C",
    args: collectSeawaterArgs,
  });

  const unclaimedRewards = useMemo(() => {
    if (!unclaimedRewardsData) return "$0.00";

    const rewards = unclaimedRewardsData.result.reduce((p, c) => {
      const token0AmountScaled =
        (Number(c.amount0) * Number(tokenPrice)) /
        10 ** (token0.decimals + fUSDC.decimals);
      const token1AmountScaled = Number(c.amount1) / 10 ** fUSDC.decimals;
      return p + token0AmountScaled + token1AmountScaled;
    }, 0);
    return usdFormat(rewards);
  }, [unclaimedRewardsData, token0, tokenPrice]);

  const collectAll = useCallback(() => {
    // for all positions that are in leo, call leo collect
    vestedPositions.length > 0 && writeContractCollectLeo({
      address: leoContract.address,
      abi: leoContract.abi,
      functionName: "collect",
      args: [vestedPositions, campaignIds],
    })
    // for all other positions, call normal collect
    writeContractCollectSeawater({
      address: ammContract.address,
      abi: ammContract.abi,
      functionName: "collect7F21947C",
      args: collectSeawaterArgs,
    });
  }, [writeContractCollectLeo, writeContractCollectSeawater, vestedPositions, campaignIds, collectSeawaterArgs]);

  return (
    <motion.div
      layoutId="modal"
      className={cn(
        "flex h-full w-full flex-col gap-2 rounded-lg bg-black p-4 pb-2 text-white transition-[height]",
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-3xs md:text-2xs">My Positions</div>

        <SegmentedControl
          variant={"secondary"}
          callback={(val) => setDisplayMode(val)}
          segments={[
            {
              label: (
                <div className={"flex flex-row items-center gap-1"}>
                  <List />
                  List
                </div>
              ),
              value: "list",
              ref: useRef(),
            },
            {
              label: (
                <div className={"flex flex-row items-center gap-1"}>
                  <Grid />
                  Grid
                </div>
              ),
              value: "grid",
              ref: useRef(),
            },
          ]}
        />
      </div>

      <div className={cn("h-full overflow-y-auto transition-[height]")}>
        {!pools || pools?.length === 0 ? (
          isLoading ? (
            <div className={"flex h-full flex-col items-center justify-center"}>
              <LoaderIcon className="size-8 animate-spin" />
            </div>
          ) : (
            <div className="flex min-h-[149px] flex-col items-center justify-center">
              <div className="text-2xs">
                Your active positions will appear here.
              </div>
            </div>
          )
        ) : displayMode === "list" ? (
          pools && <MyPositionsTable columns={columns} data={pools} />
        ) : (
          <motion.div
            layout
            className={cn("grid grid-cols-5 gap-4", {
              "mb-4 flex-wrap": expanded,
            })}
          >
            {pools?.map((pool) => (
              <motion.div
                layout
                key={pool.id}
                className="flex h-[83px] w-[77px] cursor-pointer flex-col items-center rounded-xl border border-white p-2 md:h-[120px] md:min-w-[111px] md:gap-1"
                onClick={() =>
                  router.push(
                    `/stake/pool?id=${pool.id}&positionId=${pool.positionId}`,
                  )
                }
              >
                <div className="flex w-full flex-row">
                  <div className="size-1 rounded-full bg-red-500 md:size-2" />
                </div>

                <div className="-mt-1 flex flex-col md:-mt-2">
                  <div className="flex flex-row">
                    <TokenIcon
                      src={getTokenFromAddress(chainId, pool.id)?.icon}
                      className="ml-[-2px] size-[25px] rounded-full border border-black md:size-[35px]"
                    />
                    <TokenIridescent className="ml-[-6px] size-[25px] rounded-full border-2 border-black md:size-[35px]" />
                  </div>
                  <div className="flex flex-row justify-center">
                    <Badge
                      variant="outline"
                      className="md:text-3xs z-20 -mt-1 text-nowrap bg-black p-0 px-px text-[4px] text-white md:-mt-2 md:px-[2px]"
                    >
                      {pool.tokens[0].name}
                      {" x "}
                      {pool.tokens[1].name}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs md:text-sm">
                    {usdFormat(pool.staked)}
                  </div>
                  <div className="text-gray-2 md:text-3xs mt-[-2px] text-[4px]">
                    No Yield Yet
                  </div>
                </div>
                <Badge
                  onClick={() =>
                    router.push(
                      `/stake/pool?id=${pool.id}&positionId=${pool.positionId}`,
                    )
                  }
                  variant="secondary"
                  className="text-2xs mt-[5px] h-6 w-full justify-center gap-1 text-nowrap p-0 px-1"
                >
                  <Position className={"size-[6px] md:size-[10px]"} />
                  <div className="text-4xs md:text-3xs">
                    {usdFormat(pool.staked)} Position
                  </div>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {pools && pools.length > 0 && (
        <div className="flex flex-col items-center md:hidden">
          <Button
            variant="link"
            className="text-2xs group flex h-6 flex-row gap-2 text-white hover:no-underline"
            size={"sm"}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                <div className="group-hover:underline">Hide</div>
                <div className="-rotate-90">{"->"}</div>
              </>
            ) : (
              <>
                <div className="group-hover:underline">Expand</div>
                <div className="rotate-90">{"->"}</div>
              </>
            )}
          </Button>
        </div>
      )}

      <div className="flex max-w-full flex-row gap-2">
        {pools && showClaimAllYield && pools.length > 0 && (
          <div className="flex flex-1 flex-col items-center">
            <Button
              className="text-3xs w-full text-black md:text-xs"
              variant={collectError ? "destructive" : "iridescent"}
              disabled={!!collectData || isCollectPending}
              size="sm"
              onClick={() => collectAll()}
            >
              {collectError
                ? "Failed"
                : collectData
                  ? "Claimed!"
                  : isCollectPending
                    ? "Claiming..."
                    : "Claim All Yield"}
            </Button>
            <Badge
              variant={collectError ? "destructive" : "iridescent"}
              className="text-3xs -mt-2 gap-2 border-2 border-black"
            >
              {unclaimedRewards}
            </Badge>
          </div>
        )}
        <Link href={"/stake/pool/create"} className="flex-1">
          <Button
            className="text-3xs w-full md:text-xs"
            variant="secondary"
            size="sm"
          >
            + Create New Position
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
