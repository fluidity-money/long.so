"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { MyPositions } from "@/app/stake/MyPositions";
import { YieldOverTimeGraph } from "@/app/stake/YieldOverTimeGraph";
import { AllPools } from "@/app/stake/AllPools";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Stake = () => {
  const [welcome, setWelcome] = useState(true);

  if (welcome) {
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

        <div className="flex flex-col items-center">
          <motion.div
            layoutId="modal"
            className="flex w-[500px] flex-col gap-4 rounded-lg bg-black p-4 text-white"
          >
            <div className="flex flex-row justify-between">
              <div className="text-xs">Earned since last login</div>
              <Button
                variant="secondary"
                onClick={() => setWelcome(false)}
                className="px-2 py-0"
              >
                {"<-"} Esc
              </Button>
            </div>

            <div>Welcome back!</div>

            <div>Since you left you've earned:</div>

            <Button
              variant="iridescent"
              className="w-full"
              onClick={() => setWelcome(false)}
            >
              Claim All Yield
            </Button>
          </motion.div>
        </div>
      </div>
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
