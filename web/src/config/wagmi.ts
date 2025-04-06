"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { http, HttpTransport } from "viem";
import * as chains from "./chains";
import appConfig from "./app";

const transports = chains.allChains.reduce(
  (acc, chain) => {
    acc[chain.id] = http(chain.rpcUrls.default.http[0]);
    return acc;
  },
  {} as Record<number, HttpTransport>,
);
const wagmiBaseConfig = {
  networks: chains.allChains,
  projectId: process.env.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
  metadata: appConfig.metadata,
  transports,
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
};
export const wagmiAdapter = new WagmiAdapter(wagmiBaseConfig);

export default wagmiAdapter.wagmiConfig;
