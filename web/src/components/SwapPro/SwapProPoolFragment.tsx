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
        token1 {
          timestamp
          valueUsd
        }
        fusdc {
          timestamp
          valueUsd
        }
      }
      daily {
        token1 {
          timestamp
          valueUsd
        }
        fusdc {
          timestamp
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
    APR {
      total
    }
    swaps {
      swaps {
        transactionHash
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

/**
 * Fragment containing the data for SwapPro, filtered by recipient swap token
 */
export const SwapProPoolFilteredFragment = graphql(`
  fragment SwapProPoolFilteredFragment on SeawaterPool {
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
        token1 {
          timestamp
          valueUsd
        }
        fusdc {
          timestamp
          valueUsd
        }
      }
      daily {
        token1 {
          timestamp
          valueUsd
        }
        fusdc {
          timestamp
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
    APR {
      total
    }
    swaps(filter: $filter) {
      swaps {
        transactionHash
        timestamp
        amountIn {
          valueScaled
          valueUsd
          token {
            symbol
            image
          }
        }
        amountOut {
          valueScaled
          token {
            symbol
            image
          }
        }
      }
    }
  }
`);
