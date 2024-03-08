import create from "zustand";

export const useWelcomeStore = create<{
  welcome: boolean;
  setWelcome: (welcome: boolean) => void;
}>((set) => ({
  welcome: true,
  setWelcome: (welcome) => set({ welcome }),
}));
