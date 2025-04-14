import config from "@/config/app";

export default function TokenDetails({
  pair,
}: {
  pair: (typeof config.pairs)[number];
}) {
  const data = {
    pair: pair.pair,
    token0: pair.quoteToken0,
    token1: pair.quoteToken1,
  };
  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-normal text-gray-200 capitalize">
          Pair Created
        </span>
        <span className="text-sm font-normal text-gray-200 capitalize">
          {pair.createdAt.toDateString()}
        </span>
      </div>
      {Object.entries(data).map(([key, value]) => (
        <div className="flex items-center justify-between pl-4" key={key}>
          <span className="text-[10px] font-normal text-gray-200 capitalize">
            {key.replace("_", " ")}
          </span>
          <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] text-zinc-400">
            {value.slice(0, 6)}...{value.slice(-6)}
          </span>
        </div>
      ))}
    </div>
  );
}
