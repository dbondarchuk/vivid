"use client";

import { DiscountTypeLabels } from "@/constants/labels";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { searchParams } from "./search-params";

export const ENABLED_OPTIONS = [true, false].map((value) => ({
  value,
  label: value ? "Active" : "Disabled",
}));

export const TYPE_OPTIONS = Object.entries(DiscountTypeLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export function useFieldsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [typeFilter, setTypeFilter] = useQueryState(
    "type",
    searchParams.type
      .withOptions({ shallow: false })
      .withDefault(searchParams.type.defaultValue)
  );

  const [enabledFilter, setEnabledFilter] = useQueryState(
    "enabled",
    searchParams.enabled
      .withOptions({ shallow: false })
      .withDefault(searchParams.enabled.defaultValue)
  );

  const [start, setStartValue] = useQueryState(
    "start",
    searchParams.start.withOptions({ shallow: false })
  );

  const [end, setEndValue] = useQueryState(
    "end",
    searchParams.end.withOptions({ shallow: false })
  );

  const [page, setPage] = useQueryState("page", searchParams.page);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setTypeFilter(null);
    setEnabledFilter(null);
    setStartValue(null);
    setEndValue(null);

    setPage(1);
  }, [
    setSearchQuery,
    setTypeFilter,
    setPage,
    setEnabledFilter,
    setStartValue,
    setEndValue,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || typeFilter !== searchParams.type.defaultValue;
  }, [searchQuery, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    typeFilter,
    setTypeFilter,
    enabledFilter,
    setEnabledFilter,
    start,
    setStartValue,
    end,
    setEndValue,
  };
}
