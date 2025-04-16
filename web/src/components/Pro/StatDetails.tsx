import { cn } from "@/lib/utils";
// import { useGetPairStatDetails } from "@/hooks/useGraphql";
// import { requestGetPairStatDetails } from "@/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

const statModes = ["5m", "1h", "4h", "12h", "24h"];
const StatTitleItem = ({ mode }: { mode: string }) => (
  <TabsTrigger
    className={cn(
      "group flex flex-1 flex-col gap-2 text-gray-200 data-[state=active]:flex-[2]",
    )}
    value={mode}
  >
    <span className="group-data-[state=active]:iridescent z-[2] justify-center rounded-sm border border-black bg-[#000] px-2 py-1 text-xs group-data-[state=active]:border-0 group-data-[state=active]:text-black">
      {mode}
    </span>
    <span className="block text-center text-[9px] font-semibold">0.00%</span>
  </TabsTrigger>
);
const StatContentItem = ({
  className,
  title,
  value,
}: {
  className?: string;
  title: string;
  value: string | number;
}) => (
  <div className={cn(className, "flex grow flex-col gap-1")}>
    <span className="text-[10px] text-neutral-400">{title}</span>
    <span className="text-sm text-gray-200">{value}</span>
  </div>
);
const contentHeader = [
  {
    title: "Txns",
    value: 283,
  },
  {
    title: "Volume",
    value: 3456,
  },
  {
    title: "Traders",
    value: 54,
  },
];
const contentBody = [
  [
    {
      title: "Buys",
      value: 58,
    },
    {
      title: "Sells",
      value: 42,
    },
  ],
  [
    {
      title: "Buy Vol",
      value: 58,
    },
    {
      title: "Sell Vol",
      value: 42,
    },
  ],
  [
    {
      title: "Buyers",
      value: 23,
    },
    {
      title: "Sellers",
      value: 34,
    },
  ],
];

export default function StatDetails() {
// { pairAddress, quoteToken, networkId, initialData } : { pairAddress: string, quoteToken: '0' | '1', networkId: number, initialData: Awaited<ReturnType<typeof requestGetPairStatDetails>> }
  // const { data } = useGetPairStatDetails({ pairAddress, quoteToken, networkId, initialData })
  return (
    <Tabs defaultValue={statModes[0]}>
      <TabsList className="relative mb-2 flex gap-1">
        {statModes.map((mode) => (
          <StatTitleItem mode={mode} key={mode} />
        ))}
        <div className="absolute inset-x-0 top-[10px] z-0 h-1 bg-black" />
      </TabsList>
      {statModes.map((mode) => (
        <TabsContent value={mode} key={mode}>
          <div key={mode} className="flex flex-col gap-0.5">
            <div className="flex flex-1 items-center gap-0.5">
              {contentHeader.map((i) => (
                <div className="flex-1 bg-black px-3 py-1" key={i.title}>
                  <StatContentItem
                    className="flex-1"
                    title={i.title}
                    value={i.value}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-[2] flex-col gap-1 rounded-sm bg-black px-3 py-2">
              {contentBody.map((item) => (
                <div className="flex flex-1 flex-col gap-1" key={item[0].title}>
                  <div className="flex flex-1">
                    {item.map((i, idx) => (
                      <StatContentItem
                        key={i.title}
                        title={i.title}
                        value={i.value}
                        className={cn(idx === 1 && "text-end")}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div
                      style={{
                        flex:
                          item[0].value /
                          item.reduce((acc, v) => acc + v.value, 0),
                      }}
                      className={cn("bg-green-light h-1")}
                    />
                    <div
                      style={{
                        flex:
                          item[1].value /
                          item.reduce((acc, v) => acc + v.value, 0),
                      }}
                      className={cn("bg-destructive h-1")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
