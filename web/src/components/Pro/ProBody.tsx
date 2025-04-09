"use client";
import DataScene from "./DataScene";
import Chart from "./Chart";
import { requestGetTokenEvents } from "@/data";

export default function ProBody({
  name,
  quoteToken,
  poolAddress,
  initialData,
}: {
  name: string;
  quoteToken: "0" | "1";
  poolAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
}) {
  return (
    <>
      <div className="flex grow items-center justify-center rounded-lg bg-white/10 text-white">
        <Chart quoteToken={quoteToken} />
      </div>
      <div className="flex h-[300px]">
        <DataScene
          quoteToken={quoteToken}
          name={name}
          poolAddress={poolAddress}
          initialData={initialData}
        />
      </div>
    </>
  );
}
