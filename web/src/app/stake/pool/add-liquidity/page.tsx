"use client";

import { StakeForm } from "@/components/StakeForm";
import { useParams } from "next/navigation";

export default function CreatePoolPage() {
  const params = useParams();

  return <StakeForm mode="existing" poolId={params.id as string} />;
}
