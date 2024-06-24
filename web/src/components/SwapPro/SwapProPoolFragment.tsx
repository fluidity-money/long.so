import { graphql } from "@/gql";

/**
 * Fragment containing the data for SwapPro
 */
export const SwapProPoolFragment = graphql(`
  fragment SwapProPoolFragment on SeawaterPool {
    address
    token {
      address
      symbol
    }
    liquidity {
      liquidity
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
          valueUsd
        }
      }
      monthly {
        timestamp
        fusdc {
          valueUsd
        }
      }
    }
    swaps {
      swaps {
        timestamp
        amountIn {
          valueScaled
          token {
            symbol
          }
        }
        amountOut {
          valueScaled
          token {
            symbol
          }
        }
      }
    }
  }
`);
