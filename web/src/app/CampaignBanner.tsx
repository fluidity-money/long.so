import Hourglass from "@/assets/icons/hourglass.svg";
import { usdFormat } from "@/lib/usdFormat";
import { differenceInSeconds, endOfDay } from "date-fns";
import { useEffect, useState } from "react";

interface CampaignBannerProps {
  amount?: number;
  currency?: string;
  countdownDate?: Date;
}

function calculateCountdown(date: Date, short = false) {
  const now = new Date();
  const secondsRemaining = differenceInSeconds(date, now);

  // Calculate days, hours, minutes
  const days = Math.floor(secondsRemaining / (24 * 60 * 60));
  const hours = Math.floor((secondsRemaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);

  return `${days}d : ${hours}h${short ? "" : ` : ${minutes}m`}`;
}

/**
 * @description - A banner that displays the amount of rewards available, the currency, and a countdown to the end of the campaign
 * @param amount - the amount of rewards available
 * @param currency - the currency of the rewards
 * @param countdownDate - the date the campaign ends
 */
export const CampaignBanner = ({
  amount = 29123,
  currency = "USDC",
  countdownDate = endOfDay(new Date()),
}: CampaignBannerProps) => {
  const [countdownLong, setCountdownLong] = useState("");
  const [countdownShort, setCountdownShort] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdownLong(calculateCountdown(countdownDate));
      setCountdownShort(calculateCountdown(countdownDate, true));
    }, 1000); // Update every second

    // Cleanup function for when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row">
        {/*<Token size="small" />*/}
        <div className="text-xs">
          {usdFormat(amount)} in{" "}
          <span className="font-medium">{currency} Rewards</span> available.
        </div>
      </div>

      <div className="cursor-pointer text-nowrap text-xs">
        <span className="underline">View all</span>
        {" ->"}
      </div>

      <div className="flex flex-row items-center gap-1 rounded bg-black px-1 text-xs text-white">
        <Hourglass width={15} height={20} />
        <div className="hidden text-nowrap sm:inline-flex">{countdownLong}</div>
        <div className="inline-flex text-nowrap sm:hidden">
          {countdownShort}
        </div>
      </div>
    </div>
  );
};
