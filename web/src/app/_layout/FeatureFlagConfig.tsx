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
  { key: "ui show feature flags panel", label: "UI Show Feature Flags Panel" },
  { key: "ui show superloop", label: "UI Show Superloop" },
  { key: "ui show fee tier", label: "UI Show Fee Tier" },
  { key: "ui show optimising fee route", label: "UI Show Optimising Fee Route" },
  { key: "ui show single token stake", label: "UI Show Single Token Stake" },
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

  const showFeatureFlagsPanel = useFeatureFlag("ui show feature flags panel");

  if (!(showFeatureFlagsPanel || process.env.NODE_ENV === "development"))
    return null;

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
