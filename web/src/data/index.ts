import request from "graphql-request";
import appConfig from "@/config/app";
import { QuoteToken, RankingDirection, SwapEventData } from "@/gql/graphql";
import { timeAgo } from "@/lib/time";
import {
  queryGetHolders,
  queryGetTokenEvents,
  queryGetTokenPrice,
} from "@/hooks/useGraphql";

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
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
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
export interface Holder {
  address: string;
  percentage: string;
  totalSupply?: string | null;
  amount: number;
  value: string;
}
export async function requestGetHolders({
  networkId,
  tokenAddress,
  pageParam,
}: {
  networkId: number;
  tokenAddress: string;
  pageParam?: string | null;
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetHolders,
    {
      tokenInput: {
        address: tokenAddress,
        networkId,
      },
      input: {
        tokenId: `${tokenAddress}:${networkId}`,
        cursor: pageParam,
      },
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  const items = res.holders.items.map(
    (item) =>
      ({
        address: item.walletId.split(":")[0],
        amount: +item.shiftedBalance.toFixed(5),
        percentage: (
          (item.shiftedBalance / Number(res.token.info?.totalSupply)) *
          100
        ).toFixed(2),
        totalSupply: res.token.info?.totalSupply,
        value: "?",
      }) as Holder,
  );
  return { cursor: res?.holders?.cursor, items };
}
export async function requestGetTokenPrice({
  networkId,
  tokenAddress,
}: {
  networkId: number;
  tokenAddress: string;
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetTokenPrice,
    {
      inputs: [
        {
          address: tokenAddress,
          networkId,
        },
      ],
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  const data = res.getTokenPrices?.[0];
  const tokenPrice = data?.priceUsd;
  return tokenPrice;
}
