import { CampaignBanner } from "@/components/CampaignBanner";
import { MyPositions } from "@/app/stake/MyPositions";
import { YieldOverTimeGraph } from "@/app/stake/YieldOverTimeGraph";
import { AllPools } from "@/app/stake/AllPools";

const Stake = () => (
  <div className="z-10 flex flex-col items-center gap-2 px-4">
    <div className="w-full max-w-[500px]">
      <CampaignBanner />
    </div>

    <div className="flex w-full flex-row justify-center gap-8">
      <div className="flex w-full max-w-[500px] flex-1 flex-col gap-2">
        <MyPositions />
      </div>

      {/* this doesn't show on mobile */}
      <div className="hidden w-full max-w-[500px] flex-1 flex-col md:flex">
        <YieldOverTimeGraph />
      </div>
    </div>

    <AllPools />
  </div>
);

export default Stake;
