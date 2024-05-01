"use client";

import { useQuery } from "@tanstack/react-query";

export const useFeatureFlag = (featureFlag: string): boolean => {
  const { data } = useQuery({
    queryKey: ["featureFlags"],
    queryFn: async () => {
      const response = await fetch("https://features.long.so/features.json");
      return response.json();
    },
  });

  return data?.[featureFlag] ?? false;
};
