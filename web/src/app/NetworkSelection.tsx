import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import SPNTest from "@/assets/icons/spn-test.svg";
import ArrowDown from "@/assets/icons/arrow-down.svg";

export const NetworkSelection = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <Badge
      variant="invert"
      className={`group absolute right-44 hidden w-28 cursor-pointer px-0.5 transition-[width] hover:w-[120px] md:inline-flex ${
        clicked ? "w-[120px] rounded-2xl" : ""
      }`}
      onClick={() => setClicked(!clicked)}
    >
      <div className={"flex-col"}>
        <div className="flex flex-row items-center">
          <div className="mr-2">
            <SPNTest height={30} width={30} />
          </div>
          <div className="text-nowrap">SPN-Test</div>
          <div
            className={`ml-2 transition-[width] group-hover:inline-flex group-hover:w-2 ${
              clicked ? "inline-flex w-2" : "hidden w-0"
            }`}
          >
            <ArrowDown width={10} height={6} />
          </div>
        </div>
        {clicked && (
          <div className="flex flex-col gap-1 p-2">
            <div>Arbitrum</div>
            <div>Ethereum</div>
            <div>Solana</div>
          </div>
        )}
      </div>
    </Badge>
  );
};