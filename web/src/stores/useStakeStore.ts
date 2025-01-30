import { create } from "zustand";
import { Token } from "@/config/tokens";
import {
  MIN_TICK,
  MAX_TICK,
  getTickAtSqrtRatio,
  encodeSqrtPrice,
  getTokenAmountsNumeric,
  getSqrtRatioAtTick,
} from "@/lib/math";
import {
  getFormattedStringFromTokenAmount,
  getTokenAmountFromFormattedString,
} from "@/lib/amounts";
import { EmptyToken } from "@/lib/utils";
import { EVENTS, track } from "@/lib/analytics";

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

  token0AmountExceedsBalance: boolean;
  token1AmountExceedsBalance: boolean;

  // parse and set from a display amount
  setToken0Amount: (amount: string, balanceRaw?: string) => void;
  setToken1Amount: (amount: string, balanceRaw?: string) => void;

  setToken0AmountRaw: (amountRaw: string, balanceRaw?: string) => void;
  setToken1AmountRaw: (amountRaw: string, balanceRaw?: string) => void;

  tickLower: number | undefined;
  tickUpper: number | undefined;

  setTickLower: (tick: number) => void;
  setTickUpper: (tick: number) => void;

  // raw internal value
  delta: bigint;

  // input field
  deltaDisplay: string;
  // @param value: USD value of delta to set
  // @param tick: current tick of the pool
  // @param balance: Raw liquidity balance of the position
  // @param balanceUsd: `balance` scaled to USD using the token price
  setDelta: (
    value: string,
    tick: bigint,
    balance: bigint,
    balanceUsd: number,
  ) => void;

  priceLower: string;
  priceUpper: string;

  // parse and set from a display amount
  setPriceLower: (
    tick: string,
    decimals: number,
    fusdcDecimals?: number,
  ) => void;
  setPriceUpper: (
    tick: string,
    decimals: number,
    fusdcDecimals?: number,
  ) => void;

  // fee Percentage taken from graph
  feePercentage: number;
  setFeePercentage: (fee: number) => void;
}

export const useStakeStore = create<StakeStore>((set) => ({
  multiSingleToken: "multi",
  setMultiSingleToken: (multiSingleToken) => set({ multiSingleToken }),

  token0: EmptyToken,
  // changing token invalidates all amounts
  setToken0: (token0) =>
    set(({ token1 }) => {
      track(EVENTS.TOKENS_CHANGED, {
        type: "stake",
        from_token: token1.address,
        to_token: token0.address,
      });
      return {
        token0,
        token0Amount: "0",
        token0AmountRaw: "0",
        token1Amount: "0",
        token1AmountRaw: "0",
      };
    }),

  token1: EmptyToken,
  // changing token invalidates all amounts
  setToken1: (token1) =>
    set(({ token0 }) => {
      track(EVENTS.TOKENS_CHANGED, {
        type: "stake",
        from_token: token1.address,
        to_token: token0.address,
      });
      return {
        token1,
        token0Amount: "0",
        token0AmountRaw: "0",
        token1Amount: "0",
        token1AmountRaw: "0",
      };
    }),

  token0Amount: "",
  token1Amount: "",
  token0AmountRaw: "",
  token1AmountRaw: "",
  token0AmountExceedsBalance: false,
  token1AmountExceedsBalance: false,
  setToken0AmountRaw: (amountRaw: string, balanceRaw?: string) => {
    if (balanceRaw && BigInt(amountRaw) > BigInt(balanceRaw)) {
      set(({ token0 }) => ({
        token0AmountExceedsBalance: true,
        token0Amount: getFormattedStringFromTokenAmount(
          amountRaw,
          token0.decimals,
        ),
      }));
      return;
    }
    set(({ token0 }) => ({
      token0AmountExceedsBalance: false,
      token0AmountRaw: amountRaw,
      token0Amount: getFormattedStringFromTokenAmount(
        amountRaw,
        token0.decimals,
      ),
    }));
  },
  setToken1AmountRaw: (amountRaw: string, balanceRaw?: string) => {
    if (balanceRaw && BigInt(amountRaw) > BigInt(balanceRaw)) {
      set(({ token1 }) => ({
        token1AmountExceedsBalance: true,
        token1Amount: getFormattedStringFromTokenAmount(
          amountRaw,
          token1.decimals,
        ),
      }));
      return;
    }
    set(({ token1 }) => ({
      token1AmountExceedsBalance: false,
      token1AmountRaw: amountRaw,
      token1Amount: getFormattedStringFromTokenAmount(
        amountRaw,
        token1.decimals,
      ),
    }));
  },
  setToken0Amount: (amount, balanceRaw) => {
    set(({ token0, token0Amount, setToken0AmountRaw }) => {
      const validNumber =
        (!amount.includes(" ") && !isNaN(Number(amount))) || amount === ".";
      // update display amount if `amount` is valid as a display number
      if (!validNumber)
        return { token0Amount, token0AmountExceedsBalance: false };
      let exceedsBalance = false;
      try {
        const amountRaw = getTokenAmountFromFormattedString(
          amount,
          token0.decimals,
        );
        // update raw amount if it doesn't exceed balance
        if (!balanceRaw || amountRaw <= BigInt(balanceRaw))
          setToken0AmountRaw(amountRaw.toString());
        else exceedsBalance = true;
      } catch {}
      return {
        token0Amount: amount,
        token0AmountExceedsBalance: exceedsBalance,
      };
    });
  },
  setToken1Amount: (amount, balanceRaw) => {
    set(({ token1, token1Amount, setToken1AmountRaw }) => {
      const validNumber =
        (!amount.includes(" ") && !isNaN(Number(amount))) || amount === ".";
      // update display amount if `amount` is valid as a display number
      if (!validNumber) return { token1Amount };
      let exceedsBalance = false;
      try {
        const amountRaw = getTokenAmountFromFormattedString(
          amount,
          token1.decimals,
        );
        // update raw amount if it doesn't exceed balance
        if (!balanceRaw || amountRaw <= BigInt(balanceRaw))
          setToken1AmountRaw(amountRaw.toString());
        else exceedsBalance = true;
      } catch {}
      return {
        token1Amount: amount,
        token1AmountExceedsBalance: exceedsBalance,
      };
    });
  },

  tickLower: MIN_TICK,
  tickUpper: MAX_TICK,

  setTickLower: (tick) => set({ tickLower: tick }),
  setTickUpper: (tick) => set({ tickUpper: tick }),

  delta: 0n,
  deltaDisplay: "0",
  setDelta: (usdInput, tick, balance, balanceUsd) => {
    const validNumber = !usdInput.includes(" ") && !isNaN(Number(usdInput));
    // update display amount if `amount` is valid as a display number
    if (!validNumber) return;
    // always set the display value for input components
    set({ deltaDisplay: usdInput });

    // find the liquidity by finding the ratio between the input and balance (both in USD - we can't use the raw balance since the input is in USD), then scaling the raw balance by the ratio
    const ratio = balanceUsd / parseFloat(usdInput);
    const liquidity = (Number(balance) / ratio).toFixed(0);

    set(({ tickLower, tickUpper, setToken0AmountRaw, setToken1AmountRaw }) => {
      if (tickLower === undefined || tickUpper === undefined) return {};
      // try to derive the new delta and token amounts
      try {
        const delta = BigInt(liquidity);
        const [amount0, amount1] = getTokenAmountsNumeric(
          Number(delta),
          Number(getSqrtRatioAtTick(tick)),
          tickLower,
          tickUpper,
        );
        if (delta <= balance) {
          setToken0AmountRaw(amount0.toString());
          setToken1AmountRaw(amount1.toString());
          return { delta };
        }
      } catch {}
      return {};
    });
  },

  priceLower: "0",
  priceUpper: "0",

  setPriceLower: (price, decimals, fusdcDecimals = 6) => {
    const validNumber =
      (!price.includes(" ") && !isNaN(Number(price))) || price === ".";
    // update display amount if `amount` is valid as a display number
    if (!validNumber) return;
    // Make a best effort to convert the number to a sqrt price, then to a tick.
    const rawPrice = getTokenAmountFromFormattedString(price, fusdcDecimals);
    const priceN = Number(rawPrice);
    let tick = 0;
    try {
      const newTick = getTickAtSqrtRatio(
        encodeSqrtPrice(priceN * 10 ** -decimals),
      );
      tick = newTick;
    } catch {}
    set({
      tickLower: tick,
      priceLower: price,
    });
  },
  setPriceUpper: (price, decimals, fusdcDecimals = 6) => {
    const validNumber =
      (!price.includes(" ") && !isNaN(Number(price))) || price === ".";
    // update display amount if `amount` is valid as a display number
    if (!validNumber) return;

    const rawPrice = getTokenAmountFromFormattedString(price, fusdcDecimals);
    const priceN = Number(rawPrice);
    let tick = 0;
    try {
      const newTick = getTickAtSqrtRatio(
        encodeSqrtPrice(priceN * 10 ** -decimals),
      );
      tick = newTick;
    } catch {}
    set({
      tickUpper: tick,
      priceUpper: price,
    });
  },
  feePercentage: 0,
  setFeePercentage: (fee) => set({ feePercentage: 100 / fee }),
}));
