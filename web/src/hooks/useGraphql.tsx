import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { graphqlEndpoint } from "@/config/graphqlEndpoint";
import { graphql } from "@/gql";
import { useAccount } from "wagmi";

/**
 * The main GraphQL query to fetch all data.
 *
 * Fragments are used to fetch only the data we need. They are
 * configured in the components that use the data.
 */
export const graphqlQuery = graphql(`
  query AllData($address: String!) {
    getWallet(address: $address) {
      # add wallet fragments here
      ...MyPositionsWalletFragment
    }

    pools {
      # used for the pool selector
      address

      swapsForUser(address: $address) {
        # add transaction fragments here
        ...SwapProTransactionsFragment
      }

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
 * Fetch all data from the GraphQL endpoint.
 */
export const useGraphql = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["graphql", address ?? ""],
    queryFn: () =>
      request(graphqlEndpoint, graphqlQuery, { address: address ?? "" }),
  });
};
