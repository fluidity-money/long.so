"use client";

import { Button } from "@/components/ui/button";
import { useStakeStore } from "@/stores/useStakeStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import useWriteContract from "@/fixtures/wagmi/useWriteContract";
import { useTokens } from "@/config/tokens";
import { sqrtPriceX96ToPrice } from "@/lib/math";
import {
  getFormattedPriceFromAmount,
  getUsdTokenAmountsForPosition,
} from "@/lib/amounts";
import Confirm from "@/components/sequence/Confirm";
import { Success } from "@/components/sequence/Success";
import { Fail } from "@/components/sequence/Fail";
import { TokenIcon } from "@/components/TokenIcon";
import { usePositions } from "@/hooks/usePostions";
import { useContracts } from "@/config/contracts";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { superpositionTestnet } from "@/config/chains";

export default function ConfirmWithdrawLiquidity() {
  const router = useRouter();
  const params = useSearchParams();

  const positionId = params.get("positionId") ?? "0";

  const { address, chainId } = useAccount();
  const expectedChainId = useChainId();
  const fUSDC = useTokens(expectedChainId, "fusdc");
  const ammContract = useContracts(expectedChainId, "amm");
  const leoContract = useContracts(expectedChainId, "leo");

  useEffect(() => {
    if (!address || chainId !== expectedChainId) router.back();
  }, [address, expectedChainId, chainId, router]);

  const showLeo =
    useFeatureFlag("ui show leo") && chainId === superpositionTestnet.id;
  const isDivesting = showLeo && params.get("divestPosition") === "true";

  const {
    token0,
    token0Amount,
    token0AmountRaw,
    token1,
    token1Amount,
    delta,
    tickLower,
    tickUpper,
  } = useStakeStore();

  const { updatePositionLocal } = usePositions();

  // Current liquidity of the position
  const { data: positionLiquidity } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "positionLiquidity8D11C045",
    args: [token0.address, BigInt(positionId ?? 0)],
  });

  const isWithdrawingEntirePosition = positionLiquidity?.result === delta;

  const {
    writeContractAsync: writeContractUpdatePosition,
    data: updatePositionData,
    error: updatePositionError,
    isPending: isUpdatePositionPending,
    reset: resetUpdatePosition,
  } = useWriteContract();

  const updatePositionResult = useWaitForTransactionReceipt({
    hash: updatePositionData,
  });

  const {
    writeContractAsync: writeContractCollect,
    data: collectData,
    error: collectError,
    isPending: isCollectPending,
    reset: resetCollect,
  } = useWriteContract();

  const collectResult = useWaitForTransactionReceipt({
    hash: collectData,
  });

  const {
    writeContractAsync: writeContractDivestPosition,
    data: divestPositionData,
    error: divestPositionError,
    isPending: isDivestPositionPending,
    reset: resetDivestPosition,
  } = useWriteContract();

  const divestPositionResult = useWaitForTransactionReceipt({
    hash: divestPositionData,
  });

  const updatePosition = useCallback(
    (id: bigint) => {
      writeContractUpdatePosition({
        address: ammContract.address,
        abi: ammContract.abi,
        functionName: "updatePositionC7F1F740",
        args: [token0.address, id, -delta],
      });
    },
    [delta, writeContractUpdatePosition, token0, ammContract],
  );

  const collect = useCallback(
    (id: bigint) => {
      writeContractCollect({
        address: ammContract.address,
        abi: ammContract.abi,
        functionName: "collect7F21947C",
        args: [[token0.address], [BigInt(id ?? 0)]],
      });
    },
    [writeContractCollect, token0, ammContract],
  );

  const divestPosition = useCallback(
    (id: bigint) => {
      writeContractDivestPosition({
        address: leoContract.address,
        abi: leoContract.abi,
        functionName: "divestPosition",
        args: [token0.address, BigInt(id ?? 0)],
      });
    },
    [writeContractDivestPosition, token0, leoContract.abi, leoContract.address],
  );

  // price of the current pool
  const { data: poolSqrtPriceX96 } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "sqrtPriceX967B8F5FC5",
    args: [token0.address === fUSDC.address ? token1.address : token0.address],
  });

  const tokenPrice = poolSqrtPriceX96
    ? sqrtPriceX96ToPrice(poolSqrtPriceX96.result, token0.decimals)
    : 0n;

  const { data: unclaimedRewardsData } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "collect7F21947C",
    args: [[token0.address], [BigInt(positionId ?? 0)]],
  });

  const confirmWithdraw = (id: bigint) => {
    const [{ amount0, amount1 }] = unclaimedRewardsData?.result || [
      { amount0: 0, amount1: 0 },
    ];
    if (isDivesting) {
      divestPosition(BigInt(positionId));
    } else if (isWithdrawingEntirePosition && (amount0 > 0 || amount1 > 0)) {
      collect(id);
    } else {
      updatePosition(BigInt(positionId));
    }
  };

  // once yield is collected or position is divested, update position
  useEffect(() => {
    if (
      (isWithdrawingEntirePosition && collectResult.data) ||
      (isDivesting && divestPositionResult.data)
    )
      updatePosition(BigInt(positionId));
  }, [
    updatePosition,
    positionId,
    collectResult.data,
    isWithdrawingEntirePosition,
    isDivesting,
    divestPositionResult.data,
  ]);

  const getAmountsAndSetPosition = useCallback(
    function (tickLower: number, tickUpper: number) {
      const position = {
        positionId: Number(positionId),
        pool: {
          token: token0,
          liquidityCampaigns: [],
        },
        lower: tickLower,
        upper: tickUpper,
        isVested: !isDivesting,
      };
      getUsdTokenAmountsForPosition(
        expectedChainId,
        position,
        token0,
        Number(tokenPrice),
      ).then(([amount0, amount1]) =>
        updatePositionLocal({
          ...position,
          created: Math.round(new Date().getTime() / 1000),
          served: {
            timestamp: Math.round(new Date().getTime() / 1000),
          },
          liquidity: {
            fusdc: {
              valueUsd: String(amount1),
            },
            token1: {
              valueUsd: String(amount0),
            },
          },
        }),
      );
    },
    [
      expectedChainId,
      isDivesting,
      token0,
      positionId,
      tokenPrice,
      updatePositionLocal,
    ],
  );

  useEffect(() => {
    if (updatePositionResult.isSuccess) {
      if (tickLower && tickUpper) {
        getAmountsAndSetPosition(tickLower, tickUpper);
      }
    }
  }, [
    getAmountsAndSetPosition,
    tickLower,
    tickUpper,
    updatePositionResult.isSuccess,
  ]);

  // TODO - may need to call Leo and Seawater's respective collect functions

  // step 1 - divest from Leo if position is vested
  if (
    isDivesting &&
    (isDivestPositionPending ||
      (divestPositionData && divestPositionResult?.isPending))
  ) {
    return (
      <Confirm
        text={"Divest Position"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={divestPositionData}
      />
    );
  }

  // step 2 - collect yield from position if emptying entire balance
  if (
    isWithdrawingEntirePosition &&
    (isCollectPending || (collectData && collectResult?.isPending))
  ) {
    return (
      <Confirm
        text={"Yield Collection"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={updatePositionData}
      />
    );
  }

  // step 3 - update position
  if (
    isUpdatePositionPending ||
    (updatePositionData && updatePositionResult?.isPending)
  ) {
    return (
      <Confirm
        text={"Withdrawal"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={updatePositionData}
      />
    );
  }

  // success
  if (updatePositionResult.data) {
    return (
      <Success
        onDone={() => {
          resetUpdatePosition();
          resetCollect();
          resetDivestPosition();
          router.push("/stake");
        }}
        transactionHash={updatePositionResult.data?.transactionHash}
      />
    );
  }

  // error
  if (updatePositionError || collectError || divestPositionError) {
    const error = updatePositionError || collectError;
    return <Fail text={(error as any)?.shortMessage} />;
  }

  return (
    <div className="z-10 flex flex-col items-center">
      <div className="h-[357px] w-[315px] rounded-lg bg-black p-[9px] text-white md:h-[357px] md:w-[394px]">
        <div className="flex flex-row items-center justify-between">
          <div className="px-[21px] text-[10px] font-medium">
            Withdraw Liquidity Confirmation
          </div>
          <Button
            variant={"secondary"}
            size={"sm"}
            className={
              "h-[20.70px] w-8 text-[8px] md:h-[26px] md:w-9 md:text-[10px]"
            }
            onClick={() => router.back()}
          >
            Esc
          </Button>
        </div>

        <div className="mt-[26px] px-[21px]">
          <div className="text-[8px] font-semibold">{token0.symbol}</div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <TokenIcon src={token0.icon} className={"size-[24px] invert"} />{" "}
            {token0Amount}
          </div>
          <div className="text-[10px] text-neutral-400">
            = $
            {token0.address === fUSDC.address
              ? token0Amount
              : getFormattedPriceFromAmount(
                  token0Amount,
                  tokenPrice,
                  fUSDC.decimals,
                )}
          </div>
        </div>

        <div className="mt-[23px] px-[21px]">
          <div className={"text-[8px] font-semibold"}>{token1.symbol}</div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <TokenIcon src={token1.icon} className={"size-[24px] invert"} />{" "}
            {token1Amount}
          </div>
          <div className="text-[10px] text-neutral-400">
            = $
            {token1.address === fUSDC.address
              ? token1Amount
              : getFormattedPriceFromAmount(
                  token1Amount,
                  tokenPrice,
                  fUSDC.decimals,
                )}
          </div>
        </div>

        <div>
          <div
            className={
              "mt-[35px] flex flex-row justify-between px-[21px] text-[10px]"
            }
          >
            <div>Total Shares</div>
            <div>???</div>
          </div>
          <div
            className={
              "mt-[10px] flex flex-row justify-between px-[21px] text-[10px]"
            }
          >
            <div>Approx. Total Value</div>
            <div className="iridescent rounded-sm px-1 text-black">???%</div>
          </div>
        </div>

        <div className="mt-[22px] px-[7px]">
          <Button
            variant="secondary"
            className="h-10 w-[286px] md:h-10 md:w-[365px]"
            onClick={() => {
              confirmWithdraw(BigInt(positionId));
            }}
          >
            Confirm Withdrawal
          </Button>
        </div>
      </div>
    </div>
  );
}
