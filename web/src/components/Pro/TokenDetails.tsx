export default function TokenDetails() {
  const data = {
    pair_created: "12 Jan 2025",
    pair: `0x2f8c...ea75`,
    token0: `0x2f8c...ea75`,
    token1: `0x2f8c...ea75`,
  };
  return (
    <div className="flex flex-col gap-2 px-2">
      {Object.entries(data).map(([key, value]) => (
        <div className="flex items-center justify-between" key={key}>
          <span className="text-[10px] font-normal capitalize text-gray-200">
            {key.replace("_", " ")}
          </span>
          <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] text-zinc-400">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
