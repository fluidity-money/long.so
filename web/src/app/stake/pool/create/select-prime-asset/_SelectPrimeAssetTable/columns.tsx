import { ColumnDef } from "@tanstack/react-table";
import TokenIcon from "@/assets/icons/token.svg";
import TokenIridescent from "@/assets/icons/token-iridescent.svg";
import { Token } from "../../../../../../config/tokens";

export type Pool = {
  id: string;
  tokens: [Token, Token];
  duration: number;
  APR: number;
  volume: string;
};

export const columns: ColumnDef<Pool>[] = [
  {
    accessorKey: "tokens",
    header: "Pair",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <TokenIcon className={"size-[20px]"} />
          <TokenIridescent
            className={"-ml-4 size-[20px] rounded-full border border-black"}
          />
          {row.original.tokens[0].name}
          {" x "}
          {row.original.tokens[1].name}
        </div>
      );
    },
  },
  {
    accessorKey: "APR",
    header: "APR",
    cell: ({ row }) => {
      return `${row.original.APR}%`;
    },
  },
  {
    accessorKey: "volume",
    header: "Vol. 24h",
    cell: ({ row }) => {
      return row.original.volume;
    },
  },
  {
    accessorKey: "duration",
    header: "Boost",
    cell: ({ row }) => {
      return `${row.original.duration} mins`;
    },
  },
];
