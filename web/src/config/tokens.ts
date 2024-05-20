export type Token = {
  name: string;
  address: `0x${string}`;
  symbol: string;
};

export const fUSDC: Token = {
  name: "test-token-1",
  address: "0x0fFC26C47FeD8C54AF2f0872cc51d79D173730a8",
  symbol: "TT1",
};

/**
 * The list of tokens which can be staked or swapped
 */
export const tokens: Token[] = [
  fUSDC,
  {
    name: "test-token-2",
    address: "0x77bE2Fa1Af6a366D6f7dB166268E46614EA8DD92",
    symbol: "TT2",
  },
  {
    name: "test-token-3",
    address: "0xBEf8358A102Ee25157dcda535AaAa752927932BA",
    symbol: "TT3",
  }
];
