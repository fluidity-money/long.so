import request from "graphql-request";
import appConfig from "@/config/app";
import { QuoteToken, RankingDirection, SwapEventData } from "@/gql/graphql";
import { timeAgo } from "@/lib/time";
import { queryGetHolders, queryGetTokenEvents } from "@/hooks/useGraphql";

export async function requestGetTokenEvents({
  poolAddress,
  networkId,
  quoteToken = "0",
  pageParam,
}: {
  poolAddress: string;
  quoteToken: "0" | "1";
  networkId: number;
  pageParam?: string | null;
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetTokenEvents,
    {
      query: {
        address: poolAddress,
        networkId,
        quoteToken: QuoteToken.Token0,
      },
      limit: 30,
      direction: RankingDirection.Desc,
      cursor: pageParam,
    },
    {
      Authorization: "597c0b48301be1731314a255fe5fca6eef4002aa",
    },
  );

  if (!res?.getTokenEvents?.items) return { cursor: undefined, items: [] };
  const items = res.getTokenEvents.items
    .filter((i) => !!i)
    .map((item) => {
      switch (item.data?.__typename) {
        case "SwapEventData": {
          const swapData = item.data as SwapEventData;
          return {
            age: timeAgo(item.timestamp),
            eth: +Number(swapData.amountNonLiquidityToken).toFixed(4),
            price: +Number(
              quoteToken === "0"
                ? item.token0SwapValueUsd
                : item.token1SwapValueUsd,
            )?.toFixed(2),
            usd: +Number(swapData.priceUsdTotal).toFixed(2),
            token: +Number(swapData.amountNonLiquidityToken).toFixed(4),
            maker: item.maker,
            eventDisplayType: item.eventDisplayType as
              | "Mint"
              | "Burn"
              | "Buy"
              | "Sell",
          };
        }
        default: {
          const data = item.data as NonNullable<typeof item.data>;
          return {
            age: timeAgo(item.timestamp),
            eth: null,
            price: `${+Number(data.amount0Shifted).toFixed(4)} and ${+Number(data.amount1Shifted).toFixed(4)}`,
            usd: null,
            token: null,
            maker: item.maker,
            eventDisplayType: item.eventDisplayType as
              | "Mint"
              | "Burn"
              | "Buy"
              | "Sell",
          };
        }
      }
    });
  return { cursor: res?.getTokenEvents?.cursor, items };
}

export async function requestGetHolders({
  poolAddress,
  networkId,
  pageParam,
}: {
  poolAddress: string;
  networkId: number;
  pageParam?: string | null;
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetHolders,
    {
      tokenInput: {
        address: poolAddress,
        networkId,
      },
      input: {
        tokenId: `${poolAddress}:${networkId}`,
        cursor: pageParam,
      },
    },
    {
      Authorization: "597c0b48301be1731314a255fe5fca6eef4002aa",
    },
  );
  return res;
}
