"use client";

import { Button } from "@/components/ui/button";
import Ethereum from "@/assets/icons/ethereum.svg";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStakeStore } from "@/stores/useStakeStore";
import TokenIridescent from "@/assets/icons/token-iridescent.svg";

interface ConfirmStakeProps {
  mode: "new" | "existing";
}

export const ConfirmStake = ({ mode }: ConfirmStakeProps) => {
  const router = useRouter();

  const multiSingleToken = useStakeStore((s) => s.multiSingleToken);

  return (
    <div className="z-10 flex flex-col items-center">
      <div
        className={cn("w-[315px] rounded-lg bg-black text-white md:w-[393px]", {
          "md:h-[685px]": mode === "existing",
          "md:h-[673px]": mode === "new",
          "md:h-[770px]": multiSingleToken === "single",
        })}
      >
        <div className="flex flex-row items-center justify-between p-[9px]">
          <div className="p-[6px] text-3xs md:text-xs">
            {mode === "new"
              ? "Stake Confirmation"
              : "Add Liquidity Confirmation"}
          </div>
          <Button
            size="sm"
            variant={"secondary"}
            className="h-[20px] w-[32px] text-3xs md:h-[26px] md:w-[36px] md:text-2xs"
            onClick={() => router.back()}
          >
            Esc
          </Button>
        </div>

        <div
          className={cn("mt-[26px] flex flex-col items-center md:mt-[30px]", {
            hidden: multiSingleToken === "single",
          })}
        >
          <div className="text-3xs md:text-2xs">
            {mode === "new"
              ? "Total Deposited Amount in"
              : "Approximate Total Deposit Amount in"}{" "}
            <span className="hidden md:inline-flex">
              {" "}
              <span className="font-medium underline">$USD</span>
            </span>
          </div>
          <div className="mt-[4px] text-2xl font-medium md:text-3xl">
            $1,433.35
          </div>
          <div className="mt-[4px] text-3xs font-medium text-gray-2 md:text-2xs">
            The amount is split into{" "}
            <span className="text-white underline">2 Tokens</span> below:
          </div>
        </div>

        <div
          className={cn("mt-[26px] flex flex-col items-center md:mt-[30px]", {
            hidden: multiSingleToken === "multi",
          })}
        >
          <div className="text-3xs md:text-2xs">
            {mode === "new"
              ? "Total Deposited Amount in"
              : "Approximate Total Deposit Amount in"}{" "}
            <span className="hidden md:inline-flex">
              {" "}
              <span className="font-medium underline">ƒUSDC</span>
            </span>
          </div>
          <div className="mt-[4px] flex flex-row items-center gap-[6px] text-2xl font-medium md:text-3xl">
            <TokenIridescent />
            <div>700</div>
          </div>
          <div className="mt-[4px] text-3xs font-medium text-gray-2 md:text-2xs">
            (= $700)
          </div>
          <div className="mt-[19px] w-[212px] text-center text-3xs font-medium text-gray-2 md:mt-[17px] md:w-[250px] md:text-2xs">
            Your <span className="iridescent-text">700 ƒUSDC</span> will be
            converted into the following two tokens to set your position in this
            pool <div className="inline-block rotate-90">{"->"}</div>
          </div>
        </div>

        <div
          className={cn("mt-[20px] flex flex-col items-center", {
            hidden: multiSingleToken === "multi",
          })}
        >
          <div className="flex h-[156px] w-[272px] flex-col rounded-md border md:h-[199px] md:w-[349px]">
            <div className="flex flex-1 flex-row justify-between border-b pl-[18px] pr-[26px] pt-[16px]">
              <div className="flex w-full flex-col gap-1">
                <div className="text-3xs md:text-2xs">ETH</div>
                <div className="flex  flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-1 text-sm md:gap-2 md:text-2xl">
                    <Ethereum className={"invert"} />
                    <div>0.1</div>
                  </div>
                  <div className="text-3xs text-gray-2 md:text-xs">50%</div>
                </div>
                <div className="text-3xs text-gray-2">= $350.00</div>
              </div>
            </div>

            <div className="flex flex-1 flex-row justify-between pl-[18px] pr-[26px] pt-[16px]">
              <div className="flex w-full flex-col gap-1">
                <div className="text-3xs md:text-2xs">ƒUSDC</div>
                <div className="flex  flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-1 text-sm md:gap-2 md:text-2xl">
                    <TokenIridescent />
                    <div>350.00</div>
                  </div>
                  <div className="text-3xs text-gray-2 md:text-xs">50%</div>
                </div>
                <div className="text-3xs text-gray-2">= $350.00</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn("mt-[15px] pl-[21px]", {
            hidden: multiSingleToken === "single",
          })}
        >
          <div className="text-3xs font-medium md:text-2xs">ETH</div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <Ethereum className={"invert"} /> 100.1234
          </div>
          <div className="mt-0.5 text-2xs text-gray-2 md:text-xs">
            = $350.00
          </div>
        </div>

        <div
          className={cn("mt-[23px] pl-[21px]", {
            hidden: multiSingleToken === "single",
          })}
        >
          <div className="text-3xs font-medium md:text-2xs">ƒUSDC</div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <Ethereum className={"invert"} /> 100,230,989.00
          </div>
          <div className="mt-0.5 text-2xs text-gray-2 md:text-xs">
            = $350.00
          </div>
        </div>

        <div className="mt-[21px] flex flex-row justify-between px-[21px] text-3xs font-medium md:text-2xs md:font-normal">
          <div>Expected Shares</div>
          <div>0.000321568910</div>
        </div>
        <div
          className={cn("px-[21px]", {
            "mt-[29px] md:mt-[37px]": mode === "new",
            "mt-[19px] md:mt-[16px]": mode === "existing",
          })}
        >
          <div className="text-3xs font-medium md:text-2xs md:font-normal">
            Projected Yield
          </div>
          <div className="mt-[13px] flex flex-col gap-[5px] px-[4px] text-2xs">
            <div className="flex flex-row justify-between">
              <div>Fees</div>
              <div>5%</div>
            </div>

            <div className="flex flex-row justify-between">
              <div>Protocol Boosts</div>
              <div>3.5%</div>
            </div>

            <div className="flex flex-row justify-between">
              <div>Super Boosts</div>
              <div>2%</div>
            </div>

            <div className="mt-[15px] flex flex-row justify-between">
              <div>APY</div>
              <div className="iridescent rounded px-1 text-black">12.09%</div>
            </div>

            <div className="flex flex-row justify-between">
              <div>Yield</div>
              <div>$247.88</div>
            </div>
          </div>
        </div>

        <div className="mt-[20px] px-[21px]">
          <div className="text-3xs">Yield Composition</div>

          <div className="mt-[20px] flex flex-row gap-1 text-2xs">
            <div className="flex w-[3%] flex-col gap-1">
              <div>3%</div>
              <div className="h-1 w-full rounded bg-white"></div>
              <div className="text-4xs md:hidden">Fees</div>
            </div>

            <div className="flex w-[7%] flex-col items-center gap-1">
              <div>7%</div>
              <div className="h-1 w-full rounded bg-white"></div>
              <div className="text-4xs md:hidden">Protocol Boosts</div>
            </div>

            <div className="flex w-[30%] flex-col items-center gap-1">
              <div>30%</div>
              <div className="h-1 w-full rounded bg-white"></div>
              <div className="text-4xs md:text-3xs">Super Boosts</div>
            </div>

            <div className="flex w-3/5 flex-col items-center gap-1">
              <div>60%</div>
              <div className="iridescent h-1 w-full rounded"></div>
              <div className="text-4xs md:text-3xs">Utility Boosts</div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col items-center p-[15px]">
          <Button variant={"secondary"} className="w-full max-w-[350px]">
            Confirm Stake
          </Button>
        </div>
      </div>
    </div>
  );
};
