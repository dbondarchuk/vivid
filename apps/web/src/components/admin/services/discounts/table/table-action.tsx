"use client";

import { useI18n } from "@vivid/i18n";
import { discountTypes } from "@vivid/types";
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
import { Settings2 } from "lucide-react";
import { DeleteSelectedDiscountsButton } from "./delete-selected";
import { useFieldsTableFilters } from "./use-table-filters";

export function DiscountsTableAction() {
  const {
    typeFilter,
    setTypeFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    enabledFilter,
    setEnabledFilter,
    start,
    setStartValue,
    end,
    setEndValue,
  } = useFieldsTableFilters();
  const { rowSelection } = useSelectedRowsStore();
  const t = useI18n("admin");

  const additionalFilters = (
    <>
      <DataTableFilterBox
        filterKey="type"
        title={t("services.discounts.table.columns.type")}
        options={discountTypes.map((type) => ({
          value: type,
          label: t(`common.labels.discountType.${type}`),
        }))}
        setFilterValue={setTypeFilter as any}
        filterValue={typeFilter}
      />
      <DataTableFilterBox
        filterKey="status"
        title={t("services.discounts.table.columns.enabled")}
        options={[
          {
            value: false,
            label: t("common.labels.discountStatus.disabled"),
          },
          {
            value: true,
            label: t("common.labels.discountStatus.active"),
          },
        ]}
        setFilterValue={setEnabledFilter as any}
        filterValue={enabledFilter}
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
          <PopoverTrigger
            tooltip={t("common.labels.filters")}
            asChild
            className="md:hidden"
          >
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
        <DeleteSelectedDiscountsButton selected={rowSelection} />
      </div>
    </div>
  );
}
