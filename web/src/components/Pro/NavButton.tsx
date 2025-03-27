import ETH from "@/assets/icons/eth-white.svg";
import ArrowDown from "@/assets/icons/arrow-down.svg";

const KeyItem = ({ char }: { char: string }) => (
  <div className="flex size-6 items-center justify-center rounded-sm bg-white/10 p-1 text-white">
    {char}
  </div>
);
const searchKeys = ["⌘", "K"];
export default function NavButton() {
  return (
    <div className="flex items-center gap-2 self-stretch rounded bg-white/10 p-4">
      <ETH className="size-6" />
      <span className="text-xl font-medium text-white">ETH-USD</span>
      <div className="flex items-center gap-1 rounded-3xl bg-slate-500 px-2 py-1">
        <div className="relative size-3 rounded-[100px] bg-slate-500 outline outline-1 outline-offset-[-1px] outline-sky-100">
          <div className="absolute left-[2px] top-[2px] size-2 rounded-full bg-sky-100" />
        </div>
        <span className="text-white">Spot</span>
      </div>
      <div className="flex items-center gap-0.5">
        {searchKeys.map((key) => (
          <KeyItem key={key} char={key} />
        ))}
      </div>
      <ArrowDown className="size-2.5 text-white" />
    </div>
  );
}
