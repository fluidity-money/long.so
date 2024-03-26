"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Ethereum from "@/assets/icons/ethereum.svg";
import { Badge } from "@/components/ui/badge";
import Token from "@/assets/icons/token.svg";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Slider } from "@/components";
import ArrowDown from "@/assets/icons/arrow-down-white.svg";

export default function WithdrawLiquidity() {
  const router = useRouter();
  const params = useParams();

  const onSubmit = () => {
    router.push(`/stake/pool/${params.id}/confirm-withdraw`);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layoutId="modal"
        className="relative z-10 h-[180px] w-[317px] rounded-lg bg-black px-[18px] pt-[10px] text-white md:h-[198px] md:w-[394px]"
      >
        <motion.div className="flex flex-col" layout>
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

          <div
            className={
              "mt-[12px] flex flex-row items-center justify-between gap-2"
            }
          >
            <Badge variant={"outline"} className={"h-[27px] pl-0.5"}>
              <Token className={"size-[22px]"} />
              <div className="text-nowrap text-sm font-semibold text-white">
                ƒUSDC x ETH
              </div>
              <ArrowDown />
            </Badge>

            <Input
              className="border-0 bg-black pr-0 text-right text-2xl font-medium"
              placeholder={"0.00375"}
            />
          </div>

          <div className={"flex flex-row justify-between md:mt-[8px]"}>
            <div className={"text-2xs"}>
              Balance: 0.015{" "}
              <span className="cursor-pointer underline">Max</span>
            </div>

            <div className={"text-2xs"}>$2,498.79</div>
          </div>

          <div className="mt-[20px] md:mt-[25px]">
            <RadioGroup.Root>
              <div className="flex flex-row gap-[6px]">
                <RadioGroup.Item
                  value={"25%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3 py-2 text-[10px] font-medium data-[state=checked]:bg-white data-[state=checked]:text-black md:w-[84.75px]"
                >
                  25%
                </RadioGroup.Item>
                <RadioGroup.Item
                  value={"50%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3  py-2 text-[10px] font-medium data-[state=checked]:bg-white data-[state=checked]:text-black md:w-[84.75px]"
                >
                  50%
                </RadioGroup.Item>
                <RadioGroup.Item
                  value={"75%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3  py-2 text-[10px] font-medium data-[state=checked]:bg-white  data-[state=checked]:text-black md:w-[84.75px]"
                >
                  75%
                </RadioGroup.Item>
                <RadioGroup.Item
                  value={"100%"}
                  className="inline-flex h-7 w-[65.50px] items-center justify-center gap-2.5 rounded border px-3  py-2 text-[10px] font-medium data-[state=checked]:bg-white  data-[state=checked]:text-black md:w-[84.75px]"
                >
                  100%
                </RadioGroup.Item>
              </div>
            </RadioGroup.Root>
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-[20px] inline-flex h-7 w-[316px] items-center justify-between rounded border border-orange-300 bg-black px-3 py-[9px] md:h-[30px] md:w-[378px]">
        <div className="text-center text-[8px] font-semibold text-orange-300 md:text-[10px]">
          ⚠️ All Outstanding Rewards for this pool will be claimed upon
          Withdrawal.
        </div>
      </div>

      <div className="z-10 mt-[20px] w-[318px] md:hidden">
        <Slider onSlideComplete={onSubmit}>
          <div className="text-xs font-medium">Withdraw</div>
        </Slider>
      </div>

      <div className="z-10 mt-[20px] hidden md:inline">
        <Button className="h-[53.92px] w-[395px]" onClick={onSubmit}>
          Withdraw
        </Button>
      </div>
    </div>
  );
}
