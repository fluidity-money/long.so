"use client";
import { useGetTokenEvents, TokenEvent } from "@/hooks/useGraphql";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DataTablePro } from "./DataTablePro";
import { ColumnDef } from "@tanstack/react-table";
const Tabs = () => (
  <div className="flex gap-2">
    <Button size={"sm"}>Txns</Button>
    <Button size={"sm"}>Holders</Button>
  </div>
);
export default function DataScene() {
  const titleStyle = "text-gray-200 text-xs font-semibold";
  const contentStyle = "text-xs font-medium text-white";
  const { data, isLoading, isSuccess, hasNextPage, fetchNextPage } =
    useGetTokenEvents("0x7fc956a5c0aef46aa25b8911f4cb4619cbb7d90f");
  const events = data?.pages?.flatMap((page) => page.items) ?? [];
  const columns: ColumnDef<TokenEvent>[] = [
    {
      header: () => <span className={titleStyle}>Type</span>,
      accessorKey: "type",
      cell: ({ row }) => (
        <Badge
          variant={row.getValue("type") === "Sell" ? "destructive" : "action"}
        >
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      header: () => <span className={titleStyle}>Age</span>,
      accessorKey: "age",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("age")}</span>
      ),
    },
    {
      header: () => <span className={titleStyle}>Price</span>,
      accessorKey: "price",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("price")}</span>
      ),
    },
    {
      header: () => <span className={titleStyle}>USD</span>,
      accessorKey: "usd",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("usd")}</span>
      ),
    },
    {
      header: () => <span className={titleStyle}>ETH</span>,
      accessorKey: "eth",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("eth")}</span>
      ),
    },
    {
      header: () => <span className={titleStyle}>Mode</span>,
      accessorKey: "token",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("token")}</span>
      ),
    },
    {
      header: () => <span className={titleStyle}>Maker</span>,
      accessorKey: "maker",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("maker")}</span>
      ),
    },
  ];
  return (
    <div className="flex w-full flex-col gap-2">
      <Tabs />
      <DataTablePro
        isLoading={isLoading}
        columns={columns}
        data={events}
        isSuccess={isSuccess}
      />
    </div>
  );
}
