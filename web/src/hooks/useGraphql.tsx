import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import appConfig from "@/config/app";
import { graphql } from "@/gql";
import { useAccount, useChainId } from "wagmi";
import { useChain } from "@/config/chains";
import {
  requestBalances,
  requestGetHolders,
  requestGetPairDetails,
  requestGetPairStatDetails,
  requestGetTokenEvents,
  requestGetTokenPrice,
} from "@/data";
import { useAppKitAccount } from "@reown/appkit/react";

/**
 * The main GraphQL query to fetch all data. The global query that should be run and
 * refreshed. This should include any high cost pool-specific requests where possible,
 * since behind the scenes this should be reloaded and cached with swr without downtime.
 *
 * Fragments are used to fetch only the data we need. They are configured in the
 * components that use the data.
 */
export const graphqlQueryGlobal = graphql(`
  query AllData {
    fusdc {
      address
      ...FusdcFragment
    }
    pools {
      # used for the pool selector
      address

      # add general fragments here
      ...SwapProPoolFragment
      ...AllPoolsFragment
      ...SelectPrimeAssetFragment
      ...SwapExploreFragment
      ...ManagePoolFragment
      ...SwapFormFragment
      ...StakeFormFragment
      ...TokensFragment
      ...ConfirmStakeFragment
    }
  }
`);

/**
 * The user-specific GraphQL query that's hard to cache. Done on a per-user basis, and
 * loaded once the user connects their wallet.
 */
export const graphqlQueryUser = graphql(`
  query ForUser($wallet: String!) {
    getSwapsForUser(wallet: $wallet, first: 10) {
      data {
        swaps {
          # add transaction fragments here
          ...TradeTabTransactionsFragment
        }
      }
    }

    getWallet(address: $wallet) {
      # add wallet fragments here
      ...MyPositionsInventoryWalletFragment
      ...PositionsFragment
    }

    notes(wallet: $wallet) {
      # add notes fragments here
      ...NotesFragment
    }
  }
`);
export const queryGetPoints = graphql(`
  query queryGetPoints($wallet: String!) {
    getPointsComponent(wallet: $wallet)
  }
`);
export const queryGetPool = graphql(`
  query queryGetPool($token: String!, $filter: String = "") {
    getPool(token: $token) {
      ...StakeFormPoolFragment
      ...ManagePoolFragment
      ...SwapProPoolFilteredFragment
    }
  }
`);

/**
 * Fetch all data from the global GraphQL endpoint.
 */
export const useGraphqlGlobal = () => {
  const chainId = useChainId();
  const { gqlUrl } = useChain(chainId);

  return useQuery({
    queryKey: ["graphql", chainId],
    queryFn: () => request(gqlUrl, graphqlQueryGlobal),
    refetchInterval: 60 * 1000, // 1 minute
  });
};

export const useGraphqlUser = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { gqlUrl } = useChain(chainId);

  return useQuery({
    queryKey: ["graphql", chainId, address],
    queryFn: () =>
      request(gqlUrl, graphqlQueryUser, {
        wallet: address ?? "",
      }),
    refetchInterval: 20 * 1000, // 20 seconds
    enabled: !!address,
  });
};

export const usePointsGraph = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["points", address],
    queryFn: async () => {
      const res = await request(appConfig.pointsGraphUrl, queryGetPoints, {
        wallet: address ?? "",
      });
      return res.getPointsComponent;
    },
    refetchInterval: 20 * 1000, // 20 seconds
  });
};

export const useGetPool = (token: `0x${string}`, filter?: `0x${string}`) => {
  const chainId = useChainId();
  const { gqlUrl } = useChain(chainId);

  return useQuery({
    queryKey: ["pool", chainId, token, filter],
    queryFn: async () =>
      request(gqlUrl, queryGetPool, {
        token,
        filter,
      }),
    refetchInterval: 20 * 1000, // 20 seconds
  });
};

export const queryGetTokenEvents = graphql(`
  query GetTokenEvents(
    $limit: Int
    $query: EventsQueryInput!
    $cursor: String
    $direction: RankingDirection
  ) {
    getTokenEvents(
      limit: $limit
      query: $query
      cursor: $cursor
      direction: $direction
    ) {
      items {
        address
        baseTokenPrice
        blockNumber
        eventDisplayType
        eventType
        id
        liquidityToken
        logIndex
        maker
        timestamp
        token0SwapValueUsd
        token0ValueBase
        token1SwapValueUsd
        token1ValueBase
        transactionHash
        labels {
          sandwich {
            label
            sandwichType
            token0DrainedAmount
            token1DrainedAmount
          }
        }
        transactionIndex
        quoteToken
        data {
          __typename
          ... on BurnEventData {
            amount0
            amount1
            amount0Shifted
            amount1Shifted
            type
            __typename
          }
          ... on MintEventData {
            amount0
            amount1
            amount0Shifted
            amount1Shifted
            type
            __typename
          }
          ... on PoolBalanceChangedEventData {
            amount0
            amount1
            amount0Shifted
            amount1Shifted
            type
            __typename
          }
          ... on SwapEventData {
            amount0In
            amount0Out
            amount1In
            amount1Out
            amount0
            amount1
            amountNonLiquidityToken
            priceUsd
            priceUsdTotal
            priceBaseToken
            priceBaseTokenTotal
            type
            __typename
          }
        }
      }
      cursor
    }
  }
`);
export interface TokenEvent {
  type?: string | null;
  price: string | number;
  age: string;
  usd: number | null;
  eth?: number | string | null;
  token: number | string | null;
  maker?: string | null;
  eventDisplayType: "Buy" | "Sell" | "Mint" | "Burn";
}
export const useGetTokenEvents = ({
  poolAddress,
  initialData,
  networkId,
  quoteToken,
  isPersonal,
}: {
  poolAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
  networkId: number;
  quoteToken: "0" | "1";
  isPersonal: boolean;
}) => {
  const account = useAppKitAccount();
  return useInfiniteQuery({
    queryKey: [
      "tokenEvents",
      poolAddress,
      quoteToken,
      networkId,
      isPersonal,
      account?.address,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string | null }) => {
      if (isPersonal && !account?.address) return { cursor: null, items: [] };
      return await requestGetTokenEvents({
        poolAddress,
        pageParam,
        quoteToken,
        networkId,
        maker: isPersonal ? account?.address : undefined,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialData: {
      pageParams: [undefined],
      pages: [initialData],
    },
  });
};
export const queryGetHolders = graphql(`
  query GetHolders($input: HoldersInput!, $tokenInput: TokenInput!) {
    token(input: $tokenInput) {
      id
      info {
        totalSupply
      }
      __typename
    }
    holders(input: $input) {
      count
      status
      items {
        balance
        shiftedBalance
        tokenId
        walletId
        __typename
      }
      cursor
      __typename
    }
  }
`);
export const useGetHolders = ({
  tokenAddress,
  initialData,
  networkId,
}: {
  tokenAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetHolders>>;
  networkId: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["tokenHolders", tokenAddress, networkId],
    queryFn: async ({ pageParam }: { pageParam?: string | null }) =>
      await requestGetHolders({
        tokenAddress,
        pageParam,
        networkId,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialData: {
      pageParams: [undefined],
      pages: [initialData],
    },
  });
};
export const queryGetTokenPrice = graphql(`
  query GetTokenPrice($inputs: [GetPriceInput]) {
    getTokenPrices(inputs: $inputs) {
      priceUsd
      timestamp
      __typename
    }
  }
`);
export const useGetTokenPrice = ({
  tokenAddress,
  initialData,
  networkId,
}: {
  tokenAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetTokenPrice>>;
  networkId: number;
}) => {
  return useQuery({
    queryKey: ["tokenPrice", tokenAddress, networkId],
    queryFn: async () =>
      await requestGetTokenPrice({
        tokenAddress,
        networkId,
      }),
    initialData,
  });
};
export const queryGetPairDetails = graphql(`
  query FilterTokens(
    $filters: TokenFilters
    $statsType: TokenPairStatisticsType
    $phrase: String
    $tokens: [String]
    $rankings: [TokenRanking]
    $limit: Int
    $offset: Int
  ) {
    filterTokens(
      filters: $filters
      statsType: $statsType
      phrase: $phrase
      tokens: $tokens
      rankings: $rankings
      limit: $limit
      offset: $offset
    ) {
      results {
        liquidity
        marketCap
        change5m
        change1
        change4
        change12
        change24
        volume24
        priceUSD
      }
    }
  }
`);
export const useGetPairDetails = ({
  tokenAddress,
  initialData,
}: {
  tokenAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetPairDetails>>;
}) => {
  return useQuery({
    queryKey: ["pairDetails", tokenAddress],
    queryFn: async () => await requestGetPairDetails(tokenAddress),
    initialData,
  });
};
export const queryBalances = graphql(`
  query Balances($input: BalancesInput!) {
    balances(input: $input) {
      cursor
      items {
        walletId
        tokenId
        balance
        shiftedBalance
      }
    }
  }
`);
export const useBalances = ({
  filterToken,
  initialData,
  walletAddress,
  networkId,
}: {
  initialData: Awaited<ReturnType<typeof requestBalances>>;
  walletAddress: string;
  filterToken?: string;
  networkId: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["balances", walletAddress, networkId],
    queryFn: async ({ pageParam }: { pageParam?: string | null }) =>
      await requestBalances({
        filterToken,
        networkId,
        walletAddress,
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialData: {
      pageParams: [undefined],
      pages: [initialData],
    },
  });
};
export const queryGetPairStatDetails = graphql(`
  query GetDetailedStats(
    $pairId: String!
    $tokenOfInterest: TokenOfInterest
    $timestamp: Int
    $windowSizes: [DetailedStatsWindowSize]
    $bucketCount: Int
    $statsType: TokenPairStatisticsType
  ) {
    getDetailedStats(
      pairId: $pairId
      tokenOfInterest: $tokenOfInterest
      timestamp: $timestamp
      windowSizes: $windowSizes
      bucketCount: $bucketCount
      statsType: $statsType
    ) {
      pairId
      tokenOfInterest
      statsType
      stats_min5 {
        ...WindowedDetailedStatsFields
        __typename
      }
      stats_hour1 {
        ...WindowedDetailedStatsFields
        __typename
      }
      stats_hour4 {
        ...WindowedDetailedStatsFields
        __typename
      }
      stats_hour12 {
        ...WindowedDetailedStatsFields
        __typename
      }
      stats_day1 {
        ...WindowedDetailedStatsFields
        __typename
      }
      __typename
    }
  }

  fragment WindowedDetailedStatsFields on WindowedDetailedStats {
    windowSize
    timestamp
    endTimestamp
    buckets {
      start
      end
      __typename
    }
    transactions {
      ...DetailedStatsNumberMetricsFields
      __typename
    }
    volume {
      ...DetailedStatsStringMetricsFields
      __typename
    }
    buys {
      ...DetailedStatsNumberMetricsFields
      __typename
    }
    sells {
      ...DetailedStatsNumberMetricsFields
      __typename
    }
    buyers {
      ...DetailedStatsNumberMetricsFields
      __typename
    }
    sellers {
      ...DetailedStatsNumberMetricsFields
      __typename
    }
    traders {
      ...DetailedStatsNumberMetricsFields
      __typename
    }
    buyVolume {
      ...DetailedStatsStringMetricsFields
      __typename
    }
    sellVolume {
      ...DetailedStatsStringMetricsFields
      __typename
    }
    __typename
  }

  fragment DetailedStatsNumberMetricsFields on DetailedStatsNumberMetrics {
    change
    currentValue
    previousValue
    buckets
    __typename
  }

  fragment DetailedStatsStringMetricsFields on DetailedStatsStringMetrics {
    change
    currentValue
    previousValue
    buckets
    __typename
  }
`);
export const useGetPairStatDetails = ({
  pairAddress,
  quoteToken,
  networkId,
  initialData,
}: {
  pairAddress: string;
  quoteToken: "0" | "1";
  networkId: number;
  initialData: Awaited<ReturnType<typeof requestGetPairStatDetails>>;
}) => {
  return useQuery({
    queryKey: ["pairStatDetails", pairAddress, quoteToken, networkId],
    queryFn: () =>
      requestGetPairStatDetails({ pairAddress, quoteToken, networkId }),
    initialData,
  });
};
