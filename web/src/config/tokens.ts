export type Token = {
  name: string;
  address: `0x${string}`;
  symbol: string;
};

/**
 * The list of tokens which can be staked or swapped
 */
export const tokens: Token[] = [
  {
    name: "Stylus",
    address: "0x441cfB692518bD523664448E1561DbCeAC06fD4b",
    symbol: "STYLE",
  },
  {
    name: "Stylus 2",
    address: "0xE6ABce31f9B25A5f50790d0FdE963791837c9c97",
    symbol: "STYLE2",
  },
];
