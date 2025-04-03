import Call2Action from "@/components/Pro/Call2Action";
import DataScene from "@/components/Pro/DataScene";
import DurationControl from "@/components/Pro/DurationControl";
import ProHeader from "@/components/Pro/ProHeader";
import TokenDetails from "@/components/Pro/TokenDetails";
import config from "@/config/app";
import { notFound } from "next/navigation";
export const dynamicParams = false;
export async function generateStaticParams() {
  return config.pairs.map((p) => ({ address: p.address }));
}
type Params = Promise<{ address: string }>;
type SearchParams = Promise<{ quoteToken?: string }>;
export default async function ProMode({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { address } = await params;
  const { quoteToken = "0" } = await searchParams;
  const name = config.pairs.find((p) => p.address === address)?.name;
  if (!name) notFound();
  return (
    <div className="flex flex-1 gap-4 px-4">
      <div className="flex grow flex-col gap-4">
        <ProHeader name={name} />
        <div className="flex grow items-center justify-center rounded-lg bg-white/10 text-white">
          Middle Left/Candlestick Chart
          {JSON.stringify(quoteToken)}
        </div>
        <div className="flex h-[200px]">
          <DataScene />
        </div>
      </div>
      <div className="relative w-[300px]">
        <div className="absolute inset-0 flex flex-col gap-4 overflow-y-auto border-l border-black px-2">
          <Call2Action />
          <DurationControl />
          <TokenDetails />
        </div>
      </div>
    </div>
  );
}
