import ArrowDown from "@/assets/icons/arrow-down-white.svg";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { TokenIcon } from "../TokenIcon";
const Tabs = () => (
  <div className="flex items-center gap-1">
    <Button
      size={"sm"}
      variant={"outline"}
      className="flex-1 text-white"
      title="Market"
    >
      Market
    </Button>
    <Button
      size={"sm"}
      variant={"outline"}
      title="Limit"
      className="flex-1 text-white"
    >
      Limit
    </Button>
    <Button
      title="More"
      size={"sm"}
      variant={"outline"}
      className="flex flex-1 items-center gap-1 text-white"
    >
      <span>More</span>
      <ArrowDown className="size-2.5 bg-black" />
    </Button>
  </div>
);
const TokenItem = ({ symbol, first }: { symbol: string; first: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-zinc-400">
        {first ? "Spend" : "Get"}
      </span>
      <span className="text-xl font-medium text-gray-200">1234.56</span>
      <span className="text-xs text-neutral-400">( = $2.12)</span>
    </div>
    <Badge
      variant="outline"
      className="flex h-[26px] w-max cursor-pointer flex-row justify-between space-x-1 pl-0.5 pr-1 text-white md:h-[33px] md:pl-[4px] md:text-base"
    >
      <TokenIcon className="size-[20px] md:size-[25px]" />
      <div>{symbol.toUpperCase()}</div>
      <ArrowDown className="ml-1 h-[5.22px] w-[9.19px] md:h-[6.46px] md:w-[11.38px]" />
    </Badge>
  </div>
);
const tokens = ["eth", "purr"];
const summaryTitles = [
  "Liquidation Price",
  "Order Value",
  "Margin Required",
  "Slippage",
  "Fees",
];
const summaryValues = [
  "N/A",
  "N/A",
  "N/A",
  "Est: 0% / Max: 8.00%",
  "0.0350% / 0.0100",
];
export default function Call2Action() {
  return (
    <div className="flex flex-col gap-2">
      <Tabs />
      <div className="flex flex-col gap-4 rounded-lg bg-white/10 p-4">
        <div className="flex gap-1">
          <Button
            size={"sm"}
            variant={"tint"}
            className="flex-1 bg-green-200 text-black"
          >
            Buy/Long
          </Button>
          <Button size={"sm"} className="flex-1 text-white" variant="outline">
            Sell/Short
          </Button>
        </div>
        {tokens.map((token, idx) => (
          <TokenItem key={token} symbol={token} first={idx === 0} />
        ))}
      </div>
      <div className="pl-2">
        <h3 className="mb-2 text-sm text-gray-200">Summary</h3>
        <div className="flex flex-col gap-2 pl-5 pr-4">
          {summaryTitles.map((title, idx) => (
            <div key={title} className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-200">{title}</span>
              <span className="text-xs font-medium text-gray-200">
                {summaryValues[idx]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Button variant={"secondary"}>Place Order</Button>
      <Button variant={"outline"} className="text-white">
        Deposit
      </Button>
    </div>
  );
}
