import ProBody from "@/components/Pro/ProBody";
import Call2Action from "@/components/Pro/Call2Action";
import DurationControl from "@/components/Pro/DurationControl";
import ProHeader from "@/components/Pro/ProHeader";
import TokenDetails from "@/components/Pro/TokenDetails";
import config from "@/config/app";
import { notFound } from "next/navigation";
import { requestGetHolders, requestGetTokenEvents } from "@/data";
export const dynamicParams = false;
export async function generateStaticParams() {
  return config.pools.map((p) => ({ address: p.address }));
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
  const filters = await searchParams;
  const quoteToken = filters?.quoteToken || "0";
  const name = config.pools.find((p) => p.address === address)?.name;
  const networkId = config.pools.find((p) => p.address === address)?.networkId;
  if (!name || !networkId || !(quoteToken === "0" || quoteToken === "1"))
    notFound();
  const initialEventsData = await requestGetTokenEvents({
    poolAddress: address,
    quoteToken,
    networkId,
  });
  const initialHoldersData = await requestGetHolders({
    poolAddress: address,
    networkId,
  });
  return (
    <div className="flex flex-1 gap-4 px-4">
      <div className="flex grow flex-col gap-2">
        <ProHeader name={name} />
        <ProBody
          initialEventsData={initialEventsData}
          initialHoldersData={initialHoldersData}
          poolAddress={address}
          networkId={networkId}
          name={name}
          quoteToken={quoteToken as "0" | "1"}
        />
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
