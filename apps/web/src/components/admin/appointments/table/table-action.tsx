"use client";

import {
  DataTableFilterBox,
  DataTableRangeBox,
  DataTableResetFilter,
  DataTableSearch,
  useSelectedRowsStore,
} from "@vivid/ui";
import {
  STATUS_OPTIONS,
  useAppointmentsTableFilters,
} from "./use-table-filters";

export function AppointmentsTableAction() {
  const {
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    start,
    end,
    setStartValue,
    setEndValue,
  } = useAppointmentsTableFilters();
  return (
    <div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row">
      <div className="flex flex-1 flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="status"
          title="Status"
          options={STATUS_OPTIONS}
          setFilterValue={setStatusFilter as any}
          filterValue={statusFilter}
        />
        <DataTableRangeBox
          startValue={start}
          endValue={end}
          setStartValue={setStartValue}
          setEndValue={setEndValue}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
    </div>
  );
}
