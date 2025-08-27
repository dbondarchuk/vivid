"use client";

import { useI18n } from "@vivid/i18n";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { searchParams } from "./search-params";

export function usePagesTableFilters() {
  const t = useI18n("admin");

  const STATUS_OPTIONS = [true, false].map((value) => ({
    value,
    label: value
      ? t("pages.table.filters.published")
      : t("pages.table.filters.draft"),
  }));

  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    "published",
    searchParams.published
      .withOptions({ shallow: false })
      .withDefault(searchParams.published.defaultValue),
  );

  const [page, setPage] = useQueryState("page", searchParams.page);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);

    setPage(1);
  }, [setSearchQuery, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery || statusFilter !== searchParams.published.defaultValue
    );
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    statusFilter,
    setStatusFilter,
    STATUS_OPTIONS,
  };
}
