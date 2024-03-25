"use client";

import { Button } from "@/components/ui/button";
import Circles from "@/assets/icons/circles.svg";
import Image from "next/image";
import Token from "@/assets/icons/token.svg";

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
        <Image
          src={require("../../../../assets/gifs/processing.gif")}
          alt={"processing"}
          className="size-[59px] md:size-[86px]"
        />
        <div className="mt-[13px] w-[173px] text-center text-sm md:mt-[44px]">
          Confirm Swap
        </div>
        <div className="mt-[13px] flex flex-row items-center gap-1 text-2xs md:mt-[29px]">
          <Token />
          <div>1321.67 USDC {"->"}</div>
          <Token />
          <div>0.7 ETH</div>
        </div>
        <div className="mt-[12px] cursor-pointer text-3xs underline md:hidden">
          View transaction on Explorer
        </div>
        <Circles
          className={"mt-[30px] h-[5.357px] w-[36.357px] md:mt-[40px]"}
        />
      </div>
    </div>
  );
}
