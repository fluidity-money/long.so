"use client";

import { ConfirmStake } from "@/components/ConfirmStake";
import { useSearchParams } from "next/navigation";

export default function ConfirmCreatePool() {
  const params = useSearchParams();
  const isVested = params.get("isVested") === "true";

  return <ConfirmStake mode="new" vesting={isVested} />;
}
