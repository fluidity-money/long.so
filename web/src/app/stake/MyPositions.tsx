"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import List from "@/assets/icons/list.svg";
import Grid from "@/assets/icons/grid.svg";
import { cn } from "@/lib/utils";
import { MyPositionsTable } from "@/app/stake/_MyPositionsTable/MyPositionsTable";
import { columns, Pool } from "@/app/stake/_MyPositionsTable/columns";
import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";
import Position from "@/assets/icons/position.svg";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import Link from "next/link";
import Token from "@/assets/icons/token.svg";
import TokenIridescent from "@/assets/icons/token-iridescent.svg";
import SegmentedControl from "@/components/ui/segmented-control";
import { useAccount } from "wagmi";
import { mockMyPositions } from "@/demoData/myPositions";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { graphql, useFragment } from "@/gql";
import { useGraphqlUser } from "@/hooks/useGraphql";
import { fUSDC } from "@/config/tokens";

const MyPositionsWalletFragment = graphql(`
  fragment MyPositionsWalletFragment on Wallet {
    id
    positions {
      positionId
      pool {
        token {
          name
          address
          symbol
        }
      }
    }
  }
`);

export const MyPositions = () => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  const [expanded, setExpanded] = useState(false);

  const router = useRouter();

  const { address } = useAccount();

  const showDemoData = useFeatureFlag("ui show demo data");
  const showClaimAllYield = useFeatureFlag("ui show claim all yield");

  const { data } = useGraphqlUser();

  const walletData = useFragment(MyPositionsWalletFragment, data?.getWallet);

  // this is every position, with their respective pools
  const pools = useMemo((): Pool[] | undefined => {
    if (showDemoData && address) return mockMyPositions;

    return walletData?.positions?.map((position) => ({
      positionId: position.positionId,
      id: position.pool.token.address,
      duration: 0,
      tokens: [
        fUSDC,
        {
          name: position.pool.token.name,
          address: position.pool.token.address,
          symbol: position.pool.token.symbol,
        },
      ],
      staked: 0,
      totalYield: 0,
    }));
  }, [showDemoData, address, walletData]);

  console.log(pools);

  return (
    <motion.div
      layoutId="modal"
      className={cn(
        "flex h-[240px] w-full flex-col gap-2 rounded-lg bg-black p-4 pb-2 text-white transition-[height] md:h-[248px]",
        {
          "h-[412px]": expanded,
        },
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-3xs md:text-2xs">My Positions</div>

        <SegmentedControl
          variant={"secondary"}
          callback={(val) => setDisplayMode(val)}
          segments={[
            {
              label: (
                <div className={"flex flex-row items-center gap-1"}>
                  <List />
                  List
                </div>
              ),
              value: "list",
              ref: useRef(),
            },
            {
              label: (
                <div className={"flex flex-row items-center gap-1"}>
                  <Grid />
                  Grid
                </div>
              ),
              value: "grid",
              ref: useRef(),
            },
          ]}
        />
      </div>

      <div
        className={cn("h-[180px] overflow-y-auto transition-[height]", {
          "h-[300px]": expanded,
        })}
      >
        {!pools || pools?.length === 0 ? (
          <div className="flex min-h-[149px] flex-col items-center justify-center">
            <div className="text-2xs">
              Your active positions will appear here.
            </div>
          </div>
        ) : displayMode === "list" ? (
          pools && <MyPositionsTable columns={columns} data={pools} />
        ) : (
          <motion.div
            layout
            className={cn("flex flex-row items-center justify-around gap-4", {
              "mb-4 flex-wrap": expanded,
            })}
          >
            {pools?.map((pool) => (
              <motion.div
                layout
                key={pool.id}
                className="flex h-[83px] w-[77px] cursor-pointer flex-col items-center rounded-xl border border-white p-2 md:h-[120px] md:min-w-[111px] md:gap-1"
                onClick={() => router.push(`/stake/pool?id=${pool.id}`)}
              >
                <div className="flex w-full flex-row">
                  <div className="size-1 rounded-full bg-red-500 md:size-2" />
                </div>

                <div className="-mt-1 flex flex-col md:-mt-2">
                  <div className="flex flex-row">
                    <Token className="ml-[-2px] size-[25px] rounded-full border border-black md:size-[35px]" />
                    <TokenIridescent className="ml-[-6px] size-[25px] rounded-full border-2 border-black md:size-[35px]" />
                  </div>
                  <div className="flex flex-row justify-center">
                    <Badge
                      variant="outline"
                      className="z-20 -mt-1 text-nowrap bg-black p-0 px-px text-[4px] text-white md:-mt-2 md:px-[2px] md:text-3xs"
                    >
                      {pool.tokens[0].name}
                      {" x "}
                      {pool.tokens[1].name}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs md:text-sm">
                    {usdFormat(pool.staked)}
                  </div>
                  <div className="mt-[-2px] text-[4px] text-gray-2 md:text-3xs">
                    No Yield Yet
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="mt-[5px] h-6 w-full justify-center gap-1 text-nowrap p-0 px-1 text-2xs"
                >
                  <Position className={"size-[6px] md:size-[10px]"} />
                  <div className="text-4xs md:text-3xs">$20 Position</div>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {pools && pools.length > 0 && (
        <div className="flex flex-col items-center md:hidden">
          <Button
            variant="link"
            className="group flex h-6 flex-row gap-2 text-2xs text-white hover:no-underline"
            size={"sm"}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                <div className="group-hover:underline">Hide</div>
                <div className="-rotate-90">{"->"}</div>
              </>
            ) : (
              <>
                <div className="group-hover:underline">Expand</div>
                <div className="rotate-90">{"->"}</div>
              </>
            )}
          </Button>
        </div>
      )}

      <div className="flex max-w-full flex-row gap-2">
        {pools && showClaimAllYield && pools.length > 0 && (
          <div className="flex flex-1 flex-col items-center">
            <Button
              className="w-full text-3xs text-black md:text-xs"
              variant="iridescent"
              size="sm"
            >
              Claim all yield
            </Button>
            <Badge
              variant="iridescent"
              className="-mt-2 gap-2 border-2 border-black text-3xs"
            >
              {usdFormat(920.12)}
            </Badge>
          </div>
        )}
        <Link href={"/stake/pool/create"} className="flex-1">
          <Button
            className="w-full text-3xs md:text-xs"
            variant="secondary"
            size="sm"
          >
            + Create New Position
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
