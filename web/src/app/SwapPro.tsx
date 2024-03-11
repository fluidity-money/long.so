"use client";

import { useSwapPro } from "@/stores/useSwapPro";

export const SwapPro = () => {
  const { swapPro, setSwapPro } = useSwapPro();

  if (!swapPro) return null;

  return <div>test</div>;
};
