import { create } from "zustand";
import { Token, tokens } from "@/config/tokens";

interface StakeStore {
  multiSingleToken: "multi" | "single";
  setMultiSingleToken: (multiSingleToken: "multi" | "single") => void;

  token0: Token;
  setToken0: (token: Token) => void;

  token0Amount: string;
  setToken0Amount: (token0Amount: string) => void;
}

export const useStakeStore = create<StakeStore>((set) => ({
  multiSingleToken: "multi",
  setMultiSingleToken: (multiSingleToken) => set({ multiSingleToken }),

  token0: tokens[0],
  setToken0: (token0) => set({ token0 }),

  token0Amount: "",
  setToken0Amount: (token0Amount) => set({ token0Amount }),
}));
