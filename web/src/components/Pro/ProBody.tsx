"use client";
import { Suspense } from "react";

import DataScene from "./DataScene";
import Chart from "./Chart";

export default function ProBody({ quoteToken }: { quoteToken: string }) {
  return (
    <>
      <div className="flex grow items-center justify-center rounded-lg bg-white/10 text-white">
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart quoteToken={quoteToken} />
        </Suspense>
      </div>
      <div className="flex h-[300px]">
        <Suspense fallback={<div>Loading tables...</div>}>
          <DataScene />
        </Suspense>
      </div>
    </>
  );
}
