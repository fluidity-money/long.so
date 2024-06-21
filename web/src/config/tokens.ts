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

export const USDC: Token = {
  name: "USD Coin",
  address: "0x6437fdc89ced41941b97a9f1f8992d88718c81c5",
  symbol: "USDC",
  decimals: 6,
}

export const WETH: Token = {
  name: "Wrapped Ethereum",
  address: "0xde104342b32bca03ec995f999181f7cf1ffc04d7",
  symbol: "WETH",
  decimals: 18,
}

export const WSPN: Token = {
  name: "Wrapped Superposition",
  address: "0x22b9fa698b68bba071b513959794e9a47d19214c",
  symbol: "WSPN",
  decimals: 18,
}

const allTokens: Token[] = [
  fUSDC,
  USDC,
  WSPN,
  WETH,
];

export const DefaultToken = USDC;

export const getTokenFromAddress = (address_: string): Token | undefined =>
  allTokens.find(({ address }) => address === address_)

export const mockTokens: Token[] = [DefaultToken];
