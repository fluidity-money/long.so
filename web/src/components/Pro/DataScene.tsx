"use client";
// Get Token Events for Txns
// GetTokenPrice for Holders

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

  interface Data {
    type: string;
    price: string;
    age: string;
    usd: string;
    eth: string;
    mode: string;
    maker: string;
  }

  const data: Data[] = [
    {
      type: "Sell",
      price: "$1000",
      age: "7min",
      usd: "$63.00",
      eth: "0.02309",
      mode: "3,706.19",
      maker: "0x...001",
    },
    {
      type: "Buy",
      price: "$1000",
      age: "7min",
      usd: "$63.00",
      eth: "0.02309",
      mode: "3,706.19",
      maker: "0x...001",
    },
    {
      type: "Sell",
      price: "$1000",
      age: "7min",
      usd: "$63.00",
      eth: "0.02309",
      mode: "3,706.19",
      maker: "0x...001",
    },
    {
      type: "Buy",
      price: "$1000",
      age: "7min",
      usd: "$63.00",
      eth: "0.02309",
      mode: "3,706.19",
      maker: "0x...001",
    },
    {
      type: "Sell",
      price: "$1000",
      age: "7min",
      usd: "$63.00",
      eth: "0.02309",
      mode: "3,706.19",
      maker: "0x...001",
    },
    {
      type: "Buy",
      price: "$1000",
      age: "7min",
      usd: "$63.00",
      eth: "0.02309",
      mode: "3,706.19",
      maker: "0x...001",
    },
  ];

  const columns: ColumnDef<Data>[] = [
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
      header: () => <span className={titleStyle}>Price</span>,
      accessorKey: "price",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("price")}</span>
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
      accessorKey: "mode",
      cell: ({ row }) => (
        <span className={contentStyle}>{row.getValue("mode")}</span>
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
      <DataTablePro columns={columns} data={data} />
    </div>
  );
}
