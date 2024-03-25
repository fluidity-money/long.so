"use client";

import { Button } from "@/components/ui/button";
import Circles from "@/assets/icons/circles.svg";
import AllowSwapping from "@/assets/icons/allow-swapping.svg";

export default function SequencePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[234px] w-[266px] flex-col items-center rounded-lg bg-black p-2 text-white md:h-[328px] md:w-[393px]">
        <div className="flex w-full flex-row justify-end">
          <Button
            variant="secondary"
            size={"sm"}
            className="h-[26px] w-[36px] text-2xs"
          >
            Esc
          </Button>
        </div>
        <AllowSwapping className={"size-[63px] md:size-[105px]"} />
        <div className="mt-[13px] w-[173px] text-center text-sm md:mt-[39px]">
          Allow USDC <span className="hidden md:inline">to be used </span>for
          Swapping
        </div>
        <div className="mt-[22px] cursor-pointer text-3xs underline md:hidden">
          View transaction on Explorer
        </div>
        <Circles
          className={"mt-[24px] h-[5.357px] w-[36.357px] md:mt-[61px]"}
        />
      </div>
    </div>
  );
}
