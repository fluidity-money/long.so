"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Ethereum from "@/assets/icons/ethereum.svg";
import { Badge } from "@/components/ui/badge";
import Token from "@/assets/icons/token.svg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function WithdrawLiquidity() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center">
      <motion.div
        layoutId="modal"
        className="relative h-[180px] w-[317px] rounded-lg bg-black px-[18px] pt-[10px] text-white"
      >
        <motion.div className="flex flex-col">
          <div className={cn("absolute -top-[15px] left-0 flex flex-row")}>
            <Ethereum className="size-[30px] rounded-full border-[3px] border-white" />
            <Badge
              variant="outline"
              className="-ml-2 h-[30px] w-[124px] justify-between border-[3px] bg-black pl-px text-white"
            >
              <Token className="size-[25px] invert" />
              ƒUSDC - ETH
            </Badge>
          </div>

          <div className="absolute -right-16 top-0 hidden md:inline-flex">
            <Button
              size={"sm"}
              className="h-[30px] w-[48px]"
              onClick={() => router.back()}
            >
              {"<-"} Esc
            </Button>
          </div>

          <div className={"flex flex-row justify-end"}>
            <div className="text-2xs">Withdraw Liquidity</div>
          </div>

          <div className={"mt-[14px]"}>
            <div className="text-3xs">Your Liquidity Positions</div>
          </div>

          <div className={"mt-[15px] flex flex-row justify-between gap-2"}>
            <Badge variant={"outline"}>
              <div className="text-nowrap text-sm font-semibold text-white">
                ƒUSDC x ETH
              </div>
            </Badge>

            <Input
              className="border-0 bg-black text-right text-2xl font-medium"
              placeholder={"0.00375"}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
