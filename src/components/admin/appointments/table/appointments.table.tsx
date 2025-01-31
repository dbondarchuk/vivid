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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarDateRangePicker } from "../../../ui/date-range-picker";
import {
  Appointment,
  AppointmentStatus,
  appointmentStatuses,
  DateRange,
} from "@/types";
import { DateTime } from "luxon";
import { MultiSelect } from "@/components/ui/multi-select";
import { StatusText } from "../types";
import { Sort } from "@/types/database/query";
import { useDidUpdateEffect } from "@/hooks/useDidUpdateEffect";

interface DataTableProps<TValue> {
  columns: ColumnDef<Appointment, TValue>[];
  data: Appointment[];
  page: number;
  total: number;
  pageSizeOptions?: number[];
  limit: number;
  dateRange?: DateRange;
  statuses: AppointmentStatus[];
  sort: Sort;
  search?: string;
}

export const AppointmentsTable = <Appointment, TValue>({
  columns,
  data,
  page,
  total,
  limit,
  dateRange,
  statuses,
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

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page,
      pageSize: limit,
    });

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

  const setStatuses = (status: AppointmentStatus[]) => {
    router.push(
      `${pathname}?${createQueryString({
        status: status.length !== 0 ? status : undefined,
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

  const [clickedRow, clickRow] = React.useState<Appointment | undefined>(
    undefined
  );

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
          placeholder="Select status..."
          selected={statuses}
          onChange={(value) => setStatuses(value as AppointmentStatus[])}
          options={appointmentStatuses.map((s) => ({
            value: s,
            label: StatusText[s],
          }))}
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
                table
                  .getRowModel()
                  .rows // .sort((a, b) => a.index - b.index)
                  .map((row) => (
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
          <div className="flex-1 text-sm text-muted-foreground">
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected. */}
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
            {table.getPageCount()}
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
