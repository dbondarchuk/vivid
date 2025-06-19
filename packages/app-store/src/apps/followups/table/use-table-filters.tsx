"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { searchParams } from "./search-params";
import { followUpChannelLabels } from "../const";

export const CHANNEL_OPTIONS = Object.entries(followUpChannelLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export function useFollowUpsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [channelFilter, setChannelFilter] = useQueryState(
    "channel",
    searchParams.channel
      .withOptions({ shallow: false })
      .withDefault(searchParams.channel.defaultValue)
  );

  const [page, setPage] = useQueryState("page", searchParams.page);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setChannelFilter(null);

    setPage(1);
  }, [setSearchQuery, setChannelFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || channelFilter !== searchParams.channel.defaultValue;
  }, [searchQuery, channelFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    channelFilter,
    setChannelFilter,
  };
}
