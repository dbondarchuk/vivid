"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { searchParams } from "./search-params";

export function useAppointmentsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    searchParams.status
      .withOptions({ shallow: false })
      .withDefault(searchParams.status.defaultValue),
  );

  const [customerFilter, setCustomerFilter] = useQueryState(
    "customer",
    searchParams.customer.withOptions({ shallow: false }),
  );

  const [discountFilter, setDiscountFilter] = useQueryState(
    "discount",
    searchParams.discount.withOptions({ shallow: false }),
  );

  const [page, setPage] = useQueryState("page", searchParams.page);

  const [start, setStartValue] = useQueryState(
    "start",
    searchParams.start.withOptions({ shallow: false }),
  );

  const [end, setEndValue] = useQueryState(
    "end",
    searchParams.end.withOptions({ shallow: false }),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setStartValue(null);
    setEndValue(null);
    setCustomerFilter(null);
    setDiscountFilter(null);

    setPage(1);
  }, [
    setSearchQuery,
    setStatusFilter,
    setPage,
    setStartValue,
    setEndValue,
    setCustomerFilter,
    discountFilter,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      statusFilter !== searchParams.status.defaultValue ||
      !!start ||
      !!end ||
      !!customerFilter ||
      !!discountFilter
    );
  }, [searchQuery, statusFilter, start, end, customerFilter, discountFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    statusFilter,
    setStatusFilter,
    start,
    setStartValue,
    end,
    setEndValue,
    customerFilter,
    setCustomerFilter,
    discountFilter,
    setDiscountFilter,
  };
}
