"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface FeatureFlags {
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
}

/**
 * Override feature flags for local development
 */
const developmentOverride: Partial<FeatureFlags> = {
  "ui show demo data": true,
};

/**
 * Fetches feature flags from the features API.
 *
 * @param featureFlag The feature flag to fetch
 * @returns The value of the feature flag
 */
export const useFeatureFlag = <T extends keyof FeatureFlags>(
  featureFlag: T,
): FeatureFlags[T] => {
  const { data } = useQuery({
    queryKey: ["featureFlags"],
    queryFn: async () => {
      const response = await fetch("https://features.long.so/features.json");
      return response.json();
    },
  });

  /**
   * Determine the value of the feature flag.
   * This overrides the feature flag in development.
   */
  const flag = useMemo(() => {
    // if we are running in development
    if (process.env.NODE_ENV === "development") {
      return developmentOverride[featureFlag] ?? data?.[featureFlag];
    }

    // if we are running in production
    return data?.[featureFlag];
  }, [data, featureFlag]);

  return flag;
};
