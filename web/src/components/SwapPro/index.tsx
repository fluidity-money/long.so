"use client";

import { useSwapPro } from "@/stores/useSwapPro";
import { TypographyH3 } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Token from "@/assets/icons/token.svg";
import Ethereum from "@/assets/icons/ethereum.svg";
import { useWelcomeStore } from "@/stores/useWelcomeStore";
import { cn } from "@/lib/utils";
import { Graph } from "@/components/SwapPro/SwapProGraph";
import { useSwapStore } from "@/stores/useSwapStore";
import { columns, Transaction } from "@/app/_DataTable/columns";
import { DataTable } from "@/app/_DataTable/DataTable";

const variants = {
  hidden: { opacity: 0, width: 0 },
  visible: { opacity: 1, width: "auto" },
};

export const SwapPro = ({
  override,
  badgeTitle,
}: {
  override?: boolean;
  badgeTitle?: boolean;
}) => {
  const swapPro = useSwapPro((s) => s.swapPro);
  const welcome = useWelcomeStore((s) => s.welcome);

  const { isLtSm } = useMediaQuery();

  const { token0, token1 } = useSwapStore();

  const isOpen = !welcome && (swapPro || override || isLtSm);

  return (
    <motion.div
      initial={"hidden"}
      variants={variants}
      animate={isOpen ? "visible" : "hidden"}
      className={cn("z-10 flex flex-col items-center justify-center", {
        hidden: !isOpen,
      })}
      transition={{
        type: "spring",
        bounce: 0.5,
        duration: 0.5,
        opacity: { ease: "linear", duration: 0.2 },
      }}
    >
      <div
        className={
          "flex w-full flex-col gap-4 overflow-x-clip p-4 pl-8 sm:w-[500px] md:mr-10 md:w-[500px] lg:w-[500px] xl:w-[600px]"
        }
      >
        {badgeTitle ? (
          <div className="flex flex-row items-center">
            <Ethereum className={"size-[30px]"} />
            <Badge className="z-50 -ml-2 pl-1">
              <div className="flex flex-row items-center gap-1">
                <Token className={"size-[28px] invert"} />
                <div className="text-xl">
                  {token0.symbol} - {token1.symbol}
                </div>
              </div>
            </Badge>
          </div>
        ) : (
          <TypographyH3 className="hidden font-normal md:inline-flex">
            {token0.symbol}/{token1.symbol}
          </TypographyH3>
        )}

        <Graph />

        <div className="hidden w-full flex-row flex-wrap items-center justify-between gap-2 md:flex">
          <div>
            <p className="text-2xs">Liquidity</p>
            <p className="text-xl">$1.01M</p>
          </div>

          <div>
            <p className="text-2xs">Volume 24H</p>
            <p className="text-xl">$115.21K</p>
          </div>

          <div>
            <p className="text-2xs">Stake APY</p>
            <p className="text-xl">1.62%</p>
          </div>

          <div>
            <p className="text-2xs">24H Trade Rewards</p>
            <p className="text-xl">$300.56</p>
          </div>
        </div>

        <div className="mt-[35px]">
          <div className="flex w-full flex-row items-center justify-between">
            <h3 className="text-sm">Transaction History</h3>
            <div>
              <span className="cursor-pointer text-sm underline">
                My Transactions
              </span>{" "}
              {"->"}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={
            [
              {
                id: "1",
                value: 100,
                rewards: 200,
                time: new Date("2023-10-10T14:48:00.000+09:00"),
                amountFrom: 30.2,
                amountTo: 0.0001,
              },
              {
                id: "2",
                value: 300,
                rewards: 20,
                time: new Date("2023-10-10T16:32:00.000+09:00"),
                amountFrom: 30.2,
                amountTo: 0.0001,
              },
            ] as Transaction[]
          }
        />
      </div>
    </motion.div>
  );
};
