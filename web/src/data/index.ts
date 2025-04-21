import request from "graphql-request";
import appConfig from "@/config/app";
import {
  DetailedStatsNumberMetricsFieldsFragment,
  DetailedStatsStringMetricsFieldsFragment,
  QuoteToken,
  RankingDirection,
  SwapEventData,
  TokenOfInterest,
  TokenPairStatisticsType,
  WindowedDetailedStatsFieldsFragment,
} from "@/gql/graphql";
import { timeAgo } from "@/lib/time";
import {
  queryBalances,
  queryGetBars,
  queryGetHolders,
  queryGetPairDetails,
  queryGetPairStatDetails,
  queryGetTokenEvents,
  queryGetTokenPrice,
  queryGetTokensInfo,
} from "@/hooks/useGraphql";
import { CandlestickData, HistogramData } from "lightweight-charts";

export async function requestGetTokenEvents({
  poolAddress,
  networkId,
  quoteToken = "0",
  maker,
  pageParam,
}: {
  poolAddress: string;
  quoteToken: "0" | "1";
  networkId: number;
  maker?: string;
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
        maker,
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
  tokenAddresses,
}: {
  networkId: number;
  tokenAddresses: string[];
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetTokenPrice,
    {
      inputs: tokenAddresses.map((address) => ({
        address,
        networkId,
      })),
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  return res.getTokenPrices;
}
export async function requestGetPairDetails(tokenAddress: string) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetPairDetails,
    {
      tokens: [tokenAddress],
      limit: 1,
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  return res?.filterTokens?.results?.[0];
}
export type Balance = {
  balance: number;
  name?: string;
  symbol?: string;
  address: string;
  usdValue?: string;
};
export async function requestBalances({
  walletAddress,
  filterToken,
  cursor,
  networkId,
}: {
  walletAddress: string;
  filterToken?: string;
  cursor?: string | null;
  networkId: number;
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryBalances,
    {
      input: {
        walletId: `${walletAddress}:${networkId}`,
        filterToken: filterToken ? `${filterToken}:${networkId}` : undefined,
        cursor,
      },
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  return res.balances;
}
export async function requestGetPairStatDetails({
  pairAddress,
  quoteToken,
  networkId,
}: {
  pairAddress: string;
  quoteToken: "0" | "1";
  networkId: number;
}) {
  const tokenOfInteresFilter =
    quoteToken === "0" ? TokenOfInterest.Token0 : TokenOfInterest.Token1;
  const res = await request(
    appConfig.codexApiUrl,
    queryGetPairStatDetails,
    {
      pairId: `${pairAddress}:${networkId}`,
      tokenOfInterest: tokenOfInteresFilter,
      statsType: TokenPairStatisticsType.Filtered,
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  const data = {
    ...res.getDetailedStats,
    stats_min5: res.getDetailedStats?.stats_min5 as StatDetail,
    stats_hour1: res.getDetailedStats?.stats_hour1 as StatDetail,
    stats_hour4: res.getDetailedStats?.stats_hour4 as StatDetail,
    stats_hour12: res.getDetailedStats?.stats_hour12 as StatDetail,
    stats_day1: res.getDetailedStats?.stats_day1 as StatDetail,
  };
  return data;
}
type StatDetail = WindowedDetailedStatsFieldsFragment & {
  transactions: DetailedStatsNumberMetricsFieldsFragment;
  volume: DetailedStatsStringMetricsFieldsFragment;
  traders: DetailedStatsNumberMetricsFieldsFragment;
  buys: DetailedStatsNumberMetricsFieldsFragment;
  sells: DetailedStatsNumberMetricsFieldsFragment;
  buyVolume: DetailedStatsStringMetricsFieldsFragment;
  sellVolume: DetailedStatsStringMetricsFieldsFragment;
  buyers: DetailedStatsNumberMetricsFieldsFragment;
  sellers: DetailedStatsNumberMetricsFieldsFragment;
};
export async function requestGetBars({
  pairAddress,
  networkId,
  quoteToken,
}: {
  networkId: number;
  pairAddress: string;
  quoteToken: "0" | "1";
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetBars,
    {
      symbol: `${pairAddress}:${networkId}`,
      resolution: "30",
      from: 1744276460,
      to: 1744868660,
      countback: 330,
      currencyCode: "USD",
      statsType: TokenPairStatisticsType.Filtered,
      quoteToken: quoteToken ? QuoteToken.Token0 : QuoteToken.Token1,
      removeLeadingNullValues: true,
      removeEmptyBars: true,
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  if (!res?.getBars) throw new Error("Could not fetch bars");
  const candlestick = res.getBars.t.map(
    (time, idx) =>
      ({
        time,
        open: res.getBars!.o[idx],
        close: res.getBars!.c[idx],
        high: res.getBars!.h[idx],
        low: res.getBars!.l[idx],
      }) as CandlestickData,
  );
  const histogram = res.getBars.t.map(
    (time, idx) =>
      ({
        time,
        value: +res.getBars!.volume![idx]!,
      }) as HistogramData,
  );

  return { candlestick, histogram };
}
export async function requestGetTokensInfo({
  tokenAddresses,
  networkId,
}: {
  tokenAddresses: string[];
  networkId: number;
}) {
  const res = await request(
    appConfig.codexApiUrl,
    queryGetTokensInfo,
    {
      tokens: tokenAddresses.map((address) => `${address}:${networkId}`),
      statsType: TokenPairStatisticsType.Filtered,
      offset: 0,
      limit: 100,
    },
    {
      Authorization: process.env.NEXT_PUBLIC_CODEX_API_KEY!,
    },
  );
  return res.filterTokens?.results;
}
