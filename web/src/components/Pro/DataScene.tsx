"use client";
// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
import { EventsTable } from "./EventsTable";
import { Tabs, TabsContent } from "../ui/tabs";
import { requestGetTokenEvents } from "@/data";
// const Tabs = () => (
//   <div className="flex gap-2">
//     <Button size={"sm"}>Txns</Button>
//     <Button size={"sm"}>Holders</Button>
//   </div>
// );
export default function DataScene({
  name,
  quoteToken,
  poolAddress,
  initialData,
}: {
  name: string;
  quoteToken: string;
  poolAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
}) {
  const pairNames = name.split("/");
  const tokenName = pairNames[+quoteToken];
  return (
    <div className="flex w-full flex-col gap-2">
      <Tabs defaultValue="txns">
        <TabsContent value="txns">
          <EventsTable
            tokenName={tokenName}
            initialData={initialData}
            poolAddress={poolAddress}
          />
        </TabsContent>
        <TabsContent value="holders">
          <div>Holders</div>
        </TabsContent>
      </Tabs>
      {/* <Tabs /> */}
    </div>
  );
}
