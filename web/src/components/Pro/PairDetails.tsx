"use client";
import { requestGetPairDetails } from "@/data";
import { useGetPairDetails } from "@/hooks/useGraphql";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
const PairDetailItem = ({
  title,
  value,
  change,
}: {
  title: string;
  value?: string | null;
  change?: number;
}) => {
  return (
    <div className="flex flex-1 flex-col justify-between gap-1 self-stretch rounded bg-white/10 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-medium text-neutral-400 capitalize">
          {title}
        </div>
        {change ? (
          <span
            className={cn(
              0 > Number(change) ? "text-red-400" : "text-green-400",
              "text-[10px]",
            )}
          >
            {change.toFixed(2) + "%"}
          </span>
        ) : null}
      </div>
      <div className="text-sm font-semibold text-white">{`$${+Number(value ?? 0).toFixed(2)}`}</div>
    </div>
  );
};
export default function PairDetails({
  tokenAddress,
  initialData,
}: {
  initialData: Awaited<ReturnType<typeof requestGetPairDetails>>;
  tokenAddress: string;
}) {
  const { data } = useGetPairDetails({ tokenAddress, initialData });
  const detailObj = useMemo(
    () => ({
      price: {
        value: data?.priceUSD,
        change: Number(data?.change24 ?? 0) * 100,
      },
      market_cap: { value: data?.marketCap, change: undefined },
      liquidity: { value: data?.liquidity, change: undefined },
      "24hr_change": {
        value: (
          Number(data?.priceUSD) * Number(data?.change24 ?? 0)
        ).toString(),
        change: Number(data?.change24 ?? 0) * 100,
      },
      "24hr_vol": { value: data?.volume24, change: undefined },
    }),
    [data],
  );
  return (
    <div className="flex grow grid-cols-5 items-center justify-between gap-2">
      {Object.entries(detailObj).map(([key, { value, change }]) => (
        <PairDetailItem
          key={key}
          title={key.replace("_", " ")}
          change={change}
          value={value}
        />
      ))}
    </div>
  );
}
