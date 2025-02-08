"use client";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationLog,
  DateRange,
  Sort,
} from "@vivid/types";
import {
  Button,
  CalendarDateRangePicker,
  Input,
  MultiSelect,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useDidUpdateEffect,
} from "@vivid/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClearSelectedCommunicationLogsButton } from "../clearSelectedButton";
import {
  CommunicationChannelTexts,
  CommunicationDirectionTexts,
} from "./communicationLogs.columns";

interface DataTableProps<TValue> {
  columns: ColumnDef<CommunicationLog, TValue>[];
  data: CommunicationLog[];
  page: number;
  total: number;
  pageSizeOptions?: number[];
  limit: number;
  dateRange?: DateRange;
  directions: CommunicationDirection[];
  channels: CommunicationChannel[];
  sort: Sort;
  search?: string;
}

export const CommunicationLogsTable = <CommunicationLog, TValue>({
  columns,
  data,
  page,
  total,
  limit,
  dateRange,
  directions,
  channels,
  search,
  sort,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string[] | string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null || typeof value === "undefined") {
          newSearchParams.delete(key);
        } else if (Array.isArray(value)) {
          newSearchParams.delete(key);
          value.forEach((val) => newSearchParams.append(key, val));
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Handle server-side sorting
  const [sortingState, setSorting] = React.useState<SortingState>(
    sort.map((x) => ({
      desc: !!x.desc,
      id: x.key,
    }))
  );

  useDidUpdateEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        sort: sortingState.map((x) => `${x.id}:${x.desc}`),
        page: null,
      })}`,
      {
        scroll: false,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortingState]);

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page,
      pageSize: limit,
    });

  useDidUpdateEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize,
      })}`,
      {
        scroll: false,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const setDateRange = (range: DateRange | undefined) => {
    router.push(
      `${pathname}?${createQueryString({
        start: range?.start
          ? DateTime.fromJSDate(range.start).startOf("day").toISO()
          : undefined,
        end: range?.end
          ? DateTime.fromJSDate(range.end).endOf("day").toISO()
          : undefined,
        page: undefined,
      })}`
    );
  };

  const setDirections = (direction: CommunicationDirection[]) => {
    router.push(
      `${pathname}?${createQueryString({
        direction: direction.length !== 0 ? direction : undefined,
        page: null,
      })}`
    );

    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const setChannels = (channel: CommunicationChannel[]) => {
    router.push(
      `${pathname}?${createQueryString({
        channel: channel.length !== 0 ? channel : undefined,
        page: null,
      })}`
    );

    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const table = useReactTable({
    data,
    getRowId: (row) => row._id,
    columns,
    rowCount: total,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
      sorting: sortingState,
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  });

  const [searchValue, setSearchValue] = React.useState(search);
  const deferredSearch = React.useDeferredValue(searchValue);

  useDidUpdateEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: null,
        limit: null,
        search: deferredSearch,
      })}`,
      {
        scroll: false,
      }
    );

    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [deferredSearch]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          placeholder={`Search...`}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="w-full md:max-w-sm"
        />
        <MultiSelect
          placeholder="Select channel..."
          selected={channels}
          onChange={(value) => setChannels(value as CommunicationChannel[])}
          options={Object.entries(CommunicationChannelTexts).map(
            ([value, label]) => ({ value, label })
          )}
        />
        <MultiSelect
          placeholder="Select direction..."
          selected={directions}
          onChange={(value) => setDirections(value as CommunicationDirection[])}
          options={Object.entries(CommunicationDirectionTexts).map(
            ([value, label]) => ({ value, label })
          )}
        />
        <CalendarDateRangePicker range={dateRange} onChange={setDateRange} />
      </div>
      <div className="w-full">
        <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground flex flex-row gap-2 items-center">
            <ClearSelectedCommunicationLogsButton
              selected={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original._id)}
            />
            Total items: {total}
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 lg:gap-8">
            <p className="whitespace-nowrap text-sm font-medium">
              Rows per page
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
