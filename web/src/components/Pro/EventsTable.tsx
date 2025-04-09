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
  const contentStyle = "text-xs font-medium";
  const eventDisplayTypeBadgeMap: Record<
    TokenEvent["eventDisplayType"],
    "buy" | "destructive" | "mint" | "burn"
  > = useMemo(
    () =>
      ({
        Buy: "buy",
        Sell: "destructive",
        Mint: "mint",
        Burn: "burn",
      }) as const,
    [],
  );
  const eventDisplayTypeColorMap: Record<
    TokenEvent["eventDisplayType"],
    string
  > = useMemo(
    () =>
      ({
        Burn: "text-purple-light",
        Mint: "text-blue-light",
        Buy: "text-green-200",
        Sell: "text-red-200",
      }) as const,
    [],
  );
  const columns = useMemo(
    () => [
      columnHelper.accessor("eventDisplayType", {
        header: () => <span className={titleStyle}>Type</span>,
        cell: ({ cell }) => (
          <Badge
            variant={
              eventDisplayTypeBadgeMap[
                cell.getValue() as keyof typeof eventDisplayTypeBadgeMap
              ]
            }
          >
            {cell.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("age", {
        header: () => <span className={titleStyle}>Age</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue()}</span>
        ),
      }),
      columnHelper.accessor("price", {
        header: () => <span className={titleStyle}>Price</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue()}</span>
        ),
      }),
      columnHelper.accessor("usd", {
        header: () => <span className={titleStyle}>USD</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue()}</span>
        ),
      }),
      columnHelper.accessor("eth", {
        header: () => <span className={titleStyle}>ETH</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue()}</span>
        ),
      }),
      columnHelper.accessor("token", {
        header: () => <span className={titleStyle}>{tokenName}</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue()}</span>
        ),
      }),
      columnHelper.accessor("maker", {
        header: () => <span className={titleStyle}>Maker</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue()}</span>
        ),
      }),
    ],
    [tokenName, columnHelper, eventDisplayTypeBadgeMap],
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
    <Table className="absolute inset-0 overflow-y-auto">
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
                className={cn(
                  "border-0 hover:bg-black hover:text-white",
                  eventDisplayTypeColorMap[
                    row.getValue(
                      "eventDisplayType",
                    ) as keyof typeof eventDisplayTypeColorMap
                  ],
                )}
              >
                {row
                  .getVisibleCells()
                  .filter((c) => !!c.getValue())
                  .map((cell) => {
                    const isNotSwap =
                      cell.column.id === "price" &&
                      (row.getValue("eventDisplayType") === "Burn" ||
                        row.getValue("eventDisplayType") === "Mint");
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
