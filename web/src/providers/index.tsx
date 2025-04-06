"use client";

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContextInjector from "./contextInjector";
import PostHogProvider from "./postHog";
import PopulateQueryCache from "./PopulateQueryCache";
import WagmiProvider from "./wagmi";

export default function Provider({
  children,
  featuresData,
  cookies,
}: {
  children: ReactNode;
  featuresData: any;
  cookies: string | null;
}) {
  const [queryClient] = useState(new QueryClient());

  return (
    <WagmiProvider cookies={cookies}>
      <QueryClientProvider client={queryClient}>
        <PostHogProvider>
          <ContextInjector />
          <PopulateQueryCache featuresData={featuresData} />
          {children}
        </PostHogProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
