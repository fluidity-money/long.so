import { create } from "zustand";
import { Token, fUSDC, DefaultToken } from "@/config/tokens";

interface SwapStore {
  token0: Token;
  token1: Token;

  setToken0: (token: Token) => void;
  setToken1: (token: Token) => void;
  flipTokens: () => void;

  token0Amount?: string;
  token1Amount?: string;

  setToken0Amount: (amount: string) => void;
  setToken1Amount: (amount: string) => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  token0: fUSDC,
  token1: DefaultToken,

  setToken0: (token) => set({ token0: token }),
  setToken1: (token) => set({ token1: token }),
  flipTokens: () =>
    set(({ token0, token1, token1Amount, token0Amount }) => ({
      token0: token1,
      token1: token0,
      token0Amount: token1Amount,
      token1Amount: token0Amount,
    })),

  token0Amount: undefined,
  token1Amount: "0.87",

  setToken0Amount: (amount) => set({ token0Amount: amount }),
  setToken1Amount: (amount) => set({ token1Amount: amount }),
}));
