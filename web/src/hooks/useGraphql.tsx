import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { graphqlEndpoint } from "@/config/graphqlEndpoint";
import { graphql } from "@/gql";

const graphqlQuery = graphql(`
  query AllData {
    pools {
      address
      token {
        name
        address
        symbol
        decimals
        totalSupply
      }
      volumeOverTime {
        daily {
          fusdc {
            valueScaled
            valueUsd
          }
        }
      }
      tvlOverTime {
        daily
      }
      liquidityIncentives {
        # TODO: uncomment when this field is enabled
        # valueUsd
        valueUnscaled
      }
      superIncentives {
        # TODO: uncomment when this field is enabled
        # valueUsd
        valueUnscaled
      }
      utilityIncentives {
        maximumAmount
        amountGivenOut
      }
    }
  }
`);

export const useGraphql = () =>
  useQuery({
    queryKey: ["graphql"],
    queryFn: () => request(graphqlEndpoint, graphqlQuery),
  });
