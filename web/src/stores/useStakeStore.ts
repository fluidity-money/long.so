import { create } from "zustand";
import { Token, DefaultToken, fUSDC } from "@/config/tokens";
import {
  MIN_TICK,
  MAX_TICK,
  getTickAtSqrtRatio,
  encodeSqrtPrice
} from "@/lib/math";
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

  priceLowerRaw: string;
  priceUpperRaw: string;

  // parse and set from a display amount
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
      const validNumber = !amount.includes(" ") && !isNaN(Number(amount)) || amount === "."
      // update display amount if `amount` is valid as a display number
      if (!validNumber)
        return { token0Amount }
      try {
        const amountRaw = getTokenAmountFromFormattedString(amount, token0.decimals)
        const balanceRaw = getTokenAmountFromFormattedString(balance ?? "", token0.decimals)
        // update raw amount if it doesn't exceed balance
        if (!balance || amountRaw <= balanceRaw)
          setToken0AmountRaw(amountRaw.toString())
      } catch { }
      return { token0Amount: amount }
    })
  },
  setToken1Amount: (amount, balance) => {
    set(({ token1, token1Amount, setToken1AmountRaw }) => {
      const validNumber = !amount.includes(" ") && !isNaN(Number(amount)) || amount === "."
      // update display amount if `amount` is valid as a display number
      if (!validNumber)
        return { token1Amount }
      try {
        const amountRaw = getTokenAmountFromFormattedString(amount, token1.decimals)
        const balanceRaw = getTokenAmountFromFormattedString(balance ?? "", token1.decimals)
        // update raw amount if it doesn't exceed balance
        if (!balance || amountRaw <= balanceRaw)
          setToken1AmountRaw(amountRaw.toString())
      } catch { }
      return { token1Amount: amount }
    })
  },

  tickLower: MIN_TICK,
  tickUpper: MAX_TICK,

  priceLowerRaw: "0",
  priceUpperRaw: "0",

  priceLower: "0",
  priceUpper: "0",

  setPriceLower: (price) => {
    const validNumber = !price.includes(" ") && !isNaN(Number(price)) || price === "."
    // update display amount if `amount` is valid as a display number
    if (!validNumber)
      return
    // Make a best effort to convert the number to a sqrt price, then to a tick.
    const rawPrice = getTokenAmountFromFormattedString(price, fUSDC.decimals)
    const priceN = Number(rawPrice);
    let tick = 0;
    try {
      const newTick = getTickAtSqrtRatio(encodeSqrtPrice(priceN));
      tick = newTick;
      console.log("lower tick", tick);
    } catch { }
    set({
      tickLower: tick,
      priceLowerRaw: rawPrice.toString(),
      priceLower: price,
    });
  },
  setPriceUpper: (price) => {
    const validNumber = !price.includes(" ") && !isNaN(Number(price)) || price === "."
    // update display amount if `amount` is valid as a display number
    if (!validNumber)
      return

    const rawPrice = getTokenAmountFromFormattedString(price, fUSDC.decimals)
    const priceN = Number(rawPrice);
    let tick = 0;
    try {
      const newTick = getTickAtSqrtRatio(encodeSqrtPrice(priceN));
      tick = newTick;
      console.log("upper tick", tick);
    } catch { }
    set({
      tickUpper: tick,
      priceUpperRaw: rawPrice.toString(),
      priceUpper: price,
    });
  },
}));
