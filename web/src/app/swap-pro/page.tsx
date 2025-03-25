import Call2Action from "@/components/Pro/Call2Action";
import DurationControl from "@/components/Pro/DurationControl";
import ProHeader from "@/components/Pro/ProHeader";

export default function ProMode() {
  return (
    <div className="flex flex-1 gap-4 bg-black px-4">
      <div className="flex flex-[4] flex-col gap-4">
        <ProHeader />
        <div className="flex flex-grow items-center justify-center rounded-lg bg-white/10 text-white">
          Middle Left/Candlestick Chart
        </div>
        <div className="flex h-[200px] items-center justify-center rounded-lg bg-white/10 text-white">
          Data table
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 border-l border-black px-2">
        <Call2Action />
        <DurationControl />
      </div>
    </div>
  );
}
