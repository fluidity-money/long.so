import { create } from "zustand";
import { FeatureFlags } from "@/hooks/useFeatureFlag";

/**
 * Zustand hook to override feature flags for local development.
 */
export const useFeatureFlagOverride = create<{
  override: boolean;
  setOverride: (value: boolean) => void;
  featureFlags: Partial<FeatureFlags>;
  setFeatureFlagOverride: (
    featureFlag: keyof FeatureFlags,
    value: boolean,
  ) => void;
}>((set) => ({
  override: false,
  setOverride: (value) => set({ override: value }),
  featureFlags: {},
  setFeatureFlagOverride: (featureFlag, value) =>
    set((state) => ({
      featureFlags: {
        ...state.featureFlags,
        [featureFlag]: value,
      },
    })),
}));
