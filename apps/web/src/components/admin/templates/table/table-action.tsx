"use client";

import {
  DataTableFilterBox,
  DataTableResetFilter,
  DataTableSearch,
  useSelectedRowsStore,
} from "@vivid/ui";
import { DeleteSelectedTemplatesButton } from "./delete-selected";
import { TYPE_OPTIONS, useTemplatesTableFilters } from "./use-table-filters";

export function TemplatesTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
  } = useTemplatesTableFilters();
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
          filterKey="type"
          title="Type"
          options={TYPE_OPTIONS}
          setFilterValue={setTypeFilter as any}
          filterValue={typeFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <DeleteSelectedTemplatesButton selected={rowSelection} />
      </div>
    </div>
  );
}
