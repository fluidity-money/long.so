import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Cog from "@/assets/icons/cog.svg";
import Disconnect from "@/assets/icons/disconnect.svg";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDetectClickOutside } from "react-detect-click-outside";
import CopyToClipboard from "react-copy-to-clipboard";
import { Check } from "lucide-react";
import { Menu } from "@/components";

const address = "0x0000000000000000000000000000000000000000";

export const ConnectWalletButton = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const ref = useDetectClickOutside({
    onTriggered: () => setConfirmDisconnect(false),
  });

  const [copied, setCopied] = useState(false);

  const [content, setContent] = useState<"pools" | "trade">("trade");

  /**
   * When copied is set to true this will reset
   * the state after 2 seconds
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  if (isConnected) {
    return (
      <Sheet>
        <div className="flex flex-row items-center justify-center gap-[10px] rounded">
          <SheetTrigger asChild>
            <div className="cursor-pointer text-nowrap rounded p-1 text-right text-xs font-semibold text-black transition-all hover:bg-black hover:text-base hover:text-white">
              {address.slice(0, 5)} ... {address.slice(-3)}
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

              <div className="inline-flex h-4 items-center justify-start gap-2.5 rounded-[3px] bg-gray-200 px-1 py-0.5">
                <div className="flex items-center justify-end gap-1">
                  <CopyToClipboard
                    text={address}
                    onCopy={() => setCopied(true)}
                  >
                    {copied ? (
                      <Check className="h-[8.54px] w-2" />
                    ) : (
                      <div className="relative h-[8.54px] w-2">
                        <div className="absolute left-0 top-0 h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900" />
                        <div className="absolute left-[2.10px] top-[2px] h-[6.54px] w-[5.90px] rounded-[0.73px] border border-stone-900 bg-gray-200" />
                      </div>
                    )}
                  </CopyToClipboard>

                  <div className="text-[10px] font-medium text-stone-900">
                    {address.slice(0, 5)} ... {address.slice(-3)}
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

          <div className="mt-[34px] flex flex-col items-center">
            <Menu id="sidebar-content" background="dark" className="gap-1">
              <Menu.Item
                className={"p-1 text-white"}
                selected={content === "trade"}
                onClick={() => setContent("trade")}
              >
                <div className="text-xs">Trades</div>
              </Menu.Item>
              <Menu.Item
                className={"p-1 text-white"}
                selected={content === "pools"}
                onClick={() => setContent("pools")}
              >
                <div className="text-xs">Pools</div>
              </Menu.Item>
            </Menu>
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
