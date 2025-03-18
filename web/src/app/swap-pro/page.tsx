export default function ProMode() {
  return (
    <div className="flex flex-1 gap-4 px-4">
      <div className="grid flex-[4] grid-cols-[3fr_1fr] grid-rows-[50px_auto_30%] gap-4">
        <div className="bg-red-500">Top Left</div>
        <div className="bg-red-700">Top Right</div>
        <div className="bg-green-700">Middle Left/Candlestick Chart</div>
        <div className="bg-green-500">Middle Right/Depth Chart</div>
        <div className="col-span-2 bg-blue-500">Data table</div>
      </div>
      <div className="flex-1 bg-yellow-300">Right side bar</div>
    </div>
  );
}
