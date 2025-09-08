"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { searchParams } from "./search-params";

export function useCommunicationLogsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [directionFilter, setDirectionFilter] = useQueryState(
    "direction",
    searchParams.direction
      .withOptions({ shallow: false })
      .withDefault(searchParams.direction.defaultValue),
  );

  const [channelFilter, setChannelFilter] = useQueryState(
    "channel",
    searchParams.channel
      .withOptions({ shallow: false })
      .withDefault(searchParams.channel.defaultValue),
  );

  const [participantTypeFilter, setParticipantTypeFilter] = useQueryState(
    "participantType",
    searchParams.participantType
      .withOptions({ shallow: false })
      .withDefault(searchParams.participantType.defaultValue),
  );

  const [customerFilter, setCustomerFilter] = useQueryState(
    "customer",
    searchParams.customer.withOptions({ shallow: false }),
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
    setDirectionFilter(null);
    setChannelFilter(null);
    setParticipantTypeFilter(null);
    setStartValue(null);
    setEndValue(null);
    setCustomerFilter(null);

    setPage(1);
  }, [
    setSearchQuery,
    setDirectionFilter,
    setChannelFilter,
    setParticipantTypeFilter,
    setPage,
    setStartValue,
    setEndValue,
    setCustomerFilter,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      directionFilter !== searchParams.direction.defaultValue ||
      channelFilter !== searchParams.channel.defaultValue ||
      participantTypeFilter !== searchParams.participantType.defaultValue ||
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
    participantTypeFilter,
    setParticipantTypeFilter,
    start,
    setStartValue,
    end,
    setEndValue,
    customerFilter,
    setCustomerFilter,
  };
}
