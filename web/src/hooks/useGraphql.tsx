import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { graphqlEndpoint } from "@/config/graphqlEndpoint";
import { graphql } from "@/gql";

/**
 * The main GraphQL query to fetch all data.
 */
const graphqlQuery = graphql(`
  query AllData {
    pools {
      ...SwapProPoolFragment
      ...AllPoolsFragment
      ...SelectPrimeAssetFragment
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
