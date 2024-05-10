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
            <Label>Override Feature Flags</Label>
            <Switch checked={override} onCheckedChange={setOverride} />
          </div>

          <div className={"text-xs"}>Flags</div>

          <div className={"flex flex-row items-center justify-between"}>
            <Label>UI Show Demo Data</Label>
            <Switch
              checked={featureFlags["ui show demo data"]}
              onCheckedChange={(value) =>
                setFeatureFlagOverride("ui show demo data", value)
              }
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
