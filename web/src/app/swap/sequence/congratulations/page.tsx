"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import TokenIridescent from "@/assets/icons/iridescent-token.svg";
import Token from "@/assets/icons/token.svg";
import { Badge } from "@/components/ui/badge";

export default function SequencePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="z-10 flex h-[388px] w-[315px] flex-col items-center rounded-lg bg-black p-2 text-white md:h-[420px] md:w-[393px]">
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
          src={require("../../../../assets/gifs/congratulations.gif")}
          alt={"unlock"}
          className={"mt-[3px] size-[40px] md:mt-[6.3px]"}
        />

        <div className="mt-[4px] text-center text-sm">Congratulations!</div>

        <div className={"mt-[9px] text-2xs text-gray-2"}>
          Successful Transaction with rewards:
        </div>

        <div className="mt-[12px] flex flex-row items-center">
          <TokenIridescent className={"size-[28px]"} />
          <TokenIridescent className={"-ml-3 size-[28px]"} />
          <TokenIridescent className={"-ml-3 size-[28px]"} />
          <TokenIridescent className={"-ml-3 size-[28px]"} />
          <div className="iridescent-text text-2xl">$1321.58</div>
        </div>

        <div className="mt-[21px] h-[115px] w-[270px] rounded-lg border border-white border-opacity-70 bg-stone-900 p-[13px] md:h-[130px] md:w-[348px]">
          <div className="text-2xs">Rewards Breakdown:</div>
          <div className="mt-[11px] flex flex-col gap-[3.25px] text-3xs md:gap-[5px] md:text-2xs">
            <div className="flex flex-row justify-between">
              <div>Fluid Rewards</div>
              <div className={"flex flex-row items-center gap-1"}>
                <Token />
                $0 - $21.72
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div>Super Rewards</div>
              <div className={"flex flex-row items-center gap-1"}>
                <div className={"flex flex-row"}>
                  <Token />
                  <Token className={"-ml-1"} />
                </div>
                $0.20 - $13.06
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div>Trader Rewards</div>
              <div className={"flex flex-row items-center gap-1"}>
                <Token />
                $5.91 - $8.34
              </div>
            </div>
          </div>
          <div
            className={
              "mt-[12px] flex flex-row justify-between text-3xs md:text-2xs"
            }
          >
            <div className={"font-semibold"}>Total</div>
            <div>
              <Badge variant="invert" className="p-0 px-1 text-3xs md:text-2xs">
                <div className={"flex flex-row"}>
                  <Token />
                  <Token className={"-ml-1"} />
                  <Token className={"-ml-1"} />
                  <Token className={"-ml-1"} />
                </div>
                $6.11 - $33.12
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-[16px] cursor-pointer text-3xs underline md:mt-[16px]">
          View transaction on Explorer
        </div>

        <div className="w-full md:p-2">
          <Button
            variant={"secondary"}
            className="mt-[16px] h-[29px] w-full md:mt-[16px] md:h-[35px]"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
