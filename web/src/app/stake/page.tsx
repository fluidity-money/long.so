"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { MyPositions } from "@/app/stake/MyPositions";
import { YieldOverTimeGraph } from "@/app/stake/YieldOverTimeGraph";
import { AllPools } from "@/app/stake/AllPools";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useStakeWelcomeBackStore } from "@/stores/useStakeWelcomeBackStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WelcomeModal } from "@/app/stake/WelcomeModal";
import { YieldBreakdownModal } from "@/app/stake/YieldBreakdownModal";
import { YieldBreakdownClaimedModal } from "@/app/stake/YieldBreakdownClaimedModal";
import { YieldBreakdownDrawer } from "@/app/stake/YieldBreakdownDrawer";
import { YieldBreakdownClaimedDrawer } from "@/app/stake/YieldBreakdownClaimedDrawer";

const Stake = () => {
  const {
    welcome,
    setWelcome,
    yieldBreakdown,
    yieldBreakdownClaimed,
    setYieldBreakdownClaimed,
  } = useStakeWelcomeBackStore();

  useHotkeys(
    "esc",
    () => {
      setWelcome(false);
    },
    [setWelcome],
  );

  const { isLtSm } = useMediaQuery();

  if (welcome) {
    return <WelcomeModal />;
  }

  if (yieldBreakdown && !isLtSm) {
    return <YieldBreakdownModal />;
  }

  if (yieldBreakdownClaimed && !isLtSm) {
    return <YieldBreakdownClaimedModal />;
  }

  return (
    <>
      <YieldBreakdownDrawer />
      <YieldBreakdownClaimedDrawer />

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
    </>
  );
};

export default Stake;
