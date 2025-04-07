"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname, useRouter } from "next/navigation";
import { InventorySheet } from "@/components/InventorySheet";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { cn } from "@/lib/utils";
import PP from "@/assets/profile-picture.png";

export const ConnectWalletButton = ({ isDark }: { isDark: boolean }) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const { isLtSm } = useMediaQuery();

  const router = useRouter();
  const pathname = usePathname();

  const { open } = useAppKit();

  if (address && !isLtSm) {
    return <InventorySheet isDark={isDark} />;
  }

  if (address && isLtSm && pathname === "/swap/inventory") {
    return (
      <div className="flex flex-row items-center justify-center gap-[10px] rounded">
        <Button size={"sm"} className={"h-6"} onClick={() => router.back()}>
          X Close
        </Button>
        <Image src={PP} alt={"profile picture"} className={"size-6 rounded"} />
      </div>
    );
  }

  if (address && isLtSm) {
    return (
      <div className="flex flex-row items-center justify-center gap-[10px] rounded">
        <div
          onClick={() => router.push("/swap/inventory")}
          className={cn(
            isDark ? "text-white" : "text-black",
            "cursor-pointer rounded p-1 text-right text-xs font-semibold text-nowrap transition-all hover:bg-black hover:text-base hover:text-white",
          )}
        >
          {ensName ? (
            ensName
          ) : (
            <>
              {address.slice(0, 5)} ... {address.slice(-3)}
            </>
          )}
        </div>
        <Image
          src={PP}
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
      className="h-6 text-sm"
      onClick={() => open()}
      id="wallet-connect-btn"
    >
      Connect Wallet
    </Button>
  );
};
