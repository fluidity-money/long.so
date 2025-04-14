"use client";
// import { Badge } from "../ui/badge";
import { EventsTable } from "./EventsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  requestGetHolders,
  requestGetTokenEvents,
  requestGetTokenPrice,
} from "@/data";
import { HoldersTable } from "./HoldersTable";

export default function DataScene({
  quoteToken,
  poolAddress,
  tokenName,
  tokenAddress,
  initialEventsData,
  initialHoldersData,
  initialTokenPriceData,
  networkId,
}: {
  quoteToken: "0" | "1";
  poolAddress: string;
  tokenName: string;
  tokenAddress: string;
  initialEventsData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
  initialHoldersData: Awaited<ReturnType<typeof requestGetHolders>>;
  initialTokenPriceData: Awaited<ReturnType<typeof requestGetTokenPrice>>;
  networkId: number;
}) {
  return (
    <div className="flex w-full flex-1 flex-col gap-2">
      <Tabs defaultValue="txns" className="flex flex-1 flex-col">
        <TabsList className="self-start bg-black">
          <TabsTrigger value="txns">Txns</TabsTrigger>
          <TabsTrigger value="holders">Holders</TabsTrigger>
        </TabsList>
        <TabsContent value="txns" className="relative flex grow">
          <EventsTable
            networkId={networkId}
            tokenName={tokenName}
            quoteToken={quoteToken}
            initialData={initialEventsData}
            poolAddress={poolAddress}
          />
        </TabsContent>
        <TabsContent value="holders" className="relative flex grow">
          <HoldersTable
            networkId={networkId}
            initialData={initialHoldersData}
            initialTokenPriceData={initialTokenPriceData}
            tokenAddress={tokenAddress}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
