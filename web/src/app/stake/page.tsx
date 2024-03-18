"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { MyPositions } from "@/app/stake/MyPositions";
import { YieldOverTimeGraph } from "@/app/stake/YieldOverTimeGraph";
import { AllPools } from "@/app/stake/AllPools";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useHotkeys } from "react-hotkeys-hook";
import ProfilePicture from "@/assets/icons/profile-picture.svg";
import IridescentToken from "@/assets/icons/iridescent-token.svg";
import Token from "@/assets/icons/token.svg";
import { Badge } from "@/components/ui/badge";

const Stake = () => {
  const [welcome, setWelcome] = useState(true);

  useHotkeys(
    "esc",
    () => {
      setWelcome(false);
    },
    [setWelcome],
  );

  if (welcome) {
    return (
      <AlertDialog.Root open={welcome}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-30 bg-black/80 md:bg-black/50" />
          <AlertDialog.Content className="z-50 ">
            <div className="flex flex-col items-center gap-2 px-4">
              <motion.div
                className="w-full max-w-[394px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CampaignBanner />
              </motion.div>
              <div className="flex flex-col items-center">
                <motion.div
                  layoutId="modal"
                  className="flex h-[366px] w-[394px] flex-col items-center justify-between rounded-lg bg-black p-[10px] text-white drop-shadow-white"
                >
                  <div className="flex w-full flex-row justify-between p-[4px]">
                    <div className="text-3xs md:text-2xs">
                      Earned since last login
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setWelcome(false)}
                      className="h-[26px] px-2 py-0 text-2xs"
                      size={"sm"}
                    >
                      Esc
                    </Button>
                  </div>

                  <div className="flex flex-col items-center gap-[8px]">
                    <ProfilePicture className={"size-[39px]"} />

                    <div className="md: w-full text-center text-2xs md:text-sm">
                      Welcome back!
                    </div>
                  </div>

                  <div className="mt-2 w-full pl-4 text-2xs md:text-xs">
                    {"Since you left you've earned:"}
                  </div>

                  <div className="flex w-full flex-col gap-1 px-4 pl-8">
                    <div className="flex flex-row justify-between text-3xs md:text-2xs">
                      <div>Pool Fees</div>

                      <div className="flex flex-row items-center gap-1">
                        <IridescentToken className="size-4" />
                        <div>$21.72</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between text-3xs md:text-2xs">
                      <div>Liquidity Boosts</div>

                      <div className="flex flex-row items-center gap-1">
                        <div className="flex flex-row">
                          <IridescentToken className="size-4" />
                          <IridescentToken className="-ml-2 size-4" />
                        </div>
                        <div>$13.06</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between text-3xs md:text-2xs">
                      <div>Super Boosts</div>
                      <div className="flex flex-row items-center gap-1">
                        <IridescentToken className="size-4" />
                        <div>$8.34</div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between text-3xs md:text-2xs">
                      <div>Utility Boosts</div>
                      <div className="flex flex-row items-center gap-1">
                        <IridescentToken className="size-4" />
                        <div>$2.99</div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-row justify-between text-3xs font-semibold md:text-2xs">
                      <div>Total</div>
                      <Badge
                        variant="iridescent"
                        className="flex h-4 flex-row p-1 pl-0 text-3xs md:text-2xs"
                      >
                        <Token className="size-4" />
                        <Token className="-ml-2 size-4" />
                        <Token className="-ml-2 size-4" />
                        <Token className="-ml-2 size-4" />
                        $41.12
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 flex w-full flex-col items-center">
                    <Button
                      variant="iridescent"
                      className="h-[37px] w-full "
                      onClick={() => setWelcome(false)}
                    >
                      Claim All Yield
                    </Button>
                    <div className="mt-[-10px]">
                      <Badge
                        className="h-4 border-2 border-black p-1 pl-0.5 text-3xs"
                        variant="iridescent"
                      >
                        <IridescentToken />
                        <IridescentToken />
                        $920.12
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  }

  return (
    <div className="z-10 flex flex-col items-center gap-2 px-4">
      <motion.div
        className="w-full max-w-[500px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <CampaignBanner />
      </motion.div>

      <div className="flex w-full flex-row justify-center gap-8">
        <div className="flex w-full max-w-[500px] flex-1 flex-col gap-2">
          <MyPositions />
        </div>

        {/* this doesn't show on mobile */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="hidden w-full max-w-[500px] flex-1 flex-col md:flex"
        >
          <YieldOverTimeGraph />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="flex w-full flex-col"
      >
        <AllPools />
      </motion.div>
    </div>
  );
};

export default Stake;
