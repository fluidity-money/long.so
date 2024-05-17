import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { graphqlEndpoint } from "@/config/graphqlEndpoint";
import { graphql } from "@/gql";

/**
 * The main GraphQL query to fetch all data.
 *
 * Fragments are used to fetch only the data we need. They are
 * configured in the components that use the data.
 */
const graphqlQuery = graphql(`
  query AllData {
    pools {
      ...SwapProPoolFragment
      ...AllPoolsFragment
      ...SelectPrimeAssetFragment
      ...SwapExploreFragment
      ...ManagePoolFragment
    }
  }
`);

/**
 * Fetch all data from the GraphQL endpoint.
 */
export const useGraphql = () =>
  useQuery({
    queryKey: ["graphql"],
    queryFn: () => request(graphqlEndpoint, graphqlQuery),
  });
