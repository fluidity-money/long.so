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
      monthly
    }
    volumeOverTime {
      monthly {
        timestamp
        token1 {
          valueUsd
        }
        fusdc {
          valueUsd
        }
      }
      daily {
        timestamp # TODO: timestamp is always 0
        token1 {
          valueUsd
        }
        fusdc {
          valueUsd
        }
      }
    }
    liquidityOverTime {
      daily {
        timestamp
        fusdc {
          # TODO: uncomment this when the data is available
          # valueUsd
          # TODO: this is returning hex values, not sure what it is
          valueUnscaled
        }
      }
      monthly {
        timestamp
        fusdc {
          # TODO: uncomment this when the data is available
          # valueUsd
          # TODO: this is returning hex values, not sure what it is
          valueUnscaled
        }
      }
    }
  }
`);
