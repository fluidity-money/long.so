"use client";

import { WelcomeGradient } from "@/app/WelcomeGradient";
import { CampaignBanner } from "@/components/CampaignBanner";
import Gas from "@/assets/icons/gas.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const SwapForm = () => {
  return (
    <div className="group z-10 flex flex-col items-center ">
      <WelcomeGradient />

      <CampaignBanner />

      <div className="mt-[12px] h-[102px] w-[317px] rounded-lg bg-black md:h-[126.37px] md:w-[392.42px]" />

      <div className="mt-[7px] h-[102px] w-[317px] rounded-lg bg-black md:h-[126.37px] md:w-[392.42px]" />

      <div
        className={
          "mt-[12px] flex w-full flex-row items-center justify-between"
        }
      >
        <div
          className={
            "flex flex-row items-center gap-1 text-[10px] md:text-[12px]"
          }
        >
          <Gas />
          <div>$3.40</div>
        </div>

        <div className={"text-[10px] md:text-[12px]"}>
          <span className={"underline"}>See Breakdown</span> {"->"}
        </div>
      </div>

      <Badge className={"mt-[15px] h-[27px] w-full md:h-[31px]"}>
        Earn up-to $100 for making this trade!
      </Badge>

      <Button className={"mt-[20px] hidden h-[53.92px] w-full md:inline-flex"}>
        Swap
      </Button>
    </div>
  );
};
