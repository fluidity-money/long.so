"use client";

import { StakeForm } from "@/components/StakeForm";
import { useSearchParams } from "next/navigation";

export default function CreatePoolPage() {
  const params = useSearchParams()
  const positionId = params.get("positionId")

  return <StakeForm mode="existing" positionId={positionId ?? ""} />;
}
