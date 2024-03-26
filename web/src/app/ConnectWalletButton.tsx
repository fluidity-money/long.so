import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

export const ConnectWalletButton = () => {
  const [isConnected, setIsConnected] = useState(false);

  if (isConnected) {
    return (
      <div className="flex flex-row items-center justify-center gap-[10px] rounded">
        <div className="text-nowrap rounded p-1 text-right text-xs font-semibold text-black transition-all hover:bg-black hover:text-base hover:text-white">
          0x13s ... c4t
        </div>
        <Image
          src={require("@/assets/profile-picture.png")}
          alt={"profile picture"}
          className={"size-[28px] rounded"}
        />
      </div>
    );
  }

  return (
    <Button
      size="sm"
      color="light"
      className="h-[26px] text-sm"
      onClick={() => setIsConnected(true)}
    >
      Connect Wallet
    </Button>
  );
};
