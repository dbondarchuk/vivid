"use client";

import {
  CommunicationChannelTexts,
  CommunicationDirectionTexts,
} from "@/constants/labels";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { searchParams } from "./search-params";

export const DIRECTION_OPTIONS = Object.entries(
  CommunicationDirectionTexts
).map(([name, value]) => ({
  value: name,
  label: value,
}));

export const CHANNEL_OPTIONS = Object.entries(CommunicationChannelTexts).map(
  ([name, value]) => ({
    value: name,
    label: value,
  })
);

export function useCommunicationLogsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [directionFilter, setDirectionFilter] = useQueryState(
    "direction",
    searchParams.direction
      .withOptions({ shallow: false })
      .withDefault(searchParams.direction.defaultValue)
  );

  const [channelFilter, setChannelFilter] = useQueryState(
    "channel",
    searchParams.channel
      .withOptions({ shallow: false })
      .withDefault(searchParams.channel.defaultValue)
  );

  const [page, setPage] = useQueryState("page", searchParams.page);

  const [start, setStartValue] = useQueryState(
    "start",
    searchParams.start.withOptions({ shallow: false })
  );

  const [end, setEndValue] = useQueryState(
    "end",
    searchParams.end.withOptions({ shallow: false })
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setDirectionFilter(null);
    setChannelFilter(null);
    setStartValue(null);
    setEndValue(null);

    setPage(1);
  }, [
    setSearchQuery,
    setDirectionFilter,
    setChannelFilter,
    setPage,
    setStartValue,
    setEndValue,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      directionFilter !== searchParams.direction.defaultValue ||
      channelFilter !== searchParams.channel.defaultValue ||
      !!start ||
      !!end
    );
  }, [searchQuery, directionFilter, channelFilter, start, end]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    directionFilter,
    setDirectionFilter,
    channelFilter,
    setChannelFilter,
    start,
    setStartValue,
    end,
    setEndValue,
  };
}
