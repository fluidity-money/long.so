"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Search from "@/assets/icons/Search.svg";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SelectPrimeAssetTable } from "@/app/stake/pool/create/select-prime-asset/_SelectPrimeAssetTable/SelectPrimeAssetTable";
import {
  columns,
  Pool,
} from "@/app/stake/pool/create/select-prime-asset/_SelectPrimeAssetTable/columns";
import { nanoid } from "nanoid";
import { Token, fUSDC } from "@/config/tokens";
import { useGraphqlGlobal } from "@/hooks/useGraphql";
import { Hash } from "viem";
import { usdFormat } from "@/lib/usdFormat";
import { graphql, useFragment } from "@/gql";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

const SelectPrimeAssetFragment = graphql(`
  fragment SelectPrimeAssetFragment on SeawaterPool {
    address
    volumeOverTime {
      daily {
        fusdc {
          valueUsd
        }
      }
    }
    token {
      name
      symbol
      address
    }
  }
`);

const SelectPrimeAsset = () => {
  const router = useRouter();

  const [boostedPools, setBoostedPools] = useState(false);
  const [myAssets, setMyAssets] = useState(false);

  const showMockData = useFeatureFlag("ui show demo data");

  const { data, isLoading } = useGraphqlGlobal();

  const poolsData = useFragment(SelectPrimeAssetFragment, data?.pools);

  const tokens: Token[] = poolsData ? poolsData?.map((pool) => ({
    name: pool.token.name,
    symbol: pool.token.symbol,
    address: pool.token.address as Hash,
  })) : [];

  /**
   * Reformat our data to match the table columns
   */
  const pools = useMemo((): Pool[] => {
    if (showMockData) return [
      {
        APR: 170.23,
        volume: "$100k",
        duration: 150,
        id: nanoid(),
        tokens: [tokens[0], tokens[1]],
      },
    ];

    if (isLoading || !poolsData) return [];

    return poolsData?.map((pool) => ({
      id: pool.address,
      // assume the first token is always the main token
      volume: usdFormat(
        parseFloat(pool.volumeOverTime.daily[0].fusdc.valueUsd),
      ),
      APR: 0, // TODO: calculate APR
      duration: 0, // TODO: get duration
      tokens: [
        {
          name: pool.token.name,
          symbol: pool.token.symbol,
          address: pool.token.address as Hash,
        },
        // assume the second token is always fUSDC
        fUSDC,
      ],
    }));
  }, [isLoading, poolsData, showMockData]);

  return (
    <div className={"flex flex-col items-center"}>
      <motion.div
        layoutId={"modal"}
        className="flex h-[514px] w-[318px] flex-col rounded-lg bg-black px-[12px] pb-[12px] pt-[9px] text-white md:h-[547px] md:w-[393px]"
      >
        <div className={"flex flex-row items-center justify-between"}>
          <div className={"text-[10px]"}>Select Prime Asset</div>
          <Button
            size={"esc"}
            variant={"secondary"}
            onClick={() => router.back()}
          >
            Esc
          </Button>
        </div>

        <div>
          <div className={"mt-[16px] text-[10px] md:mt-[13px]"}>
            Popular Campaigns
          </div>
          <div className={"w-full"}>
            <div
              className={
                "mb-[36px] mt-[45px] w-full text-center text-[8px] text-neutral-400"
              }
            >
              No Popular Campaigns Yet
            </div>
          </div>
        </div>

        <div>
          <div className={"text-[10px]"}>All Pools</div>

          <div className={"mt-[11px] text-[8px]"}>Filter</div>

          <div className="flex flex-row items-center border-b border-white pl-2">
            <Search className="size-4" />
            <Input
              variant="no-ring"
              className="h-8 w-[350px] border-0 bg-transparent text-xs"
              placeholder="Search for tokens by name, symbol, or contract address."
            />
          </div>

          <div className={"mt-[9px] flex flex-row gap-2"}>
            <Badge
              variant={"secondary"}
              className={cn("h-4 py-0 pl-0", {
                "bg-black text-white hover:bg-black/80": !boostedPools,
              })}
            >
              <Switch
                id={"boosted-pools"}
                className={cn("my-0 -ml-2 scale-50", {
                  invert: boostedPools,
                })}
                checked={boostedPools}
                onCheckedChange={setBoostedPools}
              />
              <Label htmlFor={"boosted-pools"} className="text-2xs">
                Boosted Pools
              </Label>
            </Badge>

            <Badge
              variant={"secondary"}
              className={cn("h-4 py-0 pl-0", {
                "bg-black text-white hover:bg-black/80": !myAssets,
              })}
            >
              <Switch
                id={"my-assets"}
                className={cn("my-0 -ml-2 scale-50", {
                  invert: myAssets,
                })}
                checked={myAssets}
                onCheckedChange={setMyAssets}
              />
              <Label htmlFor={"my-assets"} className="text-2xs">
                My Assets
              </Label>
            </Badge>
          </div>
        </div>

        <div className={"mt-[20px] flex flex-1 overflow-y-auto"}>
          <SelectPrimeAssetTable columns={columns} data={pools} />
        </div>

        <Button
          variant={"secondary"}
          className={"h-[28.59px] w-full text-[10px] md:h-7"}
          onClick={() => router.back()}
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};

export default SelectPrimeAsset;
