"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SequencePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="absolute hidden h-[354px] w-[426px] bg-green-200 mix-blend-darken blur-[163px] md:inline" />

      <div className="z-10 flex h-[248.914px] w-[266px] flex-col items-center rounded-lg bg-black p-2 text-white md:h-[328px] md:w-[393px]">
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
          src={require("../../../../assets/gifs/success.gif")}
          alt={"unlock"}
          className={"mt-[20px] size-[59px] md:mt-[64px]"}
        />
        <div className="mt-[9px] w-[155px] text-center text-sm md:mt-[7px]">
          Success!
        </div>
        <div className={"mt-[13px] text-2xs text-gray-2 md:hidden"}>
          Succesfully Swapped USDC {"->"} ETH
        </div>
        <div className="mt-[12px] cursor-pointer text-3xs underline md:mt-[26px]">
          View transaction on Explorer
        </div>
        <div className="w-full md:p-2">
          <Button
            variant={"secondary"}
            className="mt-[18px] h-[29px] w-full md:mt-[42px] md:h-[35px]"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
