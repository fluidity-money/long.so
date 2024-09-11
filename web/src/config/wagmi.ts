"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { http } from "viem";
import * as chains from "./chains";
import appConfig from "./app";

const wagmiConfig = defaultWagmiConfig({
  chains: chains.allTestnets,
  projectId: process.env.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
  transports: {
    [chains.superpositionTestnet.id]: http(
      chains.superpositionTestnet.rpcUrls.default.http[0],
    ),
  },
  metadata: appConfig.metadata,
  ssr: true,
});

export default wagmiConfig;
