import LightweightERC20 from "@/config/abi/LightweightERC20";
import { Token } from "@/config/tokens";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EmptyToken: Token = {
  symbol: "",
  name: "",
  address: "0x",
  decimals: 0,
};
