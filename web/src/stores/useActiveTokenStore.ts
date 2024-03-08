import create from "zustand";
import { Hash, isHex } from "viem";
import { ZeroAddress } from "../util/chainUtils";
import { decimalsFromAddress, TokenList } from "../util/tokens";

/**
 * Manages the state for the active token pair.
 */
export const useActiveTokenStore = create<{
  token0: Hash;
  token1: Hash;
  decimals0: number;
  decimals1: number;
  setToken0: (token: Hash) => void;
  setToken1: (token: Hash) => void;
  flipTokens: () => void;
  tokenList: typeof TokenList;
  ammAddress: Hash;
}>((set, get) => ({
  token0: ZeroAddress,
  token1: ZeroAddress,
  decimals0: 0,
  decimals1: 0,
  tokenList: TokenList,
  ammAddress: ZeroAddress,
  setToken0: (token) =>
    isHex(token) &&
    set({ token0: token, decimals0: decimalsFromAddress(token) }),
  setToken1: (token) =>
    isHex(token) &&
    set({ token1: token, decimals1: decimalsFromAddress(token) }),
  flipTokens: () => {
    const { token0, token1 } = get();
    set({ token0: token1, token1: token0 });
  },
}));
