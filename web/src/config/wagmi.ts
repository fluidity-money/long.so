"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { http, HttpTransport } from "viem";
import * as chains from "./chains";
import appConfig from "./app";

const testnetTransports = chains.allTestnets.reduce(
  (acc, chain) => {
    acc[chain.id] = http(chain.rpcUrls.default.http[0]);
    return acc;
  },
  {} as Record<number, HttpTransport>,
);

const wagmiConfig = defaultWagmiConfig({
  chains: chains.allTestnets,
  projectId: process.env.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
  transports: testnetTransports,
  metadata: appConfig.metadata,
  ssr: true,
});

export default wagmiConfig;
