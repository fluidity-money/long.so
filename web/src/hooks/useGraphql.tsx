import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import appConfig from "@/config";
import { graphql } from "@/gql";
import { useAccount, useChainId } from "wagmi";
import { useChain } from "@/config/chains";

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
