"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SwapPro } from "@/app/SwapPro";
import { useHotkeys } from "react-hotkeys-hook";
import { Token } from "@/components";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function PoolPage() {
  const router = useRouter();

  useHotkeys("esc", () => router.back());

  return (
    <div className="flex w-full flex-col">
      <div className="flex max-w-full flex-col-reverse justify-center gap-8 lg:flex-row">
        <SwapPro override badgeTitle />

        <div className="flex flex-col items-center">
          <div className="z-10 flex flex-col">
            <motion.div
              layoutId="modal"
              className="flex w-[500px] flex-col gap-4 rounded-lg bg-black p-2 pt-0 text-white"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="p-4 text-xs">Manage Pool</div>
                <Button
                  variant="secondary"
                  className="h-8 px-2 text-xs"
                  onClick={() => {
                    router.back();
                  }}
                >
                  {"<-"} Esc
                </Button>
              </div>

              <div className="flex flex-row justify-between px-4">
                <div className="flex flex-row items-center">
                  <Token />
                  <Badge className="iridescent z-20 -ml-2 flex flex-row gap-2 border-4 border-black pl-1 text-black">
                    <Token />
                    <div className="text-xl">fUSDC-ETH</div>
                  </Badge>
                </div>

                <div className="flex flex-col items-end">
                  <Badge className="iridescent z-20 flex h-8 flex-row gap-2 border-4 border-black pl-1 text-black">
                    <div className="flex flex-row">
                      <Token size="small" />
                      <Token size="small" />
                      <Token size="small" />
                    </div>
                    <div className="text-nowrap text-xs">
                      Live Utility Rewards
                    </div>
                  </Badge>

                  <p className="text-2xs">5days | 24hrs | 30min</p>
                </div>
              </div>

              <div className="flex flex-col gap-8 p-4">
                <div className="flex flex-row gap-2">
                  <Button
                    variant="secondary"
                    className="text-2xs flex-1"
                    size="sm"
                  >
                    + Add Liquidity
                  </Button>
                  <Button
                    variant="secondary"
                    className="text-2xs flex-1"
                    size="sm"
                  >
                    - Withdraw Liquidity
                  </Button>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <div className="text-xs">My Pool Balance</div>
                    <div className="text-2xl">$190,3013</div>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="text-xs">Unclaimed Rewards</div>
                    <div className="text-2xl">$52,420</div>
                  </div>

                  <div>
                    <Button
                      variant="secondary"
                      className="h-8 px-8 py-0.5"
                      size="sm"
                    >
                      <div className="text-2xs">Claim Yield</div>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
