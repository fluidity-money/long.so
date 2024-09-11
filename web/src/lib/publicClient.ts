import { createPublicClient, http } from "viem";
import { superpositionTestnet } from "../config/chains";

export const publicClient = createPublicClient({
  chain: superpositionTestnet,
  transport: http(),
});
