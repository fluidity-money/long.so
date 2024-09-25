"use client";

import React, { ReactNode } from "react";
import appConfig from "@/config";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";
import ContextInjector from "./contextInjector";

// Setup queryClient
export const queryClient = new QueryClient();

// Create modal
createWeb3Modal({
  wagmiConfig: appConfig.wagmiConfig,
  projectId: appConfig.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={appConfig.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ContextInjector />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
