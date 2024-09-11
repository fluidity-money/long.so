import { createPublicClient, http } from "viem";
import { arbitrumStylusTestnet } from "../config/networks";

export const publicClient = createPublicClient({
  chain: arbitrumStylusTestnet,
  transport: http(),
});
