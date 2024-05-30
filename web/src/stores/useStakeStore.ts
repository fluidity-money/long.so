import { create } from "zustand";
import { Token, DefaultToken, fUSDC } from "@/config/tokens";
import {
  MIN_TICK,
  MAX_TICK,
  getTickAtSqrtRatio,
  encodeSqrtPrice } from "@/lib/math";
import { getFormattedStringFromTokenAmount, getTokenAmountFromFormattedString } from "@/lib/amounts";

interface StakeStore {
  multiSingleToken: "multi" | "single";
  setMultiSingleToken: (multiSingleToken: "multi" | "single") => void;

  token0: Token;
  setToken0: (token: Token) => void;

  token1: Token;
  setToken1: (token: Token) => void;

  token0Amount: string;
  token1Amount: string;

  token0AmountRaw: string;
  token1AmountRaw: string;

  // parse and set from a display amount
  setToken0Amount: (amount: string, balance?: string) => void;
  setToken1Amount: (amount: string, balance?: string) => void;

  setToken0AmountRaw: (amountRaw: string) => void;
  setToken1AmountRaw: (amountRaw: string) => void;

  tickLower: number | undefined;
  tickUpper: number | undefined;

  priceLower: string;
  priceUpper: string;

  setPriceLower: (tick: string) => void;
  setPriceUpper: (tick: string) => void;
}

export const useStakeStore = create<StakeStore>((set) => ({
  multiSingleToken: "multi",
  setMultiSingleToken: (multiSingleToken) => set({ multiSingleToken }),

  token0: DefaultToken,
  setToken0: (token0) => set({ token0 }),

  token1: fUSDC,
  setToken1: (token1) => set({ token1 }),

  token0Amount: "",
  token1Amount: "",
  token0AmountRaw: "",
  token1AmountRaw: "",
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
      const validNumber = !isNaN(Number(amount)) || amount === "."
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
      const validNumber = !isNaN(Number(amount)) || amount === "."
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

  tickLower: MIN_TICK,
  tickUpper: MAX_TICK,

  priceLower: "0",
  priceUpper: "0",

  setPriceLower: (price) => {
    // Make a best effort to convert the number to a sqrt price, then to a tick.
    const priceN = Number(price);
    const tick = getTickAtSqrtRatio(encodeSqrtPrice(priceN));
    console.log("tick", tick);
    set({
      tickLower: tick,
      priceLower: price
    });
  },
  setPriceUpper: (price) => {
    const priceN = Number(price);
    const tick = getTickAtSqrtRatio(encodeSqrtPrice(priceN));
    set({
      tickUpper: tick,
      priceUpper: price
    });
  },
}));
