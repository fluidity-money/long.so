import Image from "next/image";
import Cog from "@/assets/icons/cog.svg";
import { DisconnectButton } from "@/components/InventoryContent/DisconnectButton";
import { Address } from "@/components/InventoryContent/Address";

export const InventoryHeader = () => {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-1">
        <Image
          src={require("@/assets/profile-picture.png")}
          alt={"profile picture"}
          className={"size-[18px] rounded border border-gray-200"}
        />

        <div className="h-4 rounded-[3px] bg-gray-200 px-1 py-0.5">
          <Address />
        </div>
      </div>

      <div className="flex flex-row items-center gap-[20px]">
        <Cog />
        <DisconnectButton />
      </div>
    </div>
  );
};
