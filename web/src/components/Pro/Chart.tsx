export default function Chart({ quoteToken }: { quoteToken: string }) {
  return (
    <div>
      {" "}
      Middle Left/Candlestick Chart
      {JSON.stringify(quoteToken)}
    </div>
  );
}
