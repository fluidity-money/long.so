"use client";

import { StakeForm } from "@/components/StakeForm";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreatePoolPage() {
  const params = useSearchParams();
  const positionId_ = params.get("positionId");
  const positionId = positionId_ ? Number(positionId_) : undefined;
  const poolId = params.get("id");
  const router = useRouter();

  useEffect(() => {
    if (!positionId || !poolId) {
      router.push("/stake");
    }
  }, [poolId, positionId, router]);

  if (!positionId || !poolId) return null;

  return (
    <StakeForm
      mode="existing"
      poolId={poolId ?? ""}
      positionId={positionId ?? 0}
    />
  );
}
