import Call2Action from "@/components/Pro/Call2Action";
import ProHeader from "@/components/Pro/ProHeader";

export default function ProMode() {
  return (
    <div className="flex flex-1 gap-4 bg-black px-4">
      <div className="flex flex-[4] flex-col gap-4">
        <ProHeader />
        <div className="flex-grow bg-green-700">
          Middle Left/Candlestick Chart
        </div>
        <div className="h-[200px] bg-blue-500">Data table</div>
      </div>
      <div className="flex flex-1 flex-col border-l border-black px-2">
        <Call2Action />
        <div className="flex-1 bg-yellow-300">Right side bar</div>
      </div>
    </div>
  );
}
