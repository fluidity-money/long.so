import { create } from "zustand";
import { Token, DefaultToken, fUSDC } from "@/config/tokens";
import {
  MIN_TICK,
  MAX_TICK,
  getTickAtSqrtRatio,
  encodeSqrtPrice } from "@/lib/math";

interface StakeStore {
  multiSingleToken: "multi" | "single";
  setMultiSingleToken: (multiSingleToken: "multi" | "single") => void;

  token0: Token;
  setToken0: (token: Token) => void;

  token1: Token;
  setToken1: (token: Token) => void;

  token0Amount: string;
  token1Amount: string;
  setToken0Amount: (token0Amount: string) => void;
  setToken1Amount: (token1Amount: string) => void;

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
  setToken0Amount: (token0Amount) => set({ token0Amount }),
  setToken1Amount: (token1Amount) => set({ token1Amount }),

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
