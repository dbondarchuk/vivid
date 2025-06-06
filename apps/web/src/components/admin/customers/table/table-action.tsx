"use client";

import {
  DataTableResetFilter,
  DataTableSearch,
  useSelectedRowsStore,
} from "@vivid/ui";
import { DeleteSelectedCustomersButton } from "./delete-selected";
import { useCustomersTableFilters } from "./use-table-filters";
import { MergeSelectedCustomersButton } from "./merge-selected";

export function CustomersTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useCustomersTableFilters();
  const { rowSelection } = useSelectedRowsStore();

  return (
    <div className="flex flex-col flex-wrap md:items-center justify-between gap-4 md:flex-row">
      <div className="flex flex-1 md:flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <MergeSelectedCustomersButton selected={rowSelection} />
        <DeleteSelectedCustomersButton selected={rowSelection} />
      </div>
    </div>
  );
}
