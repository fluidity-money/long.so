"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFeatureFlagOverride } from "@/hooks/useFeatureFlagOverride";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { FeatureFlags } from "@/hooks/useFeatureFlag";

const featureFlagsLabels: { key: keyof FeatureFlags; label: string }[] = [
  { key: "ui show demo data", label: "UI Show Demo Data" },
  { key: "ui show manual fees", label: "UI Show Manual Fees" },
];

export const FeatureFlagConfig = () => {
  const { featureFlags, setFeatureFlagOverride, override, setOverride } =
    useFeatureFlagOverride();

  return (
    <Popover>
      <PopoverTrigger>
        <div>
          <Settings />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"flex flex-row items-center justify-between"}>
            <div className={"flex flex-col"}>
              <Label>Override Feature Flags</Label>
              <div className={"text-2xs"}>
                If enabled use the below overrides
              </div>
            </div>

            <Switch checked={override} onCheckedChange={setOverride} />
          </div>

          <div className={"text-xs"}>Feature Flags</div>

          {featureFlagsLabels.map(({ key, label }) => (
            <div
              className={"flex flex-row items-center justify-between"}
              key={key}
            >
              <Label>{label}</Label>
              <Switch
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
