"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { motion } from "framer-motion";

export default function CreatePoolPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-[400px]">
        <CampaignBanner />
      </div>

      <div className="mt-[12px] flex flex-col gap-[5px]">
        <motion.div
          layoutId={"modal"}
          className="flex h-[102px] w-[318px] flex-col gap-4 rounded-lg bg-black p-2 pt-0 text-white"
        ></motion.div>

        <div className="flex h-[102px] w-[318px] flex-col gap-4 rounded-lg bg-black p-2 pt-0 text-white"></div>
      </div>

      <div className="mt-[12px] flex w-[318px] flex-row items-center justify-between">
        <div className="text-3xs">Fee Tier</div>
        <div className="h-[26px] w-[82px] rounded-md bg-black"></div>
      </div>

      <div className="shine mt-[12px] h-[60px] w-[318px] rounded-lg"></div>

      <div className="mt-[20px] h-[212px] w-[318px] rounded-lg bg-black"></div>

      <div className="mt-[21px] flex w-[318px] flex-row justify-end">
        <div className="text-2xs underline">Hide breakdown</div>
      </div>

      <div className="mt-[15px] h-[200px] w-[318px] rounded-lg bg-black"></div>

      <div className="mt-[20px]"></div>
    </div>
  );
}
