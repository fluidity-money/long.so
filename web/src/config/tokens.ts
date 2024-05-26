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
  name: "",
  address: "0x0000000000000000000000000000000000000000",
  symbol: "",
};

export const mockTokens: Token[] = [DefaultToken];
