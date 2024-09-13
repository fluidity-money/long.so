import { ChainIdTypes, mockTokens } from "@/config/tokens";

export const mockSwapExploreAssets = (chainId: ChainIdTypes) =>
  mockTokens(chainId).map((token) => ({
    symbol: token.symbol,
    address: token.address,
    name: token.name,
    amount: 0.000846,
    amountUSD: 765.22,
    token,
  }));

export const mockHighestRewarders = mockSwapExploreAssets;
