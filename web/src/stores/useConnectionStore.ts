import { create } from "zustand";

interface ConnectionStore {
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected }),
}));
