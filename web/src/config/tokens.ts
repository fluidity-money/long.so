export type Token = {
  name: string;
  address: `0x${string}`;
  symbol: string;
};

export const fUSDC: Token = {
  name: "fUSDC",
  address: "0x0fFC26C47FeD8C54AF2f0872cc51d79D173730a8",
  symbol: "fUSDC",
};

export const DefaultToken: Token = {
  name: "",
  address: "0x0000000000000000000000000000000000000000",
  symbol: "",
};

export const mockTokens: Token[] = [DefaultToken];
