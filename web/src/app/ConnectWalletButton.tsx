import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { InventoryContent } from "@/components/InventoryContent";
import { useConnectionStore } from "@/stores/useConnectionStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";

const address = "0x0000000000000000000000000000000000000000";

export const ConnectWalletButton = () => {
  const { isConnected, setIsConnected } = useConnectionStore();

  const { isLtSm } = useMediaQuery();

  const router = useRouter();

  if (isConnected && !isLtSm) {
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

        <SheetContent className="my-2 max-h-screen overflow-y-scroll rounded-lg border-0 bg-black text-white">
          <InventoryContent />
        </SheetContent>
      </Sheet>
    );
  }

  if (isConnected && isLtSm) {
    return (
      <div className="flex flex-row items-center justify-center gap-[10px] rounded">
        <div
          onClick={() => router.push("/swap/inventory")}
          className="cursor-pointer text-nowrap rounded p-1 text-right text-xs font-semibold text-black transition-all hover:bg-black hover:text-base hover:text-white"
        >
          {address.slice(0, 5)} ... {address.slice(-3)}
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
      className="mb-1 h-[26px] text-sm"
      onClick={() => setIsConnected(true)}
    >
      Connect Wallet
    </Button>
  );
};
