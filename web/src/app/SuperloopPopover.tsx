import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Cog from "@/assets/icons/cog.svg";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Popover which contains the Superloop settings.
 */
export const SuperloopPopover = () => {
  return (
    <div className="relative top-5 flex h-4 w-full flex-row items-end justify-end">
      <Popover>
        <PopoverTrigger>
          <div className="flex h-[35px] w-[35px] items-center justify-center">
            <Cog className="hover:animate-spin-once relative left-1 top-1 h-[30px] w-[30px] hover:h-[35px] hover:w-[35px]" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-black text-xs text-white">
          <div>
            <p className="iridescent-text text-base font-medium">
              💎 Superloop
            </p>
            <div className="flex flex-row">
              <Label htmlFor="superloop" className="text-xs font-normal">
                When available, aggregates liquidity sources for better price
                and gas free swaps.
              </Label>
              <Switch id="superloop" />
            </div>

            <div className="flex flex-row">
              <p>Max. slippage</p>
            </div>

            <div className="flex flex-row">
              <p>Transaction deadline</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
