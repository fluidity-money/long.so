"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFeatureFlagOverride } from "@/hooks/useFeatureFlagOverride";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Flag, LoaderIcon } from "lucide-react";
import { FeatureFlags, useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type FeatureFlagKey = Exclude<keyof FeatureFlags, `graphql${string}`>;

const featureFlagsLabels: { [K in FeatureFlagKey]: string } = {
  "ui show demo data": "UI Show Demo Data",
  "ui show manual fees": "UI Show Manual Fees",
  "ui show feature flags panel": "UI Show Feature Flags Panel",
  "ui show superloop": "UI Show Superloop",
  "ui show fee tier": "UI Show Fee Tier",
  "ui show optimising fee route": "UI Show Optimising Fee Route",
  "ui show single token stake": "UI Show Single Token Stake",
  "ui show campaign banner": "UI Show Campaign Banner",
  "ui show rewards claimed": "UI Show Rewards Claimed",
  "ui show incentives": "UI Show Incentives",
  "ui show stake apr": "UI Show Stake APR",
  "ui show my transactions": "UI Show My Transactions",
  "ui show trade rewards": "UI Show Trade Rewards",
  "ui show boost incentives": "UI Show Boost Incentives",
  "ui show liquidity incentives": "UI Show Liquidity Incentives",
  "ui show utility incentives": "UI Show Utility Incentives",
  "ui show live utility rewards": "UI Show Live Utility Rewards",
  "ui show super incentives": "UI Super Incentives",
  "ui show pool reward range": "UI Pool Reward Range",
  "ui show claim yield": "UI Show Claim Yield",
  "ui show claim all yield": "UI Show Claim All Yield",
  "ui show yield over time": "UI Show Yield Over Time",
  "ui show earned fees apr": "UI Show Earned Fees Apr",
  "ui show pool filters": "UI Show Pool Filters",
  "ui show pools tab": "UI Show Pools Tab",
  "ui show swap breakdown": "UI Show Swap Breakdown",
  "ui show tokens given out": "UI Show Tokens Given Out",
  "ui show liquidity visualiser": "UI Show Liquidity Visualiser",
  "ui show banners": "UI Show Banner",
  "ui show leo": "UI Show Leo",
  "ui show pool apr": "UI Show Pool APR",
  "ui is mainnet enabled": "UI Is Mainnet Enabled",
};

export const FeatureFlagConfig = ({ isDark }: { isDark: boolean }) => {
  const { featureFlags, setFeatureFlagOverride, override, setOverride, reset } =
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
      <PopoverTrigger className={cn(isDark && "text-white")}>
        {isLoading ? (
          <LoaderIcon className={"size-6 animate-spin"} />
        ) : (
          <Flag className="size-6" />
        )}
      </PopoverTrigger>
      <PopoverContent>
        <div
          className={
            "no-scrollbar flex max-h-[calc(100vh-64.5px-4rem)] flex-col gap-2 overflow-y-scroll"
          }
        >
          <div className={"flex flex-row justify-between"}>
            <div className={"text-xs"}>Default Feature Flags</div>
            <div className={"flex flex-row justify-end gap-1"}>
              <button onClick={() => refetch()} className={"text-xs underline"}>
                Reload
              </button>
              <button onClick={() => reset()} className={"text-xs underline"}>
                Reset
              </button>
            </div>
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
          {(
            Object.entries(featureFlagsLabels) as [FeatureFlagKey, string][]
          ).map(([key, label]) => (
            <div
              className={"flex flex-row items-center justify-between"}
              key={key}
            >
              <Label>{label}</Label>
              <Switch
                className={cn(
                  featureFlags[key] !== undefined && "!bg-destructive",
                )}
                disabled={!override}
                checked={featureFlags[key] ?? data?.[key]}
                onCheckedChange={(value) => setFeatureFlagOverride(key, value)}
              />
            </div>
          ))}
          <div className={"rounded-lg bg-gray-200 p-2 font-mono text-xs"}>
            {JSON.stringify(data, null, 2)}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
