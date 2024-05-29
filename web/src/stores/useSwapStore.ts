import { create } from "zustand";
import { Token, fUSDC, DefaultToken } from "@/config/tokens";
import { getTokenAmountFromFormattedString } from "@/lib/amounts";

interface SwapStore {
  token0: Token;
  token1: Token;

  setToken0: (token: Token) => void;
  setToken1: (token: Token) => void;
  flipTokens: () => void;

  // raw token amounts to be passed to the contract
  token0AmountRaw?: string;
  token1AmountRaw?: string;

  // display token amounts to be shown to a user
  token0Amount?: string;
  token1Amount?: string;

  // parse and set from a display amount
  setToken0Amount: (amount: string, balance?: string) => void;
  setToken1Amount: (amount: string, balance?: string) => void;

  setToken0AmountRaw: (amountRaw: string, amount: string) => void;
  setToken1AmountRaw: (amountRaw: string, amount: string) => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  token0: fUSDC,
  token1: DefaultToken,

  setToken0: (token) => set({ token0: token }),
  setToken1: (token) => set({ token1: token }),
  flipTokens: () => {
    set(({ token0, token1, token1Amount, token0Amount, token0AmountRaw, token1AmountRaw }) => ({
      token0: token1,
      token1: token0,
      token0Amount: token1Amount,
      token1Amount: token0Amount,
      token0AmountRaw: token1AmountRaw,
      token1AmountRaw: token0AmountRaw,
    }))
  },

  token0AmountRaw: undefined,
  token1AmountRaw: "0.87",

  setToken0AmountRaw: (amountRaw: string, amount: string) => set({
    token0AmountRaw: amountRaw,
    token0Amount: amount,
  }),
  setToken1AmountRaw: (amountRaw: string, amount: string) => set({
    token1AmountRaw: amountRaw,
    token1Amount: amount,
  }),

  setToken0Amount: (amount, balance) => {
    set(({ token0, setToken0AmountRaw }) => {
      try {
        const a = getTokenAmountFromFormattedString(amount, token0.decimals)
        const b = getTokenAmountFromFormattedString(balance ?? "", token0.decimals)
        if (!balance || a <= b)
          setToken0AmountRaw(a.toString(), amount)
      } catch { }
      return { token0 }
    })
  },
  setToken1Amount: (amount, balance) => {
    set(({ token1, setToken1AmountRaw }) => {
      try {
        const a = getTokenAmountFromFormattedString(amount, token1.decimals)
        const b = getTokenAmountFromFormattedString(balance ?? "", token1.decimals)
        if (!balance || a <= b)
          setToken1AmountRaw(a.toString(), amount)
      } catch { }
      return { token1 }
    })
  },
}));
