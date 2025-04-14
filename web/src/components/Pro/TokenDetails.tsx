import config from "@/config/app";
import CopyIcon from "@/assets/icons/copy.svg";
export default function TokenDetails({
  pair,
}: {
  pair: (typeof config.pairs)[number];
}) {
  const names = pair.name.split("/");
  const data = {
    pair: pair.pair,
    [names[0]]: pair.quoteToken0,
    [names[1]]: pair.quoteToken1,
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
          <div className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-1">
            <CopyIcon className="size-3" />
            <span className="text-[10px] text-zinc-400">
              {value.slice(0, 6)}...{value.slice(-6)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
