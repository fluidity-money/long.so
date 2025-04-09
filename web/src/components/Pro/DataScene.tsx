"use client";
// import { Badge } from "../ui/badge";
import { EventsTable } from "./EventsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { requestGetTokenEvents } from "@/data";

export default function DataScene({
  name,
  quoteToken,
  poolAddress,
  initialData,
}: {
  name: string;
  quoteToken: "0" | "1";
  poolAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
}) {
  const pairNames = name.split("/");
  const tokenName = pairNames[+quoteToken];
  return (
    <div className="flex w-full flex-col gap-2">
      <Tabs defaultValue="txns" className="flex flex-1 flex-col">
        <TabsList className="self-start bg-black">
          <TabsTrigger value="txns">Txns</TabsTrigger>
          <TabsTrigger value="holders">Holders</TabsTrigger>
        </TabsList>
        <TabsContent value="txns" className="relative flex grow">
          <EventsTable
            tokenName={tokenName}
            quoteToken={quoteToken}
            initialData={initialData}
            poolAddress={poolAddress}
          />
        </TabsContent>
        <TabsContent value="holders">
          <div>Holders</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
