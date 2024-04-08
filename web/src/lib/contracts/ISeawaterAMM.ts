import { getContract } from "viem";
import { output } from "@/lib/abi/ISeawaterAMM";
import { publicClient } from "@/lib/publicClient";

export const ISeawaterAMM = getContract({
  address: "0x6b3a8A49FA004757B72AbF111CC5fE1e4869dF2e",
  abi: output.abi,
  client: publicClient,
});
