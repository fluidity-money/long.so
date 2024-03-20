import { create } from "zustand";

interface WelcomeStore {
  /**
   * Whether the welcome screen is visible
   */
  welcome: boolean;

  /**
   * Set the welcome screen visibility
   * @param welcome
   */
  setWelcome: (welcome: boolean) => void;

  /**
   * Whether the yield breakdown screen is visible
   */
  yieldBreakdown: boolean;

  /**
   * Set the yield breakdown screen visibility
   * @param yieldBreakdown
   */
  setYieldBreakdown: (yieldBreakdown: boolean) => void;
}

export const useStakeWelcomeBackStore = create<WelcomeStore>((set) => ({
  welcome: true,
  setWelcome: (welcome) => set({ welcome }),

  yieldBreakdown: false,
  setYieldBreakdown: (yieldBreakdown) => set({ yieldBreakdown }),
}));
