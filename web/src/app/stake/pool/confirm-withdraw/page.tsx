"use client";

import { Button } from "@/components/ui/button";
import { ammAddress } from "@/lib/addresses";
import { useStakeStore } from "@/stores/useStakeStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { output as seawaterContract } from "@/lib/abi/ISeawaterAMM";
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { fUSDC } from "@/config/tokens";
import { sqrtPriceX96ToPrice } from "@/lib/math";
import { getFormattedPriceFromAmount } from "@/lib/amounts";
import Confirm from "@/components/sequence/Confirm";
import { Success } from "@/components/sequence/Success";
import { Fail } from "@/components/sequence/Fail";

export default function ConfirmWithdrawLiquidity() {
  const router = useRouter();
  const params = useSearchParams();

  const positionId = params.get("positionId") ?? "0";

  const {
    token0,
    token0Amount,
    token0AmountRaw,
    token1,
    token1Amount,
    delta,
  } = useStakeStore();

  const {
    writeContract: writeContractUpdatePosition,
    data: updatePositionData,
    error: updatePositionError,
    isPending: isUpdatePositionPending,
  } = useWriteContract();

  const updatePositionResult = useWaitForTransactionReceipt({
    hash: updatePositionData,
  });

  const updatePosition = useCallback(
    (id: bigint) => {
      writeContractUpdatePosition({
        address: ammAddress,
        abi: seawaterContract.abi,
        functionName: "updatePosition",
        args: [token0.address, id, delta],
      });
    },
    [delta, writeContractUpdatePosition, token0AmountRaw, token0],
  );

  // price of the current pool
  const { data: poolSqrtPriceX96 } = useSimulateContract({
    address: ammAddress,
    abi: seawaterContract.abi,
    functionName: "sqrtPriceX96",
    args: [token0.address === fUSDC.address ? token1.address : token0.address],
  });

  const tokenPrice = poolSqrtPriceX96
    ? sqrtPriceX96ToPrice(poolSqrtPriceX96.result)
    : 0n;

  // step 1 pending
  if (isUpdatePositionPending || (updatePositionData && updatePositionResult?.isPending)) {
    return <Confirm
      text={"Withdrawal"}
      fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
      toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
      transactionHash={updatePositionData}
    />;
  }

  // success
  if (updatePositionResult.data) {
    return <Success transactionHash={updatePositionResult.data.transactionHash} />;
  }

  // error
  if (
    updatePositionError
  ) {
    return <Fail text={(updatePositionError as any)?.shortMessage} />;
  }


  return (
    <div className="z-10 flex flex-col items-center">
      <div className="h-[357px] w-[315px] rounded-lg bg-black p-[9px] text-white md:h-[357px] md:w-[394px]">
        <div className="flex flex-row items-center justify-between">
          <div className="px-[21px]  text-[10px] font-medium">
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
          <div className="text-2xl text-white"> {token0Amount} </div>
          <div className="text-[10px] text-neutral-400">= ${token0.address === fUSDC.address ? token0Amount : getFormattedPriceFromAmount(token0Amount, tokenPrice, token0.decimals, token1.decimals)}</div>
        </div>

        <div className="mt-[23px] px-[21px]">
          <div className={"text-[8px] font-semibold"}>{token1.symbol}</div>
          <div className="text-2xl text-white">{token1Amount}</div>
          <div className="text-[10px] text-neutral-400">= ${token1.address === fUSDC.address ? token1Amount : getFormattedPriceFromAmount(token1Amount, tokenPrice, token1.decimals, token0.decimals)}</div>
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

        <div className="mt-[30px] px-[7px]">
          <Button
            variant="secondary"
            className="h-10 w-[286px] md:h-10 md:w-[365px]"
            onClick={() => { updatePosition(BigInt(positionId)) }}
          >
            Confirm Withdrawal
          </Button>
        </div>
      </div>
    </div>
  );
}
