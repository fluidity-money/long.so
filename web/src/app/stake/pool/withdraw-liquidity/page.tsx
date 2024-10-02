"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Token from "@/assets/icons/token.svg";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import * as RadioGroup from "@radix-ui/react-radio-group";
import Slider from "@/components/Slider";
import ArrowDown from "@/assets/icons/arrow-down-white.svg";
import { useStakeStore } from "@/stores/useStakeStore";
import { useAccount, useChainId, useSimulateContract } from "wagmi";
import { graphql } from "@/gql";
import { useEffect, useMemo, useState } from "react";
import { usdFormat } from "@/lib/usdFormat";
import { sqrtPriceX96ToPrice } from "@/lib/math";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { TokenIcon } from "@/components/TokenIcon";
import { useTokens } from "@/config/tokens";
import { useContracts } from "@/config/contracts";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { CheckboxContainer } from "@/components/ui/checkbox";
import { superpositionTestnet } from "@/config/chains";
import { usePositions } from "@/hooks/usePostions";

export default function WithdrawLiquidity() {
  const router = useRouter();
  const params = useSearchParams();

  const positionId = params.get("positionId");

  const { address, chainId } = useAccount();
  const expectedChainId = useChainId();

  useEffect(() => {
    if ((!positionId && typeof window !== undefined) || !address) router.back();
  }, [positionId, router, address]);

  const fUSDC = useTokens(expectedChainId, "fusdc");
  const ammContract = useContracts(expectedChainId, "amm");
  const isCorrectChain = useMemo(
    () => chainId === expectedChainId,
    [chainId, expectedChainId],
  );

  const showLeo =
    useFeatureFlag("ui show leo") &&
    isCorrectChain &&
    expectedChainId === superpositionTestnet.id;

  const { open } = useWeb3Modal();

  const {
    token0,
    token0Amount,
    token1,
    token1Amount,
    setTickLower,
    setTickUpper,
    setDelta,
    deltaDisplay,
  } = useStakeStore();

  // Current tick of the pool
  const { data: { result: curTickNum } = { result: 0 } } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "curTick181C6FD9",
    args: [token0.address],
  });
  const curTick = BigInt(curTickNum);

  // Current liquidity of the position
  const { data: positionLiquidity } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "positionLiquidity8D11C045",
    args: [token0.address, BigInt(positionId ?? 0)],
  });

  const { data: poolSqrtPriceX96 } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "sqrtPriceX967B8F5FC5",
    args: [token0.address],
  });

  const tokenPrice = poolSqrtPriceX96
    ? sqrtPriceX96ToPrice(poolSqrtPriceX96.result, token0.decimals)
    : 0n;

  const { positions } = usePositions();
  const position = positions.find(
    (p) => p.positionId.toString() === positionId,
  );
  const {
    upper: upperTick,
    lower: lowerTick,
    isVested,
  } = position || { isVested: false };

  // update ticks in stakeStore based on the current position
  useEffect(() => {
    if (lowerTick === undefined || upperTick === undefined) return;
    setTickLower(lowerTick);
    setTickUpper(upperTick);
  }, [lowerTick, upperTick, setTickLower, setTickUpper]);

  const positionBalance = positionLiquidity?.result ?? 0n;

  const deltaUsd = useMemo(() => {
    if (!token0Amount || !token1Amount) return "$0.00";
    const token0AmountScaled =
      (Number(token0Amount) * Number(tokenPrice)) / 10 ** fUSDC.decimals;
    return usdFormat(token0AmountScaled + parseFloat(token1Amount));
  }, [token0Amount, token1Amount, fUSDC.decimals, tokenPrice]);

  // set the delta to delta/denom
  const setDeltaOverDenom = (denom: bigint) =>
    setDelta((positionBalance / denom).toString(), curTick);
  const setMaxBalance = () => setDeltaOverDenom(1n);

  // TODO when clicking on a selected balance, should it unselect and set to 0?
  const [balancePercent, setBalancePercent] = useState("");
  const handleBalancePercentButton = (percentString: string) => {
    setBalancePercent(percentString);
    switch (percentString) {
      case "25%":
        setDeltaOverDenom(4n);
        break;
      case "50%":
        setDeltaOverDenom(2n);
        break;
      case "75%":
        // 50% + 25%
        setDelta(
          (positionBalance / 4n + positionBalance / 2n).toString(),
          curTick,
        );
        break;
      case "100%":
        setMaxBalance();
        break;
    }
  };

  const [isDivesting, setIsDivesting] = useState(false);

  const onSubmit = () => {
    router.push(
      `/stake/pool/confirm-withdraw?positionId=${positionId}&divestPosition=${isDivesting}`,
    );
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layoutId="modal"
        className={cn(
          "relative z-10 h-[180px] w-[317px] rounded-lg bg-black px-[18px] pt-[10px] text-white md:h-[198px] md:h-[215px]",
          showLeo && "h-[210px] md:h-[218px]",
        )}
      >
        <motion.div className="flex flex-col" layout>
          <div className={cn("absolute -top-[15px] left-0 flex flex-row")}>
            <TokenIcon
              src={token0.icon}
              className="size-[30px] rounded-full border border-white"
            />
            <Badge
              variant="outline"
              className="-ml-2 h-[30px] w-[124px] justify-between border-[3px] bg-black pl-px text-white"
            >
              <Token className="size-[25px] invert" />
              {token0.symbol} - {token1.symbol}
            </Badge>
          </div>

          <div className="absolute -right-16 top-0 hidden md:inline-flex">
            <Button
              size={"sm"}
              className="h-[30px] w-[48px]"
              onClick={() => router.back()}
            >
              {"<-"} Esc
            </Button>
          </div>

          <div className={"flex flex-row justify-end"}>
            <div className="text-2xs">Withdraw Liquidity</div>
          </div>

          <div className={"mt-[14px]"}>
            <div className="text-3xs">Your Liquidity Positions</div>
          </div>

          <div
            className={
              "mt-[12px] flex flex-row items-center justify-between gap-2"
            }
          >
            <Badge variant={"outline"} className={"h-[27px] pl-0.5"}>
              <Token className={"size-[22px]"} />
              <div className="text-nowrap text-sm font-semibold text-white">
                {token0.symbol} x {token1.symbol}
              </div>
              <ArrowDown />
            </Badge>

            <Input
              className="border-0 bg-black pr-0 text-right text-2xl font-medium"
              placeholder={"0"}
              variant={"no-ring"}
              value={deltaDisplay}
              onChange={(e) => {
                setDelta(
                  e.target.value,
                  curTick,
                  positionLiquidity?.result ?? 0n,
                );
              }}
            />
          </div>

          <div className={"flex flex-row justify-between md:mt-[8px]"}>
            <div className={"text-2xs"}>
              Balance: {positionBalance.toString()}{" "}
              <span
                onClick={setMaxBalance}
                className="cursor-pointer underline"
              >
                Max
              </span>
            </div>

            <div className={"text-2xs"}>{deltaUsd}</div>
          </div>

          <div className="mt-[20px] md:mt-[25px]">
            <RadioGroup.Root
              value={balancePercent}
              onValueChange={(v) => handleBalancePercentButton(v)}
            >
              <div className="flex flex-row gap-[6px]">
                <RadioGroup.Item
                  value={"25%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3 py-2 text-[10px] font-medium data-[state=checked]:bg-white data-[state=checked]:text-black md:w-[84.75px]"
                >
                  25%
                </RadioGroup.Item>
                <RadioGroup.Item
                  value={"50%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3 py-2 text-[10px] font-medium data-[state=checked]:bg-white data-[state=checked]:text-black md:w-[84.75px]"
                >
                  50%
                </RadioGroup.Item>
                <RadioGroup.Item
                  value={"75%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3 py-2 text-[10px] font-medium data-[state=checked]:bg-white data-[state=checked]:text-black md:w-[84.75px]"
                >
                  75%
                </RadioGroup.Item>
                <RadioGroup.Item
                  value={"100%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3 py-2 text-[10px] font-medium data-[state=checked]:bg-white data-[state=checked]:text-black md:w-[84.75px]"
                >
                  100%
                </RadioGroup.Item>
              </div>
            </RadioGroup.Root>
          </div>
          {showLeo && (
            <CheckboxContainer
              enabled={isVested}
              checked={isDivesting}
              setChecked={setIsDivesting}
            >
              Harvest and burn the NFT of this position
            </CheckboxContainer>
          )}
        </motion.div>
      </motion.div>

      <div className="mt-[20px] inline-flex h-7 w-[316px] items-center justify-between rounded border border-orange-300 bg-black px-3 py-[9px] md:h-[30px] md:w-[378px]">
        <div className="text-center text-[8px] font-semibold text-orange-300 md:text-[10px]">
          ⚠️ All Outstanding Rewards for this pool will be claimed upon
          Withdrawal.
        </div>
      </div>

      {isCorrectChain ? (
        <div className="z-10 mt-[20px] w-[318px] md:hidden">
          <Slider
            disabled={isVested && !isDivesting}
            onSlideComplete={onSubmit}
          >
            <div className="text-xs font-medium">
              {isVested && !isDivesting
                ? "NFT must be harvested"
                : isVested && isDivesting
                  ? "Harvest and Withdraw"
                  : "Withdraw"}
            </div>
          </Slider>
        </div>
      ) : (
        <div className="z-10 mt-[20px] w-[318px] md:hidden">
          <Slider
            className="border border-destructive"
            onSlideComplete={() => open({ view: "Networks" })}
          >
            <div className="text-xs font-medium text-destructive">
              Wrong Network
            </div>
          </Slider>
        </div>
      )}

      {isCorrectChain ? (
        <div className="z-10 mt-[20px] hidden md:inline">
          <Button
            disabled={isVested && !isDivesting}
            className="h-[53.92px] w-[395px]"
            onClick={onSubmit}
          >
            {isVested && !isDivesting
              ? "NFT must be harvested"
              : isVested && isDivesting
                ? "Harvest and Withdraw"
                : "Withdraw"}
          </Button>
        </div>
      ) : (
        <div className="z-10 mt-[20px] hidden md:inline">
          <Button
            variant="destructiveBorder"
            className="h-[53.92px] w-[395px]"
            onClick={() => open({ view: "Networks" })}
          >
            Wrong Network
          </Button>
        </div>
      )}
    </div>
  );
}
