"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ConfirmWithdrawLiquidity() {
  const router = useRouter();
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
          <div className="text-[8px] font-semibold">ETH</div>
          <div className="text-2xl text-white">1.76</div>
          <div className="text-[10px] text-neutral-400">= $5,025.11</div>
        </div>

        <div className="mt-[23px] px-[21px]">
          <div className={"text-[8px] font-semibold"}>ƒUSDC</div>
          <div className="text-2xl text-white">4,964.37</div>
          <div className="text-[10px] text-neutral-400">= $4,964.37</div>
        </div>

        <div>
          <div
            className={
              "mt-[35px] flex flex-row justify-between px-[21px] text-[10px]"
            }
          >
            <div>Total Shares</div>
            <div>0.015</div>
          </div>
          <div
            className={
              "mt-[10px] flex flex-row justify-between px-[21px] text-[10px]"
            }
          >
            <div>Approx. Total Value</div>
            <div className="iridescent rounded-sm px-1 text-black">1.15%</div>
          </div>
        </div>

        <div className="mt-[30px] px-[7px]">
          <Button
            variant="secondary"
            className="h-10 w-[286px] md:h-10 md:w-[365px]"
          >
            Confirm Withdrawal
          </Button>
        </div>
      </div>
    </div>
  );
}
