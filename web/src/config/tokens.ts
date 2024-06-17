export type Token = {
  name: string;
  address: `0x${string}`;
  symbol: string;
  decimals: number;
};

export const fUSDC: Token = {
  name: "fUSDC",
  address: "0xa8ea92c819463efbeddfb670fefc881a480f0115",
  symbol: "fUSDC",
  decimals: 6,
};

export const DefaultToken: Token = {
  name: "SWG",
  address: "0xe984f758f362d255bd96601929970cef9ff19dd7",
  symbol: "S",
  decimals: 18,
};

const allTokens: Token[] = [
  fUSDC,
  DefaultToken,
];

export const getTokenFromAddress = (address_: string): Token | undefined =>
  allTokens.find(({ address }) => address === address_)

export const mockTokens: Token[] = [DefaultToken];
