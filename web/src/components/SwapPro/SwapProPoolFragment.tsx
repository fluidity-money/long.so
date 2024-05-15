import { graphql } from "@/gql";

/**
 * Fragment containing the data for SwapPro
 */
export const SwapProPoolFragment = graphql(`
  fragment SwapProPoolFragment on SeawaterPool {
    address
    token {
      address
    }
    priceOverTime {
      daily
    }
    volumeOverTime {
      daily {
        timestamp
        token1 {
          valueScaled
          valueUsd
        }
        fusdc {
          valueScaled
          valueUsd
        }
      }
    }
    tvlOverTime {
      daily
    }
  }
`);
