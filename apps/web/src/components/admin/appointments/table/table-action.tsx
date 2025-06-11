"use client";

import {
  Button,
  cn,
  CustomersDataTableAsyncFilterBox,
  DataTableFilterBox,
  DataTableRangeBox,
  DataTableResetFilter,
  DataTableSearch,
  DiscountsDataTableAsyncFilterBox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@vivid/ui";
import { Settings2 } from "lucide-react";
import React from "react";
import {
  STATUS_OPTIONS,
  useAppointmentsTableFilters,
} from "./use-table-filters";

export const AppointmentsTableAction: React.FC<{
  showCustomerFilter?: boolean;
  className?: string;
}> = ({ showCustomerFilter, className }) => {
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
    customerFilter,
    setCustomerFilter,
    discountFilter,
    setDiscountFilter,
  } = useAppointmentsTableFilters();

  const additionalFilters = (
    <>
      <DataTableFilterBox
        filterKey="status"
        title="Status"
        options={STATUS_OPTIONS}
        setFilterValue={setStatusFilter as any}
        filterValue={statusFilter}
      />
      {showCustomerFilter && (
        <CustomersDataTableAsyncFilterBox
          filterValue={customerFilter}
          setFilterValue={setCustomerFilter}
        />
      )}
      <DiscountsDataTableAsyncFilterBox
        filterValue={discountFilter}
        setFilterValue={setDiscountFilter}
      />
      <DataTableRangeBox
        startValue={start}
        endValue={end}
        setStartValue={setStartValue}
        setEndValue={setEndValue}
      />
    </>
  );

  return (
    <div
      className={cn(
        "flex flex-col flex-wrap md:items-center justify-between gap-4 md:flex-row",
        className
      )}
    >
      <div className="flex flex-1 md:flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <Popover>
          <PopoverTrigger tooltip="Filters" asChild className="md:hidden">
            <Button variant="outline">
              <Settings2 size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2">
            {additionalFilters}
          </PopoverContent>
        </Popover>
        <div className="hidden md:flex flex-row gap-4">{additionalFilters}</div>
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
    </div>
  );
};
