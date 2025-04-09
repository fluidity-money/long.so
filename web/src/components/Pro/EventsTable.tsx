"use client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TokenEvent, useGetTokenEvents } from "@/hooks/useGraphql";
import { Badge } from "../ui/badge";
import { useMemo } from "react";
import { requestGetTokenEvents } from "@/data";

export function EventsTable({
  tokenName,
  poolAddress,
  initialData,
  quoteToken,
}: {
  poolAddress: string;
  tokenName: string;
  initialData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
  quoteToken: "0" | "1";
}) {
  const columnHelper = createColumnHelper<TokenEvent>();
  const titleStyle = "text-gray-200 text-xs font-semibold";
  const contentStyle = "text-xs font-medium text-white";
  const columns = useMemo(
    () => [
      columnHelper.accessor("type", {
        header: () => <span className={titleStyle}>Type</span>,
        cell: ({ row }) => (
          <Badge
            variant={row.getValue("type") === "Sell" ? "destructive" : "action"}
          >
            {row.getValue("type")}
          </Badge>
        ),
      }),
      columnHelper.accessor("age", {
        header: () => <span className={titleStyle}>Age</span>,
        cell: ({ row }) => (
          <span className={contentStyle}>{row.getValue("age")}</span>
        ),
      }),
      columnHelper.accessor("price", {
        header: () => <span className={titleStyle}>Price</span>,
        cell: ({ row }) => (
          <span className={contentStyle}>{row.getValue("price")}</span>
        ),
      }),
      columnHelper.accessor("usd", {
        header: () => <span className={titleStyle}>USD</span>,
        cell: ({ row }) => (
          <span className={contentStyle}>{row.getValue("usd")}</span>
        ),
      }),
      columnHelper.accessor("eth", {
        header: () => <span className={titleStyle}>ETH</span>,
        cell: ({ row }) => (
          <span className={contentStyle}>{row.getValue("eth")}</span>
        ),
      }),
      columnHelper.accessor("token", {
        header: () => <span className={titleStyle}>{tokenName}</span>,
        cell: ({ row }) => (
          <span className={contentStyle}>{row.getValue("token")}</span>
        ),
      }),
      columnHelper.accessor("maker", {
        header: () => <span className={titleStyle}>Maker</span>,
        cell: ({ row }) => (
          <span className={contentStyle}>{row.getValue("maker")}</span>
        ),
      }),
    ],
    [tokenName, columnHelper],
  );
  const {
    data,
    isLoading,
    isSuccess,
    //  hasNextPage, fetchNextPage
  } = useGetTokenEvents({ poolAddress, initialData, quoteToken });
  const events = data?.pages?.flatMap((page) => page.items) ?? [];
  const table = useReactTable({
    data: events ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-black shadow-[0px_0.5px_0px_white]">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              if (!header.column.columnDef.header) return null;
              return (
                <TableHead key={header.id} className="h-auto py-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading || (!isSuccess && !events?.length) ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-gray-200"
            >
              Loading...
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                className="border-0 hover:bg-black hover:text-white"
              >
                {row
                  .getVisibleCells()
                  .filter((c) => !!c.getValue())
                  .map((cell) => {
                    const isNotSwap =
                      cell.column.id === "price" &&
                      row.getValue("type") !== "Swap";
                    return (
                      <TableCell
                        colSpan={isNotSwap ? 4 : undefined}
                        key={cell.id}
                        className={cn("px-0 py-2", isNotSwap && "text-center")}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-gray-200"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
