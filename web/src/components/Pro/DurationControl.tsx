import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const durations = ["5m", "1h", "4h", "12h", "24h"];
const DurationItem = ({
  duration,
  active,
}: {
  duration: string;
  active: boolean;
}) => (
  <div
    className={cn(
      "flex flex-col gap-2 text-gray-200",
      active ? "flex-[2]" : "flex-1",
    )}
  >
    <Badge
      variant={active ? "iridescent" : "outline-dark"}
      className="z-[2] justify-center"
    >
      {duration}
    </Badge>
    <span className="block text-center text-[9px] font-semibold">0.00%</span>
  </div>
);
const DurationContentItem = ({
  className,
  title,
  value,
}: {
  className?: string;
  title: string;
  value: string;
}) => (
  <div className={cn(className, "flex flex-col gap-1")}>
    <span className="text-[10px] text-neutral-400">{title}</span>
    <span className="text-sm text-gray-200">{value}</span>
  </div>
);
const table = [
  {
    title: "Txns",
    value: 482,
    items: [
      { title: "Buys", value: 58 },
      { title: "Sells", value: 424 },
    ],
  },
  {
    title: "Volume",
    value: 67.7,
    items: [
      { title: "Buy Vol", value: 18.6 },
      { title: "Sell Vol", value: 49 },
    ],
  },
  {
    title: "Traders",
    value: 58,
    items: [
      { title: "Buyers", value: 20 },
      { title: "Sellers", value: 50 },
    ],
  },
];
export default function DurationControl() {
  return (
    <>
      <div className="relative flex items-center gap-1">
        {durations.map((dur, idx) => (
          <DurationItem active={idx === 0} key={dur} duration={dur} />
        ))}
        <div className="absolute inset-x-0 top-[10px] z-0 h-1 bg-white/10"></div>
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-white/10 p-4">
        {table.map((item) => (
          <div key={item.title} className="flex items-start">
            <DurationContentItem
              className="flex-1"
              title={item.title}
              value={item.value.toString()}
            />
            <div className="flex flex-[2] flex-col gap-1">
              <div className="flex items-center">
                {item.items.map((i) => (
                  <DurationContentItem
                    key={i.title}
                    title={i.title}
                    value={i.value.toString()}
                    className="flex-1"
                  />
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                <div
                  style={{
                    flex:
                      item.items[0].value /
                      item.items.reduce((acc, v) => acc + v.value, 0),
                  }}
                  className={cn("h-2 rounded-full bg-green-200")}
                />
                <div
                  style={{
                    flex:
                      item.items[1].value /
                      item.items.reduce((acc, v) => acc + v.value, 0),
                  }}
                  className={cn("h-2 rounded-full bg-red-200")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
