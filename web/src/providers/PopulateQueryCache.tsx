"use client";
//

import { useCallback, useEffect } from "react";
import request from "graphql-request";
import { graphqlQueryGlobal } from "@/hooks/useGraphql";
import { useChainId } from "wagmi";
import { useChain } from "@/config/chains";
import { useQueryClient } from "@tanstack/react-query";

/**
 * This component is used to populate the query cache with the data fetched from the server.
 * To use this fetch the data from the server in a server component and pass it to this component.
 */
export default function PopulateQueryCache({
  featuresData,
}: {
  featuresData: any;
}) {
  const chainId = useChainId();
  const chain = useChain(chainId);
  const queryClient = useQueryClient();
  useEffect(() => {
    chain.gqlUrl &&
      chainId &&
      queryClient &&
      (async function () {
        const data = await request(chain.gqlUrl, graphqlQueryGlobal);
        queryClient.setQueryData(["graphql", chainId], data);
      })();
  }, [chain.gqlUrl, chainId, queryClient]);

  useEffect(() => {
    // using the same query key as in useFeatureFlag.tsx
    queryClient.setQueryData(["featureFlags"], featuresData);
  }, [featuresData, queryClient]);

  return null;
}
