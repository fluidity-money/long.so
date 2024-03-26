import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Cog from "@/assets/icons/cog.svg";
import Disconnect from "@/assets/icons/disconnect.svg";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDetectClickOutside } from "react-detect-click-outside";

export const ConnectWalletButton = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const ref = useDetectClickOutside({
    onTriggered: () => setConfirmDisconnect(false),
  });

  if (isConnected) {
    return (
      <Sheet>
        <div className="flex flex-row items-center justify-center gap-[10px] rounded">
          <SheetTrigger asChild>
            <div className="cursor-pointer text-nowrap rounded p-1 text-right text-xs font-semibold text-black transition-all hover:bg-black hover:text-base hover:text-white">
              0x13s ... c4t
            </div>
          </SheetTrigger>
          <Image
            src={require("@/assets/profile-picture.png")}
            alt={"profile picture"}
            className={"size-[28px] rounded"}
          />
        </div>

        <SheetContent className="my-2 rounded-lg border-0 bg-black">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-1">
              <Image
                src={require("@/assets/profile-picture.png")}
                alt={"profile picture"}
                className={"size-[18px] rounded border border-gray-200"}
              />

              <div className="inline-flex h-4 w-20 items-center justify-start gap-2.5 rounded-[3px] bg-gray-200 px-1 py-0.5">
                <div className="flex items-center justify-end gap-1">
                  <div className="relative h-[8.54px] w-2">
                    <div className="absolute left-0 top-0 h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900" />
                    <div className="absolute left-[2.10px] top-[2px] h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900 bg-gray-200" />
                  </div>
                  <div className="text-[10px] font-medium text-stone-900">
                    0x13s ... c4t
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center gap-[20px]">
              <Cog />
              <Badge
                ref={ref}
                variant="secondary"
                className={cn(
                  "w-[20px] cursor-pointer items-center gap-1 px-0.5 transition-all",
                  {
                    "bg-transparent": !confirmDisconnect,
                    "w-[95px] ": confirmDisconnect,
                  },
                )}
                onClick={() => {
                  if (confirmDisconnect) {
                    setIsConnected(false);
                  } else {
                    setConfirmDisconnect(true);
                  }
                }}
              >
                <Disconnect
                  className={cn("size-[15px]", {
                    invert: confirmDisconnect,
                  })}
                />
                {confirmDisconnect && "Disconnect"}
              </Badge>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Button
      size="sm"
      color="light"
      className="mb-1 h-[26px] text-sm"
      onClick={() => setIsConnected(true)}
    >
      Connect Wallet
    </Button>
  );
};
