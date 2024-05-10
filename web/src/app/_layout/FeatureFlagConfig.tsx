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
import { FeatureFlags } from "@/hooks/useFeatureFlag";
import { useQuery } from "@tanstack/react-query";
import ReactJson from "react-json-view";

const featureFlagsLabels: { key: keyof FeatureFlags; label: string }[] = [
  { key: "ui show demo data", label: "UI Show Demo Data" },
  { key: "ui show manual fees", label: "UI Show Manual Fees" },
];

export const FeatureFlagConfig = () => {
  const { featureFlags, setFeatureFlagOverride, override, setOverride } =
    useFeatureFlagOverride();

  const { data, isLoading } = useQuery({
    queryKey: ["featureFlags"],
    queryFn: async () => {
      const response = await fetch("https://features.long.so/features.json");
      return response.json();
    },
  });

  return (
    <Popover>
      <PopoverTrigger>
        {isLoading ? <LoaderIcon className={"animate-spin"} /> : <Flag />}
      </PopoverTrigger>
      <PopoverContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"text-xs"}>Default Feature Flags</div>
          <ReactJson src={data} />

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
