"use client";

import {
  DataTableFilterBox,
  DataTableRangeBox,
  DataTableResetFilter,
  DataTableSearch,
  useSelectedRowsStore,
} from "@vivid/ui";

import {
  DIRECTION_OPTIONS,
  CHANNEL_OPTIONS,
  useCommunicationLogsTableFilters,
} from "./use-table-filters";
import { ClearSelectedCommunicationLogsButton } from "./clear-selected";
import { ClearAllCommunicationLogsButton } from "./clear-all";

export function CommunicationLogsTableAction() {
  const {
    directionFilter,
    channelFilter,
    setDirectionFilter,
    setChannelFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    start,
    end,
    setStartValue,
    setEndValue,
  } = useCommunicationLogsTableFilters();

  const { rowSelection } = useSelectedRowsStore();
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
          filterKey="direction"
          title="Direction"
          options={DIRECTION_OPTIONS}
          setFilterValue={setDirectionFilter as any}
          filterValue={directionFilter}
        />
        <DataTableFilterBox
          filterKey="channel"
          title="Channel"
          options={CHANNEL_OPTIONS}
          setFilterValue={setChannelFilter as any}
          filterValue={channelFilter}
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
      <div className="flex flex-wrap items-center gap-4">
        <ClearSelectedCommunicationLogsButton selected={rowSelection} />
        <ClearAllCommunicationLogsButton />
      </div>
    </div>
  );
}
