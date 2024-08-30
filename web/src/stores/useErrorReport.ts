import { create } from "zustand";

interface ErrorReportingStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error: unknown | null;
  setError: (error: unknown) => void;
}

export const useErrorReportingStore = create<ErrorReportingStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  error: null,
  setError: (error: unknown) => set({ error }),
}));
