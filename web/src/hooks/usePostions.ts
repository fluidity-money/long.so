import { ChainIdTypes, Token } from "@/config/tokens";
import { graphql, useFragment } from "@/gql";
import { useGraphqlUser } from "@/hooks/useGraphql";
import { useCallback, useEffect, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LiquidityCampaign = {
  campaignId: string;
  endTimestamp: number;
  fromTimestamp: number;
  tickLower: number;
  tickUpper: number;
};

// Position partially defines the remote Position type with necessary fields
export type Position = {
  // the age at which the position was created
  created: number;
  // the age at which the request was created and cached
  served: {
    timestamp: number;
  };
  positionId: number;
  pool: {
    token: Token;
    liquidityCampaigns: LiquidityCampaign[];
  };
  lower: number;
  upper: number;
  liquidity: {
    fusdc: {
      valueUsd: string;
    };
    token1: {
      valueUsd: string;
    };
  };
  isVested: boolean;
};

interface PositionStore {
  // positionsLocal is a list of positions modified by local actions
  positionsLocal: {
    [chainId: number]: {
      [address: `0x${string}`]: {
        [positionId: number]: Position;
      };
    };
  };
  // positions is a key value store of the most up to date positions
  // from the remote server and local
  positions: {
    [chainId: number]: {
      [address: `0x${string}`]: {
        [positionId: number]: Position;
      };
    };
  };
  // receive new positions, preferring the newest version of each position
  updatePositionsFromGraph: (
    chainId: ChainIdTypes,
    address: `0x${string}`,
    newPositions: Array<Position>,
  ) => void;
  // store a local position update after depositing or withdrawing a stake
  // it is assumed this is always newer/more accurate than the remote data
  // the first time it is stored
  updatePositionLocal: (
    chainId: ChainIdTypes,
    address: `0x${string}`,
    newPosition: Position,
  ) => void;
}

const usePositionStore = create<PositionStore>()(
  persist(
    (set) => {
      return {
        positions: {},
        positionsLocal: {},
        updatePositionsFromGraph: (chainId, address, newPositions) =>
          set(({ positions, positionsLocal }) => {
            const positionsUpdated = newPositions.reduce(
              (existing, newPosition) => {
                const local =
                  positionsLocal[chainId]?.[address]?.[newPosition.positionId];
                if (local?.served.timestamp < newPosition.served.timestamp)
                  return {
                    ...existing,
                    [newPosition.positionId]: local,
                  };
                return {
                  ...existing,
                  [newPosition.positionId]: newPosition,
                };
              },
              {},
            );
            return {
              positions: {
                ...positions,
                [chainId]: {
                  [address]: {
                    ...positions[chainId]?.[address],
                    ...positionsUpdated,
                  },
                },
              },
            };
          }),
        updatePositionLocal: (chainId, address, newPosition) =>
          set(({ positionsLocal, positions }) => ({
            positionsLocal: {
              ...positionsLocal,
              [chainId]: {
                [address]: {
                  ...positionsLocal[chainId]?.[address],
                  [newPosition.positionId]: newPosition,
                },
              },
            },
            positions: {
              ...positions,
              [chainId]: {
                [address]: {
                  ...positions[chainId]?.[address],
                  [newPosition.positionId]: newPosition,
                },
              },
            },
          })),
      };
    },
    {
      name: "position-store",
    },
  ),
);

const PositionsFragment = graphql(`
  fragment PositionsFragment on Wallet {
    id
    positions {
      positions {
        created
        served {
          timestamp
        }
        positionId
        pool {
          token {
            name
            address
            symbol
            decimals
          }
          liquidityCampaigns {
            campaignId
            tickLower
            tickUpper
            fromTimestamp
            endTimestamp
          }
        }
        lower
        upper
        liquidity {
          fusdc {
            valueUsd
          }
          token1 {
            valueUsd
          }
        }
        isVested
      }
    }
  }
`);

export const usePositions = () => {
  const { data: userData } = useGraphqlUser();
  const chainId = useChainId();
  const address =
    (useAccount().address?.toLowerCase() as `0x${string}`) || undefined;
  const positionsData = useFragment(PositionsFragment, userData?.getWallet);
  const positions = usePositionStore((s) => s.positions);
  const updatePositionLocal = usePositionStore((s) => s.updatePositionLocal);
  const updatePositionsFromGraph = usePositionStore(
    (s) => s.updatePositionsFromGraph,
  );
  const chainPositions = useMemo(
    () =>
      address
        ? Object.values(positions[chainId]?.[address] ?? {}).reverse()
        : [],
    [chainId, address, positions],
  );
  useEffect(() => {
    if (!positionsData || !address) return;
    updatePositionsFromGraph(
      chainId,
      address,
      // postprocess this to assert that the nested address type is correct
      positionsData.positions.positions.map((p) => ({
        ...p,
        pool: {
          ...p.pool,
          token: {
            ...p.pool.token,
            address: p.pool.token.address as `0x${string}`,
          },
        },
      })),
    );
  }, [positionsData, address, chainId, updatePositionsFromGraph]);

  return {
    // loading if the user is connected but the query hasn't resolved yet
    isLoading: address && !userData?.getWallet,
    positions: chainPositions,
    updatePositionLocal: useCallback<(newPosition: Position) => void>(
      (newPosition) =>
        address ? updatePositionLocal(chainId, address, newPosition) : () => {},
      [chainId, address, updatePositionLocal],
    ),
  };
};
