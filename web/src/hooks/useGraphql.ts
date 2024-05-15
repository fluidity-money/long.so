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
    }
  }
`);
export const useGraphql = () =>
  useQuery({
    queryKey: ["graphql"],
    queryFn: () => request(graphqlEndpoint, graphqlQuery),
  });
