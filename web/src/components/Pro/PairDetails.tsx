const PairDetailItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2 rounded bg-black/10 px-4 py-2">
      <div className="font-inter text-xs font-medium capitalize underline">
        {title}
      </div>
      <div className="font-inter text-base font-semibold">{value}</div>
    </div>
  );
};
const keys = ["price", "24hr_change", "24hr_vol", "contract", "market_cap"];
export default function PairDetails() {
  return (
    <div className="grid flex-grow grid-cols-5 items-center justify-between gap-4">
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
