"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Ethereum from "@/assets/icons/ethereum.svg";
import ArrowDown from "@/assets/icons/arrow-down-white.svg";
import Padlock from "@/assets/icons/padlock.svg";
import Token from "@/assets/icons/token.svg";
import { Menu } from "@/components";
import { useState } from "react";

export default function CreatePoolPage() {
  const [feeTier, setFeeTier] = useState<"auto" | "manual">("auto");

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-[400px]">
        <CampaignBanner />
      </div>

      <div className="mt-[12px] flex flex-col gap-[5px] md:mt-[23px] md:gap-[7px]">
        <motion.div
          layoutId={"modal"}
          className="relative flex h-[102px] w-[318px] flex-col justify-between rounded-lg bg-black p-[17px] text-white md:h-[150px] md:w-[392px] md:p-[25px]"
        >
          <div className="absolute -top-[15px] left-0 hidden  md:flex">
            <Ethereum className="size-[30px] rounded-full border-[3px] border-white" />
            <Badge
              variant="outline"
              className="-ml-2 h-[30px] w-[124px] justify-between border-[3px] bg-black pl-px text-white"
            >
              <Token className="size-[25px] invert" />
              ƒUSDC - ETH
            </Badge>
          </div>
          <div className="flex w-full flex-row items-center justify-between md:mt-[10px]">
            <div className="text-3xs md:hidden">Prime Asset</div>
            <div className="hidden text-2xs md:flex">Swap</div>

            <div className="text-3xs md:text-2xs">Ethereum</div>
          </div>

          <div className="mt-[7px] flex w-full flex-row items-center justify-between">
            <div className="text-2xl">1024.82</div>

            <Badge
              variant="outline"
              className="flex h-[26px] w-[82px] flex-row justify-between pl-0.5 pr-1 text-white md:h-[33px] md:w-[90px] md:pl-[4px] md:text-base"
            >
              <Ethereum className="size-[20px] invert md:size-[25px]" />
              <div>ETH</div>
              <ArrowDown className="h-[5.22px] w-[9.19px] md:h-[6.46px] md:w-[11.38px]" />
            </Badge>
          </div>

          <div className="mt-[5px] flex w-full flex-row items-center justify-between">
            <div className="text-2xs md:text-gray-1">$1,025.23</div>

            <div className="flex flex-row gap-[8px] text-3xs md:text-2xs">
              <div>Balance: 1231.01</div>
              <div className="underline">Max</div>
            </div>
          </div>
        </motion.div>

        <div className="flex h-[102px] w-[318px] flex-col justify-between rounded-lg bg-black p-[17px] text-white md:h-[126px] md:w-[392px] md:p-[25px]">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="text-3xs md:hidden">Super Asset</div>
            <div className="hidden text-2xs md:flex">Receive</div>

            <div className="text-3xs md:text-2xs">Fluid USDC</div>
          </div>

          <div className="mt-[7px] flex w-full flex-row items-center justify-between">
            <div className="text-2xl">0.87</div>

            <Badge
              variant="outline"
              className="flex h-[26px] w-[82px] flex-row justify-between pl-0.5 pr-1 text-white md:h-[33px] md:w-[107px] md:pl-[4px] md:text-base"
            >
              <Ethereum className="size-[20px] invert md:size-[25px]" />
              <div className="iridescent-text">ƒUSDC</div>
              <Padlock className="ml-[2px] h-[7.53px] w-[6.45px] md:h-[10.3px] md:w-[8.82px]" />
            </Badge>
          </div>

          <div className="mt-[5px] flex w-full flex-row items-center justify-between">
            <div className="text-2xs md:text-gray-1">$1,024.82</div>

            <div className="text-3xs md:text-2xs">Balance: 0.5</div>
          </div>
        </div>
      </div>

      <div className="mt-[12px] flex w-[318px] flex-row items-center justify-between md:w-[392px]">
        <div className="text-3xs md:text-2xs">Fee Tier</div>

        <Menu
          id={"fee-tier"}
          background="dark"
          className={
            "flex h-[26px] w-[82px] flex-row items-center justify-center gap-0 rounded-md bg-black"
          }
        >
          <Menu.Item
            selected={feeTier === "auto"}
            onClick={() => setFeeTier("auto")}
            className={"h-[18px] w-[33px] text-white"}
          >
            <div className={"text-2xs"}>Auto</div>
          </Menu.Item>
          <Menu.Item
            selected={feeTier === "manual"}
            onClick={() => setFeeTier("manual")}
            className={"h-[18px] w-[40px] text-white"}
          >
            <div className={"text-2xs"}>Manual</div>
          </Menu.Item>
        </Menu>
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

        <div className="iridescent-text w-[200px] text-3xs md:w-[247px] md:text-2xs">
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
