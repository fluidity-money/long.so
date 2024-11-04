export const mockSwapExploreAssets = () => {
  const token = {
    symbol: "USDC",
    address: "0x" as const,
    name: "USD Coin",
    decimals: 6,
  };
  return [
    {
      ...token,
      amount: 0.000846,
      amountUSD: 765.22,
      token,
    },
  ];
};

export const mockHighestRewarders = mockSwapExploreAssets;
