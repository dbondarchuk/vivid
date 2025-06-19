"use client";

import {
  Button,
  DataTableFilterBox,
  DataTableResetFilter,
  DataTableSearch,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useSelectedRowsStore,
} from "@vivid/ui";
import { Plus, Settings2 } from "lucide-react";
import React from "react";
import { DeleteSelectedFollowUpsButton } from "./delete-selected";
import { CHANNEL_OPTIONS, useFollowUpsTableFilters } from "./use-table-filters";

export const FollowUpsTableAction: React.FC<{ appId: string }> = ({
  appId,
}) => {
  const {
    channelFilter,
    setChannelFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useFollowUpsTableFilters();
  const { rowSelection } = useSelectedRowsStore();

  const additionalFilters = (
    <>
      <DataTableFilterBox
        filterKey="channel"
        title="Channel"
        options={CHANNEL_OPTIONS}
        setFilterValue={setChannelFilter as any}
        filterValue={channelFilter}
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
      <div className="flex flex-wrap items-center gap-4 max-md:justify-between">
        <DeleteSelectedFollowUpsButton selected={rowSelection} appId={appId} />
        <Link
          button
          variant="primary"
          href="/admin/dashboard/communications/follow-ups/new"
        >
          <Plus size={16} /> <span className="max-md:hidden">Add new</span>
        </Link>
      </div>
    </div>
  );
};
