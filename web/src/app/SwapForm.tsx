"use client";

import { WelcomeGradient } from "@/app/WelcomeGradient";
import { CampaignBanner } from "@/components/CampaignBanner";
import Gas from "@/assets/icons/gas.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Token from "@/assets/icons/token.svg";
import Swap from "@/assets/icons/Swap.svg";
import ArrowDown from "@/assets/icons/arrow-down-white.svg";
import { SuperloopPopover } from "@/app/SuperloopPopover";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const SwapForm = () => {
  const [breakdownHidden, setBreakdownHidden] = useState(true);

  return (
    <div className="group z-10 flex flex-col items-center ">
      <div className={"flex w-[317px] flex-col items-center md:w-[392.42px]"}>
        <WelcomeGradient />

        <CampaignBanner />

        <div className="relative mt-[19px] h-[102px] w-[317px] rounded-lg bg-black pb-[19px] pl-[21px] pr-[15px] pt-[17px] text-white md:h-[126.37px] md:w-[392.42px] md:pb-[25px] md:pl-[25px] md:pr-[20px] md:pt-[22px]">
          <SuperloopPopover />
          <div className={"flex h-full flex-col justify-between"}>
            <div className={"flex flex-row items-center justify-between"}>
              <div className={"text-[8px] md:text-[10px]"}>Swap</div>

              <div className={"text-[8px] md:text-[10px]"}>US Dollar Coin</div>
            </div>

            <div className={"flex flex-row items-center justify-between"}>
              <Input
                className="-ml-2 border-0 bg-black pl-2 text-2xl"
                autoFocus
                variant={"no-ring"}
              />

              <Badge
                variant="outline"
                className="flex h-[26px] w-[82px] cursor-pointer flex-row justify-between pl-0.5 pr-1 text-white md:h-[33px] md:w-[90px] md:pl-[4px] md:text-base"
              >
                <Token className="size-[20px] md:size-[25px]" />
                <div>USDC</div>
                <ArrowDown className="ml-1 h-[5.22px] w-[9.19px] md:h-[6.46px] md:w-[11.38px]" />
              </Badge>
            </div>

            <div className={"flex flex-row items-center justify-between"}>
              <div className={"text-[10px] text-zinc-400"}>$1,024.82</div>

              <div
                className={"flex flex-row gap-[17px] text-[8px] md:text-[10px]"}
              >
                <div>Balance: 1231.01</div>
                <div className={"cursor-pointer underline"}>Max</div>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant={"secondary"}
          className={
            "z-50 mt-[-12px] size-[32px] p-0 transition-all hover:rounded-[20px] hover:bg-white md:mt-[-15px] md:size-[40px]"
          }
        >
          <Swap />
        </Button>

        <div className="mt-[-12px] flex h-[102px] w-[317px] flex-col justify-between rounded-lg bg-black pb-[19px] pl-[21px] pr-[15px] pt-[17px] text-white md:mt-[-15px] md:h-[126.37px] md:w-[392.42px] md:pl-[25px] md:pr-[20px] md:pt-[22px]">
          <div className={"flex flex-row items-center justify-between"}>
            <div className={"text-[8px] md:text-[10px]"}>Receive</div>

            <div className={"text-[8px] md:text-[10px]"}>Ether</div>
          </div>

          <div className={"flex flex-row items-center justify-between"}>
            <div className={"text-2xl"}>0.87</div>

            <Badge
              variant="outline"
              className="flex h-[26px] w-[82px] cursor-pointer flex-row justify-between pl-0.5 pr-1 text-white md:h-[33px] md:w-[90px] md:pl-[4px] md:text-base"
            >
              <Token className="size-[20px] md:size-[25px]" />
              <div>ETH</div>
              <ArrowDown className="ml-1 h-[5.22px] w-[9.19px] md:h-[6.46px] md:w-[11.38px]" />
            </Badge>
          </div>

          <div className={"flex flex-row items-center justify-between"}>
            <div className={"text-[10px] text-zinc-400"}>$1,024.82</div>

            <div
              className={"flex flex-row gap-[17px] text-[8px] md:text-[10px]"}
            >
              <div>Balance: 1231.01</div>
            </div>
          </div>
        </div>

        <div
          className={
            "mt-[12px] flex w-full flex-row items-center justify-between"
          }
        >
          <div
            className={cn(
              "flex flex-row items-center gap-1 text-[10px] md:text-[12px]",
              {
                hidden: !breakdownHidden,
              },
            )}
          >
            <Gas />
            <div>$3.40</div>
          </div>

          <div
            className={cn("text-[10px] md:text-[12px]", {
              hidden: breakdownHidden,
            })}
          >
            1024.82 fUSDC = 0.87 ETH
          </div>

          <div className={"cursor-pointer text-[10px] md:text-[12px]"}>
            <div
              onClick={() => setBreakdownHidden((v) => !v)}
              className="flex cursor-pointer flex-row"
            >
              {breakdownHidden ? (
                <>
                  <div className="underline">See Breakdown</div>
                  <div className="ml-1">{"->"}</div>
                </>
              ) : (
                <>
                  <div className="underline">Hide breakdown</div>
                  <div className="ml-1 rotate-90">{"<-"}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex h-[75px] h-auto w-full flex-col gap-[7px] overflow-hidden text-[10px] transition-all",
            {
              "h-0": breakdownHidden,
              "mt-[7px]": !breakdownHidden,
            },
          )}
        >
          <div className={"flex flex-row justify-between"}>
            <div>Fees</div>
            <div className={"flex flex-row items-center gap-1"}>
              <Gas /> $0.10
            </div>
          </div>
          <div className={"flex flex-row justify-between"}>
            <div>Rewards</div>
            <Badge className="h-[17px] px-1 text-2xs font-normal">
              <Token />
              <Token className={"-ml-1"} />
              <Token className={"-ml-1 mr-1"} />
              <div className="iridescent-text">$6.11 - $33.12</div>
            </Badge>
          </div>

          <div className="flex flex-row justify-between">
            <div>Route</div>
            <div>Super Route</div>
          </div>
        </div>

        <Badge
          className={cn("shine mt-[15px] h-[27px] w-full pl-1.5 md:h-[31px]", {
            hidden: !breakdownHidden,
          })}
        >
          <Token className={"size-[20px]"} />
          <Token className={"-ml-2 size-[20px]"} />
          <Token className={"-ml-2 mr-2 size-[20px]"} />

          <div className={"iridescent-text text-[12px] md:text-[14px]"}>
            Earn up-to $100 for making this trade!
          </div>
        </Badge>

        <div
          className={cn(
            "mt-[15px] h-[140px] w-[317px] rounded-lg bg-black px-[15px] py-[17px] text-white md:mt-[22px] md:h-[140px] md:w-[393px]",
            {
              hidden: breakdownHidden,
            },
          )}
        >
          <div className={"text-[12px]"}>Rewards Breakdown</div>
          <div className={"mt-[10px] flex flex-col gap-[4px] "}>
            <div className={"flex flex-row justify-between text-[10px]"}>
              <div>Fluid Rewards</div>
              <div
                className={"iridescent-text flex flex-row items-center gap-1"}
              >
                <Token />
                <div>$0 - $21.72</div>
              </div>
            </div>
            <div className={"flex flex-row justify-between text-[10px]"}>
              <div>Trader Rewards</div>
              <div
                className={"iridescent-text flex flex-row items-center gap-1"}
              >
                <Token />
                <div>$5.91 - $8.34</div>
              </div>
            </div>
            <div className={"flex flex-row justify-between text-[10px]"}>
              <div>Super Rewards</div>
              <div
                className={"iridescent-text flex flex-row items-center gap-1"}
              >
                <Token />
                <Token className={"-ml-2"} />
                <div>$0.20 - $13.06</div>
              </div>
            </div>
          </div>
          <div
            className={
              "mt-[10px] flex flex-row items-center justify-between text-[10px]"
            }
          >
            <div className={"font-semibold"}>Total</div>
            <Badge
              variant="iridescent"
              className="h-[17px] px-1 text-2xs font-normal"
            >
              <Token />
              <Token className={"-ml-1"} />
              <Token className={"-ml-1 mr-1"} />
              <div>$6.11 - $33.12</div>
            </Badge>
          </div>
        </div>

        <Button
          className={"mt-[20px] hidden h-[53.92px] w-full md:inline-flex"}
        >
          Swap
        </Button>
      </div>
    </div>
  );
};
