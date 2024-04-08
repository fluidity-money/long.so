import Image from "next/image";
import Cog from "@/assets/icons/cog.svg";
import { DisconnectButton } from "@/components/InventoryContent/DisconnectButton";
import { Address } from "@/components/InventoryContent/Address";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInventorySettings } from "@/components/InventoryContent/useInventorySettings";

export const InventoryHeader = () => {
  const { settings, setSettings } = useInventorySettings();
  
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-1">
        <Image
          src={require("@/assets/profile-picture.png")}
          alt={"profile picture"}
          className={"size-[18px] rounded border border-white"}
        />

        <Address />
      </div>

      <div className="flex flex-row items-center gap-[20px]">
        <Badge
          variant="secondary"
          className={cn(
            "size-[25px] cursor-pointer items-center gap-1 px-1 transition-all",
            {
              "bg-transparent": !settings,
              "w-[80px] ": settings,
            },
          )}
          onClick={() => setSettings(!settings)}
        >
          <Cog
            className={cn("size-[15px]", {
              invert: settings,
            })}
          />
          {settings && "Settings"}
        </Badge>
        <DisconnectButton />
      </div>
    </div>
  );
};
