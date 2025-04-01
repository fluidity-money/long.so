import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import appConfig from "@/config";
import { graphql } from "@/gql";
import { useAccount, useChainId } from "wagmi";
import { useChain } from "@/config/chains";
import { QuoteToken, RankingDirection, SwapEventData } from "@/gql/graphql";
import { timeAgo } from "@/lib/time";

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
  price: string;
  age: string;
  usd: string | null;
  eth?: string | null;
  token: string | null;
  maker?: string | null;
}
export const useGetTokenEvents = (poolAddress: string) => {
  return useInfiniteQuery({
    queryKey: ["tokenEvents", poolAddress],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const res = await request(appConfig.codexApiUrl, queryGetTokenEvents, {
        query: {
          address: poolAddress,
          networkId: 55244,
          quoteToken: QuoteToken.Token0,
        },
        limit: 30,
        direction: RankingDirection.Desc,
        cursor: pageParam,
      });
      if (!res?.getTokenEvents?.items) return { items: [] };
      const items = res.getTokenEvents.items
        .filter((i) => !!i)
        .map((item) => {
          switch (item.data?.__typename) {
            case "SwapEventData": {
              const swapData = item.data as SwapEventData;
              return {
                age: timeAgo(item.timestamp),
                eth: +Number(item.data.amountNonLiquidityToken).toFixed(4),
                price: +Number(item.token1SwapValueUsd)?.toFixed(4),
                usd: +Number(swapData.priceUsdTotal).toFixed(4),
                token: +Number(swapData.amountNonLiquidityToken).toFixed(4),
                type: item.data?.type,
                maker: item.maker,
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
                type: item.data?.type,
                maker: item.maker,
              };
            }
          }
        });
      return { cursor: res?.getTokenEvents?.cursor, items };
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
};
