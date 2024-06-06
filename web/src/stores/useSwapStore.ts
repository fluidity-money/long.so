import { create } from "zustand";
import { Token, fUSDC, DefaultToken } from "@/config/tokens";
import { getFormattedStringFromTokenAmount, getTokenAmountFromFormattedString } from "@/lib/amounts";

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

  setToken0AmountRaw: (amountRaw: string) => void;
  setToken1AmountRaw: (amountRaw: string) => void;
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

  setToken0AmountRaw: (amountRaw: string) => set(({ token0 }) => ({
    token0AmountRaw: amountRaw,
    token0Amount: getFormattedStringFromTokenAmount(amountRaw, token0.decimals),
  })),
  setToken1AmountRaw: (amountRaw: string) => set(({ token1 }) => ({
    token1AmountRaw: amountRaw,
    token1Amount: getFormattedStringFromTokenAmount(amountRaw, token1.decimals),
  })),

  setToken0Amount: (amount, balance) => {
    set(({ token0, token0Amount, setToken0AmountRaw }) => {
      const validNumber = !amount.includes(" ") && !isNaN(Number(amount)) || amount === "."
      try {
        const amountRaw = getTokenAmountFromFormattedString(amount, token0.decimals)
        const balanceRaw = getTokenAmountFromFormattedString(balance ?? "", token0.decimals)
        // update raw amount if it doesn't exceed balance
        if (!balance || amountRaw <= balanceRaw)
          setToken0AmountRaw(amountRaw.toString())
      } catch { }
      // update display amount if `amount` is valid as a display number
      return { token0Amount: validNumber ? amount : token0Amount }
    })
  },
  setToken1Amount: (amount, balance) => {
    set(({ token1, token1Amount, setToken1AmountRaw }) => {
      const validNumber = !amount.includes(" ") && !isNaN(Number(amount)) || amount === "."
      try {
        const amountRaw = getTokenAmountFromFormattedString(amount, token1.decimals)
        const balanceRaw = getTokenAmountFromFormattedString(balance ?? "", token1.decimals)
        // update raw amount if it doesn't exceed balance
        if (!balance || amountRaw <= balanceRaw)
          setToken1AmountRaw(amountRaw.toString())
      } catch { }
      // update display amount if `amount` is valid as a display number
      return { token1Amount: validNumber ? amount : token1Amount }
    })
  },
}));
