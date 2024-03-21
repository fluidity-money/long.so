import { Button } from "@/components/ui/button";
import Ethereum from "@/assets/icons/ethereum.svg";

export default function ConfirmCreatePool() {
  return (
    <div className="z-10 flex flex-col items-center">
      <div className="w-[315px] rounded-lg bg-black text-white md:h-[673px] md:w-[393px]">
        <div className="flex flex-row items-center justify-between p-[9px]">
          <div className="p-[6px] text-3xs md:text-xs">Stake Confirmation</div>
          <Button
            size="sm"
            variant={"secondary"}
            className="h-[20px] w-[32px] text-3xs md:h-[26px] md:w-[36px] md:text-2xs"
          >
            Esc
          </Button>
        </div>

        <div className="mt-[26px] flex flex-col items-center md:mt-[30px]">
          <div className="text-3xs md:text-2xs">
            Total Deposited Amount in{" "}
            <span className="hidden md:inline-flex">
              {" "}
              <span className="font-medium underline">$USD</span>
            </span>
          </div>
          <div className="mt-[4px] text-2xl font-medium md:text-3xl">
            $1,433.35
          </div>
          <div className="mt-[4px] text-3xs font-medium text-gray-2 md:text-2xs">
            The amount is split into{" "}
            <span className="text-white underline">2 Tokens</span> below:
          </div>
        </div>

        <div className="mt-[15px] pl-[21px]">
          <div className="text-3xs font-medium md:text-2xs">ETH</div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <Ethereum className={"invert"} /> 100.1234
          </div>
          <div className="mt-0.5 text-2xs text-gray-2 md:text-xs">
            = $350.00
          </div>
        </div>

        <div className="mt-[23px] pl-[21px]">
          <div className="text-3xs font-medium md:text-2xs">ƒUSDC</div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <Ethereum className={"invert"} /> 100,230,989.00
          </div>
          <div className="mt-0.5 text-2xs text-gray-2 md:text-xs">
            = $350.00
          </div>
        </div>

        <div className="mt-[29px] px-[21px] md:mt-[37px]">
          <div className="text-3xs font-medium md:text-2xs md:font-normal">
            Projected Yield
          </div>
          <div className="mt-[13px] flex flex-col gap-[5px] px-[4px] text-2xs">
            <div className="flex flex-row justify-between">
              <div>Fees</div>
              <div>5%</div>
            </div>

            <div className="flex flex-row justify-between">
              <div>Protocol Boosts</div>
              <div>3.5%</div>
            </div>

            <div className="flex flex-row justify-between">
              <div>Super Boosts</div>
              <div>2%</div>
            </div>

            <div className="mt-[15px] flex flex-row justify-between">
              <div>APY</div>
              <div className="iridescent rounded px-1 text-black">12.09%</div>
            </div>

            <div className="flex flex-row justify-between">
              <div>Yield</div>
              <div>$247.88</div>
            </div>
          </div>
        </div>

        <div className="mt-[20px] px-[21px]">
          <div className="text-3xs">Yield Composition</div>

          <div className="mt-[20px] flex flex-row gap-1 text-2xs">
            <div className="flex w-[3%] flex-col gap-1">
              <div>3%</div>
              <div className="h-1 w-full rounded bg-white"></div>
              <div className="text-4xs md:hidden">Fees</div>
            </div>

            <div className="flex w-[7%] flex-col items-center gap-1">
              <div>7%</div>
              <div className="h-1 w-full rounded bg-white"></div>
              <div className="text-4xs md:hidden">Protocol Boosts</div>
            </div>

            <div className="flex w-[30%] flex-col items-center gap-1">
              <div>30%</div>
              <div className="h-1 w-full rounded bg-white"></div>
              <div className="text-4xs md:text-3xs">Super Boosts</div>
            </div>

            <div className="flex w-3/5 flex-col items-center gap-1">
              <div>60%</div>
              <div className="iridescent h-1 w-full rounded"></div>
              <div className="text-4xs md:text-3xs">Utility Boosts</div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col items-center p-[15px]">
          <Button variant={"secondary"} className="w-full max-w-[350px]">
            Confirm Stake
          </Button>
        </div>
      </div>
    </div>
  );
}
