"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  id: string;
  value: number;
  rewards: number;
  time: Date;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "rewards",
    header: "Rewards",
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return `${formatDistanceToNow(row.original.time)} ago`;
    },
  },
];
