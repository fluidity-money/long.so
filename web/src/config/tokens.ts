export type Token = {
  name: string;
  address: `0x${string}`;
  symbol: string;
};

export const fUSDC: Token = {
  name: "Fluid Token",
  address: "0x9A8c1806087f8c4e1315AF7a2AC285334a8275ed",
  symbol: "fUSDC",
};

/**
 * The list of tokens which can be staked or swapped
 */
export const tokens: Token[] = [
  fUSDC,
  {
    name: "New Token 2",
    address: "0x65Dfe41220C438Bf069BBce9Eb66B087fe65dB36",
    symbol: "NEW_TOKEN_2",
  },
];
