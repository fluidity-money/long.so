"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { http } from "viem";
import { arbitrumStylusTestnet, sepoliaTestnet } from "./networks";
import appConfig from "./app";
// Create wagmiConfig
const chains = [arbitrumStylusTestnet, sepoliaTestnet] as const;

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: process.env.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
  transports: {
    [arbitrumStylusTestnet.id]: http(
      arbitrumStylusTestnet.rpcUrls.default.http[0],
    ),
  },
  metadata: appConfig.metadata,
  ssr: true,
});

export default wagmiConfig;
