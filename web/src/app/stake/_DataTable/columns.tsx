import { ColumnDef } from "@tanstack/react-table";
import { Token as TokenIcon } from "@/components";
import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";

export type Token = {
  name: string;
};

export type Pool = {
  id: string;
  tokens: [Token, Token];
  duration: number;
  staked: number;
  totalYield: number;
};

export const columns: ColumnDef<Pool>[] = [
  {
    accessorKey: "tokens",
    header: "Pool",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <TokenIcon size="small" />
          {row.original.tokens[0].name} {"x"}
          {row.original.tokens[1].name}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return `${row.original.duration} mins`;
    },
  },
  {
    accessorKey: "staked",
    header: "Staked",
    cell: ({ row }) => {
      return `${usdFormat(row.original.staked)}`;
    },
  },
  {
    accessorKey: "totalYield",
    header: "Total Yield",
    cell: ({ row }) => {
      return (
        <Badge className="iridescent text-black">
          {usdFormat(row.original.totalYield)}
        </Badge>
      );
    },
  },
];
