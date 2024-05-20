import { create } from "zustand";
import { Token, tokens } from "@/config/tokens";
import { MIN_TICK, MAX_TICK } from "@/lib/math";

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

  tickLower: number;
  tickUpper: number;
  setTickLower: (tick: number) => void;
  setTickUpper: (tick: number) => void;
}

export const useStakeStore = create<StakeStore>((set) => ({
  multiSingleToken: "multi",
  setMultiSingleToken: (multiSingleToken) => set({ multiSingleToken }),

  token0: tokens[1],
  setToken0: (token0) => set({ token0 }),

  token1: tokens[0],
  setToken1: (token1) => set({ token1 }),

  token0Amount: "",
  token1Amount: "",
  setToken0Amount: (token0Amount) => set({ token0Amount }),
  setToken1Amount: (token1Amount) => set({ token1Amount }),

  tickLower: MIN_TICK,
  tickUpper: MAX_TICK,
  setTickLower: (tick) => set({ tickLower: tick }),
  setTickUpper: (tick) => set({ tickUpper: tick }),
}));
