"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFeatureFlagOverride } from "@/hooks/useFeatureFlagOverride";

export interface FeatureFlags {
  /**
   * Show demo data in the UI.
   * When set to `false`, the UI will fetch data from the GraphQL API.
   */
  "ui show demo data": boolean;

  /**
   * Use mock data for the GraphQL API.
   * This is not used in the web app.
   */
  "graphql mock demo data": boolean;

  /**
   * Show options to pick fee tier in the staking form.
   */
  "ui show manual fees": boolean;

  /**
   * Show the feature flags panel in the UI.
   */
  "ui show feature flags panel": boolean;

  /**
   * Show the Superloop aggregator Popover in the UI.
   */
  "ui show superloop": boolean;

  /**
   * Show the fee tier display in the Stake interface.
   */
  "ui show fee tier": boolean;

  /**
   * Show the optimising fee route mention.
   */
  "ui show optimising fee route": boolean;

  /**
   * Show the "Single-Token" option in the stake form. This implies a swap into the second
   * asset, which may not be supported.
   */
  "ui show single token stake": boolean;

  /**
   * Show the campaign banner with information like a countdown.
   */
  "ui show campaign banner": boolean;
}

/**
 * Fetches feature flags from the features API.
 *
 * @param featureFlag The feature flag to fetch
 * @returns The value of the feature flag
 */
export const useFeatureFlag = <T extends keyof FeatureFlags>(
  featureFlag: T,
): FeatureFlags[T] => {
  const override = useFeatureFlagOverride((s) => s.override);
  const featureFlagOverride = useFeatureFlagOverride((s) => s.featureFlags);

  const { data } = useQuery({
    queryKey: ["featureFlags"],
    queryFn: async () => {
      const response = await fetch("https://features.long.so/features.json");
      return response.json();
    },
  });

  /**
   * If override is enabled, return the value from the override.
   * Otherwise, return the value from the API.
   */
  return useMemo(() => {
    if (override) return featureFlagOverride[featureFlag];
    return data?.[featureFlag];
  }, [override, featureFlagOverride, data, featureFlag]);
};
