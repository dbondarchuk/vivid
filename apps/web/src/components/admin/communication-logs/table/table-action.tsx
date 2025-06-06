"use client";

import {
  Button,
  cn,
  CustomersDataTableAsyncFilterBox,
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
  PARTICIPANT_TYPE_OPTIONS,
} from "./use-table-filters";
import { ClearSelectedCommunicationLogsButton } from "./clear-selected";
import { ClearAllCommunicationLogsButton } from "./clear-all";
import { Settings2 } from "lucide-react";
import React from "react";

export const CommunicationLogsTableAction: React.FC<{
  allowClearAll?: boolean;
  hideActions?: boolean;
  showCustomerFilter?: boolean;
  showParticipantTypeFilter?: boolean;
  className?: string;
}> = ({
  allowClearAll,
  showCustomerFilter,
  showParticipantTypeFilter,
  hideActions,
  className,
}) => {
  const {
    directionFilter,
    channelFilter,
    participantTypeFilter,
    setDirectionFilter,
    setChannelFilter,
    setParticipantTypeFilter,
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
      {showParticipantTypeFilter && (
        <DataTableFilterBox
          filterKey="participantType"
          title="Participant"
          options={PARTICIPANT_TYPE_OPTIONS}
          setFilterValue={setParticipantTypeFilter as any}
          filterValue={participantTypeFilter}
        />
      )}
      {showCustomerFilter && (
        <CustomersDataTableAsyncFilterBox
          filterValue={customerFilter}
          setFilterValue={setCustomerFilter}
        />
      )}
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
      {!hideActions && (
        <div className="flex flex-wrap items-center gap-4">
          <ClearSelectedCommunicationLogsButton selected={rowSelection} />
          {allowClearAll && <ClearAllCommunicationLogsButton />}
        </div>
      )}
    </div>
  );
};
