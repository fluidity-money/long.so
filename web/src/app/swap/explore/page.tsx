"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import IridescentToken from "@/assets/icons/token-iridescent.svg";
import { AllAssetsTable } from "@/app/swap/explore/_AllAssetsTable/AllAssetsTable";
import { columns } from "@/app/swap/explore/_AllAssetsTable/columns";
import { Token, tokens } from "@/config/tokens";
import { useSwapStore } from "@/stores/useSwapStore";
import { graphql, useFragment } from "@/gql";
import { useGraphql } from "@/hooks/useGraphql";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useMemo } from "react";
import { Hash } from "viem";
import {
  mockHighestRewarders,
  mockSwapExploreAssets,
} from "@/demoData/swapExploreAssets";

const SwapExploreFragment = graphql(`
  fragment SwapExploreFragment on SeawaterPool {
    token {
      name
      symbol
      address
    }
    price
  }
`);

const ExplorePage = () => {
  const router = useRouter();

  const { setToken0, setToken1 } = useSwapStore();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const { data, isLoading } = useGraphql();

  const tokensData = useFragment(SwapExploreFragment, data?.pools);

  const showMockData = useFeatureFlag("ui show demo data");

  const allAssetsData = useMemo(() => {
    if (showMockData) return mockSwapExploreAssets;

    // reformat the data to match the columns
    return (
      tokensData?.map((token) => ({
        symbol: token.token.symbol,
        address: token.token.address,
        name: token.token.name,
        amount: 0,
        amountUSD: 0,
        token: {
          address: token.token.address as Hash,
          name: token.token.name,
          symbol: token.token.symbol,
        } satisfies Token,
      })) ?? []
    );
  }, [showMockData, tokensData]);

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
          <AllAssetsTable columns={columns} data={allAssetsData}>
            <div className={"mt-[24px]"}>
              <div className={"text-[10px] md:text-[12px]"}>
                Highest Rewarders
              </div>

              <div
                className={
                  "mt-[4px] flex h-[45px] flex-row items-center gap-[11px] overflow-x-auto md:h-[60px]"
                }
              >
                {/* TODO: add in highest rewarders */}
                {(showMockData ? mockHighestRewarders : []).map((rewarder) => (
                  <Badge
                    variant={"outline"}
                    className={
                      "relative h-[25.36px] cursor-pointer gap-1 pl-0.5"
                    }
                    key={rewarder.address}
                    onClick={() => {
                      if (token === "0") {
                        setToken0(rewarder.token);
                      }

                      if (token === "1") {
                        setToken1(rewarder.token);
                      }

                      router.back();
                    }}
                  >
                    <IridescentToken className={"size-[20px]"} />
                    <div className={"iridescent-text text-sm"}>
                      {rewarder.symbol}
                    </div>
                    <div className="iridescent absolute -bottom-2 right-0 inline-flex h-[13px] flex-col items-end justify-center rounded-sm border border-stone-900 px-[3px] py-[1.50px]">
                      <div className="text-[8px]">2 days</div>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          </AllAssetsTable>
        </div>
      </motion.div>
    </div>
  );
};

export default ExplorePage;
