import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Cog from "@/assets/icons/cog.svg";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import SegmentedControl from "@/components/ui/segmented-control";

/**
 * Popover which contains the Superloop settings.
 */
export const SuperloopPopover = () => {
  const [autoSlippage, setAutoSlippage] = useState(true);
  const [noTransactionDeadline, setNoTransactionDeadline] = useState(true);

  return (
    <Popover>
      <PopoverTrigger
        aria-label="open settings"
        className={"absolute -top-3 right-0"}
      >
        <div className="flex items-center justify-center rounded-full bg-black p-[4px]">
          <Cog className="relative size-[18px] hover:size-[25px] hover:animate-spin-once" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-black text-xs text-white">
        <div className="flex flex-col gap-2">
          <p className="iridescent-text text-base font-medium">💎 Superloop</p>
          <div className="flex flex-row gap-2">
            <Label htmlFor="superloop" className="text-xs font-normal">
              When available, aggregates liquidity sources for better price and
              gas free swaps.
            </Label>
            <Switch id="superloop" />
          </div>

          <div className="flex flex-row justify-between">
            <p>Max. slippage</p>

            <SegmentedControl
              variant={"secondary"}
              segments={[
                { label: "Auto", value: "auto" as const, ref: useRef() },
                { label: "Custom", value: "custom" as const, ref: useRef() },
              ]}
              callback={(val) => setAutoSlippage(val === "auto")}
            />
          </div>

          <div className="flex flex-row justify-between">
            <p>Transaction deadline</p>

            <SegmentedControl
              variant={"secondary"}
              segments={[
                { label: "Auto", value: "auto" as const, ref: useRef() },
                { label: "Custom", value: "custom" as const, ref: useRef() },
              ]}
              callback={(val) => setNoTransactionDeadline(val === "auto")}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
