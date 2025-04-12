"use client";

import {
  Button,
  DataTableFilterBox,
  DataTableRangeBox,
  DataTableResetFilter,
  DataTableSearch,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useSelectedRowsStore,
} from "@vivid/ui";

import {
  DIRECTION_OPTIONS,
  CHANNEL_OPTIONS,
  useCommunicationLogsTableFilters,
} from "./use-table-filters";
import { ClearSelectedCommunicationLogsButton } from "./clear-selected";
import { ClearAllCommunicationLogsButton } from "./clear-all";
import { Settings2 } from "lucide-react";

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

  const additionalFilters = (
    <>
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
    </>
  );

  return (
    <div className="flex flex-col flex-wrap md:items-center justify-between gap-4 md:flex-row">
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
      <div className="flex flex-wrap items-center gap-4">
        <ClearSelectedCommunicationLogsButton selected={rowSelection} />
        <ClearAllCommunicationLogsButton />
      </div>
    </div>
  );
}
