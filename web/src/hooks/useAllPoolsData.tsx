import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const allPoolsQueryDocument = graphql(/* GraphQL */ `
  query allPools {
    pools {
      address
      token {
        name
      }
      priceOverTime {
        daily
        monthly
      }
      volumeOverTime {
        daily {
          fusdc {
            valueScaled
          }
          token1 {
            valueScaled
            valueUsd
          }
        }
        monthly {
          fusdc {
            valueScaled
          }
          token1 {
            valueScaled
            valueUsd
          }
        }
      }
      liquidityOverTime {
        daily {
          fusdc {
            valueScaled
          }
          token1 {
            valueScaled
            valueUsd
          }
        }
        monthly {
          fusdc {
            valueScaled
          }
          token1 {
            valueScaled
            valueUsd
          }
        }
      }
      tvlOverTime {
        daily
        monthly
      }
      yieldOverTime {
        daily {
          fusdc {
            valueScaled
          }
          token1 {
            valueScaled
            valueUsd
          }
        }
        monthly {
          fusdc {
            valueScaled
          }
          token1 {
            valueScaled
            valueUsd
          }
        }
      }
    }
  }
`);

export const useAllPoolsData = () =>
  useQuery({
    queryKey: ["allPools"],
    queryFn: async () =>
      request("https://testnet-graph.long.so/", allPoolsQueryDocument),
  });
