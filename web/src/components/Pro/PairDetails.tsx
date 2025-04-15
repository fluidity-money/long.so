const PairDetailItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-1 flex-col justify-between gap-1 self-stretch rounded bg-white/10 px-3 py-2">
      <div className="text-[10px] font-medium text-white capitalize underline">
        {title}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
};
const keys = ["price", "market_cap", "liquidity", "24hr_change", "24hr_vol"];
export default function PairDetails() {
  return (
    <div className="flex grow grid-cols-5 items-center justify-between gap-2">
      {keys.map((key) => (
        <PairDetailItem
          key={key}
          title={key.replace("_", " ")}
          value={"$0.02"}
        />
      ))}
    </div>
  );
}
