"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFeatureFlagOverride } from "@/hooks/useFeatureFlagOverride";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Flag, LoaderIcon, Settings } from "lucide-react";
import { FeatureFlags, useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const featureFlagsLabels: { key: keyof FeatureFlags; label: string }[] = [
  { key: "ui show demo data", label: "UI Show Demo Data" },
  { key: "ui show manual fees", label: "UI Show Manual Fees" },
  { key: "ui show superloop", label: "UI Show Superloop" },
  { key: "ui show fee tier", label: "UI Show Fee Tier" },
  {
    key: "ui show optimising fee route",
    label: "UI Show Optimising Fee Route",
  },
  { key: "ui show single token stake", label: "UI Show Single Token Stake" },
  { key: "ui show campaign banner", label: "UI Show Campaign Banner" },
  { key: "ui show rewards claimed", label: "UI Show Rewards Claimed" },
  { key: "ui show incentives", label: "UI Show Incentives" },
  { key: "ui show stake apy", label: "UI Show Stake APY"},
  { key: "ui show my transactions", label: "UI Show My Transactions"},
  { key: "ui show trade rewards", label: "UI Show Trade Rewards"},
  { key: "ui show boost incentives", label: "UI Show Boost Incentives"},
  { key: "ui show liquidity incentives", label: "UI Show Liquidity Incentives"},
  { key: "ui show utility incentives", label: "UI Show Utility Incentives"},
  { key: "ui show live utility rewards", label: "UI Show Live Utility Rewards"},
  { key: "ui show super incentives", label: "UI Super Incentives"},
  { key: "ui show pool reward range", label: "UI Pool Reward Range"},
  { key: "ui show claim yield", label: "UI Show Claim Yield"},
  { key: "ui show earned fees apr", label: "UI Show Earned Fees Apr"},
  { key: "ui show pool filters", label: "UI Show Pool Filters"},
  { key: "ui show pools tab", label: "UI Show Pools Tab"}
];

export const FeatureFlagConfig = () => {
  const { featureFlags, setFeatureFlagOverride, override, setOverride } =
    useFeatureFlagOverride();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["featureFlags"],
    queryFn: async () => {
      const response = await fetch("https://features.long.so/features.json");
      return response.json();
    },
  });

  const showFeatureFlagsPanel =
    useFeatureFlag("ui show feature flags panel", false) ||
    process.env.NODE_ENV === "development";

  if (!showFeatureFlagsPanel) return null;

  return (
    <Popover>
      <PopoverTrigger>
        {isLoading ? <LoaderIcon className={"animate-spin"} /> : <Flag />}
      </PopoverTrigger>
      <PopoverContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"flex flex-row justify-between"}>
            <div className={"text-xs"}>Default Feature Flags</div>
            <div
              onClick={() => refetch()}
              className={"cursor-pointer text-xs underline"}
            >
              Reload
            </div>
          </div>
          <div className={"rounded-lg bg-gray-200 p-2 font-mono text-xs"}>
            {JSON.stringify(data, null, 2)}
          </div>

          <div className={"text-xs"}>Overrides</div>
          <div className={"flex flex-row items-center justify-between"}>
            <div className={"flex flex-col"}>
              <Label>Override Feature Flags</Label>
              <div className={"text-2xs"}>
                If enabled use the below overrides
              </div>
            </div>

            <Switch checked={override} onCheckedChange={setOverride} />
          </div>

          {featureFlagsLabels.map(({ key, label }) => (
            <div
              className={"flex flex-row items-center justify-between"}
              key={key}
            >
              <Label>{label}</Label>
              <Switch
                disabled={!override}
                checked={featureFlags[key]}
                onCheckedChange={(value) => setFeatureFlagOverride(key, value)}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
