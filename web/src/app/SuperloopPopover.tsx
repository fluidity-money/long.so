import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Cog from "@/assets/icons/cog.svg";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Menu } from "@/components";
import { useState } from "react";

/**
 * Popover which contains the Superloop settings.
 */
export const SuperloopPopover = () => {
  const [autoSlippage, setAutoSlippage] = useState(true);
  const [noTransactionDeadline, setNoTransactionDeadline] = useState(true);

  return (
    <div className="relative top-5 flex h-4 w-full flex-row items-end justify-end">
      <Popover>
        <PopoverTrigger>
          <div className="flex h-[35px] w-[35px] items-center justify-center">
            <Cog className="hover:animate-spin-once relative left-1 top-1 h-[30px] w-[30px] hover:h-[35px] hover:w-[35px]" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-black text-xs text-white">
          <div className="flex flex-col gap-2">
            <p className="iridescent-text text-base font-medium">
              💎 Superloop
            </p>
            <div className="flex flex-row gap-2">
              <Label htmlFor="superloop" className="text-xs font-normal">
                When available, aggregates liquidity sources for better price
                and gas free swaps.
              </Label>
              <Switch id="superloop" />
            </div>

            <div className="flex flex-row justify-between">
              <p>Max. slippage</p>

              <Menu id="slippage" background="dark">
                <Menu.Item
                  selected={autoSlippage}
                  onClick={() => setAutoSlippage(true)}
                  className={"mx-1 px-0 py-0"}
                >
                  Auto
                </Menu.Item>
                <Menu.Item
                  selected={!autoSlippage}
                  onClick={() => setAutoSlippage(false)}
                  className={"mx-1 px-0 py-0"}
                >
                  Custom
                </Menu.Item>
              </Menu>
            </div>

            <div className="flex flex-row justify-between">
              <p>Transaction deadline</p>

              <Menu id="transaction-deadline" background="dark">
                <Menu.Item
                  selected={noTransactionDeadline}
                  onClick={() => setNoTransactionDeadline(true)}
                  className={"mx-1 px-0 py-0"}
                >
                  Auto
                </Menu.Item>
                <Menu.Item
                  selected={!noTransactionDeadline}
                  onClick={() => setNoTransactionDeadline(false)}
                  className={"mx-1 px-0 py-0"}
                >
                  Custom
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
