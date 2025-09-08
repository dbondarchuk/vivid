"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { searchParams } from "./search-params";

export function useFieldsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [typeFilter, setTypeFilter] = useQueryState(
    "type",
    searchParams.type
      .withOptions({ shallow: false })
      .withDefault(searchParams.type.defaultValue),
  );

  const [page, setPage] = useQueryState("page", searchParams.page);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setTypeFilter(null);

    setPage(1);
  }, [setSearchQuery, setTypeFilter, setPage]);

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
  };
}
