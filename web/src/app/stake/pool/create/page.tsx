"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function CreatePoolPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-[400px]">
        <CampaignBanner />
      </div>

      <div className="mt-[12px] flex flex-col gap-[5px] md:gap-[7px]">
        <motion.div
          layoutId={"modal"}
          className="flex h-[102px] w-[318px] flex-col gap-4 rounded-lg bg-black p-2 pt-0 text-white md:h-[150px] md:w-[392px]"
        ></motion.div>

        <div className="flex h-[102px] w-[318px] flex-col gap-4 rounded-lg bg-black p-2 pt-0 text-white md:h-[150px] md:w-[392px]"></div>
      </div>

      <div className="mt-[12px] flex w-[318px] flex-row items-center justify-between md:w-[392px]">
        <div className="text-3xs md:text-2xs">Fee Tier</div>
        <div className="h-[26px] w-[82px] rounded-md bg-black"></div>
      </div>

      <div className="shine mt-[12px] flex h-[60px] w-[318px] flex-row items-center justify-between rounded-lg px-[22px] py-[15px] md:h-[69px] md:w-[392px]">
        <div className="flex flex-col items-center gap-[3px]">
          <div className="iridescent-text text-xs font-medium md:text-sm">
            0 ~ 0.3%
          </div>
          <Badge
            variant="iridescent"
            className="h-[10px] px-[7px] text-4xs md:h-[12px] md:text-3xs"
          >
            Fee Percentage
          </Badge>
        </div>

        <div className="iridescent-text w-[247px] text-3xs md:text-2xs">
          The protocol automatically adjust your fees in order to maximise
          rewards and reduce impermanent loss
        </div>
      </div>

      <div className="mt-[20px] h-[212px] w-[318px] rounded-lg bg-black md:h-[248px] md:w-[392px]"></div>

      <div className="mt-[21px] flex w-[318px] flex-row justify-end md:w-[392px]">
        <div className="text-2xs underline">Hide breakdown</div>
      </div>

      <div className="mt-[15px] h-[200px] w-[318px] rounded-lg bg-black md:w-[392px]"></div>

      <div className="mt-[20px]"></div>
    </div>
  );
}
