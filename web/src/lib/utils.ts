import { Token } from "@/config/tokens";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Log } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EmptyToken: Token = {
  symbol: "",
  name: "",
  address: "0x",
  decimals: 0,
};

export const TransferTopic =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" as const;

// getAmountFromMaybeTransfer to search logs for a transfer event, maybe filtering by an address, then returning the amount as found in the log's data
export const getAmountFromMaybeTransfer = (logs?: Log[], address?: string) => {
  const log = logs?.find(
    (l) =>
      l.topics.at(0) === TransferTopic &&
      (address ? l.address === address : true),
  );
  return BigInt(log?.data ?? 0n);
};
