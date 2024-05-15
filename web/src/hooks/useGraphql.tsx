import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { graphqlEndpoint } from "@/config/graphqlEndpoint";
import { graphql } from "@/gql";

const graphqlQuery = graphql(`
  query AllPools {
    pools {
      address
      token {
        name
      }
      volumeOverTime {
        daily {
          fusdc {
            valueScaled
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
