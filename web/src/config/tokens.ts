export type Token = {
  name: string;
  address: `0x${string}`;
  symbol: string;
};

export const fUSDC: Token = {
  name: "fUSDC",
  address: "0xA8EA92c819463EFbEdDFB670FEfC881A480f0115",
  symbol: "fUSDC",
};

export const DefaultToken: Token = {
  name: "SWG",
  address: "0xe984f758f362d255bd96601929970cef9ff19dd7",
  symbol: "S",
};

export const mockTokens: Token[] = [DefaultToken];
