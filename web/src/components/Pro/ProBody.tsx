import { Suspense } from "react";
import DataScene from "./DataScene";
import Chart from "./Chart";
import { requestGetTokenEvents } from "@/data";

export default async function ProBody({
  name,
  quoteToken,
  poolAddress,
}: {
  name: string;
  quoteToken: string;
  poolAddress: string;
}) {
  const initialData = await requestGetTokenEvents({ poolAddress });
  return (
    <>
      <div className="flex grow items-center justify-center rounded-lg bg-white/10 text-white">
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart quoteToken={quoteToken} />
        </Suspense>
      </div>
      <div className="flex h-[300px]">
        <Suspense fallback={<div>Loading tables...</div>}>
          <DataScene
            quoteToken={quoteToken}
            name={name}
            poolAddress={poolAddress}
            initialData={initialData}
          />
        </Suspense>
      </div>
    </>
  );
}
