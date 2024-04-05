"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Search from "@/assets/icons/Search.svg";
import { Badge } from "@/components/ui/badge";
import IridescentToken from "@/assets/icons/token-iridescent.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AllAssetsTable } from "@/app/swap/explore/_AllAssetsTable/AllAssetsTable";
import { Asset, columns } from "@/app/swap/explore/_AllAssetsTable/columns";
import { addDays } from "date-fns";

const highestRewarders = ["fDAI", "wETH", "wBTC", "wETH2", "wBTC2"];

const allAssetsData: Asset[] = [
  {
    symbol: "fUSDC",
    address: "0x0bafe8babf38bf3ba83fb80a82",
    name: "Fluid US Dollar Coin",
    amount: 430.23,
    amountUSD: 430.23,
    boostedEndDate: addDays(new Date(), 7),
  },
  {
    symbol: "ETH",
    address: "0x0bafe8babf38bf3ba83fb80a82",
    name: "Ethereum",
    amount: 0.19,
    amountUSD: 493.23,
    boostedEndDate: addDays(new Date(), 15),
  },
  {
    symbol: "wBTC",
    address: "0x0bafe8babf38bf3ba83fb80a82",
    name: "Wrapped Bitcoin",
    amount: 0.000846,
    amountUSD: 765.22,
  },
  {
    symbol: "FRAX",
    address: "0x0bafe8babf38bf3ba83fb80a82",
    name: "Frax Coin",
    amount: 0.000846,
    amountUSD: 765.22,
  },
];

const ExplorePage = () => {
  const router = useRouter();
  return (
    <div className={"flex flex-col items-center overflow-y-auto"}>
      <motion.div
        layoutId={"modal"}
        className={
          "h-[509px] w-[325px] rounded-lg bg-black p-[10px] text-white md:h-[559px] md:w-[393px]"
        }
      >
        <div className={"flex flex-row items-center justify-between"}>
          <div className={"text-[10px] md:text-[12px]"}>Swap</div>
          <Button
            variant={"secondary"}
            size={"esc"}
            onClick={() => router.back()}
          >
            Esc
          </Button>
        </div>

        <div className={"mt-[16px] px-[10px]"}>
          <Label htmlFor={"filter"} className={"text-[10px] md:text-[12px]"}>
            Filter
          </Label>
          <div className="flex flex-row items-center border-b border-white">
            <Input
              variant="no-ring"
              className="h-8 border-0 bg-transparent text-[10px] md:text-[12px]"
              placeholder={"e.g. Ether, ARB, 0x0bafe8babf38bf3ba83fb80a82..."}
            />
            <Search className="size-4" />
          </div>

          <div className={"mt-[24px]"}>
            <div className={"text-[10px] md:text-[12px]"}>
              Highest Rewarders
            </div>

            <div
              className={
                "mt-[4px] flex h-[45px] flex-row items-center gap-[11px] overflow-x-auto md:h-[60px]"
              }
            >
              {highestRewarders.map((rewarder) => (
                <Badge
                  variant={"outline"}
                  className={"relative h-[25.36px] gap-1 pl-0.5"}
                  key={rewarder}
                >
                  <IridescentToken className={"size-[20px]"} />
                  <div className={"iridescent-text text-sm"}>{rewarder}</div>
                  <div className="iridescent absolute -bottom-2 right-0 inline-flex h-[13px] flex-col items-end justify-center rounded-sm border border-stone-900 px-[3px] py-[1.50px]">
                    <div className="text-[8px]">2 days</div>
                  </div>
                </Badge>
              ))}
            </div>
          </div>

          <div className={"mt-[26px]"}>
            <div className={"flex flex-row items-center justify-between"}>
              <div className={"text-[10px] md:text-[12px]"}>All</div>
              <div
                className={
                  "flex flex-row items-center gap-1 text-[10px] md:text-[12px]"
                }
              >
                <div className={"text-nowrap"}>Sort by</div>
                <Select defaultValue={"campaigns"}>
                  <SelectTrigger
                    className={
                      "h-auto rounded-none border-0 border-b border-dashed bg-transparent p-0 text-[10px] md:text-[12px]"
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"campaigns"}>campaigns</SelectItem>
                    <SelectItem value={"popularity"}>popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AllAssetsTable columns={columns} data={allAssetsData} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExplorePage;
