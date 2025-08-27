"use client";
import { useI18n } from "@vivid/i18n";
import { FilterX } from "lucide-react";
import { Button } from "../button";

type DataTableResetFilterProps = {
  isFilterActive: boolean;
  onReset: () => void;
};

export function DataTableResetFilter({
  isFilterActive,
  onReset,
}: DataTableResetFilterProps) {
  const t = useI18n("ui");

  return (
    <>
      {isFilterActive ? (
        <Button variant="outline" onClick={onReset}>
          <span className="max-md:hidden">{t("dataTable.resetFilters")}</span>
          <span className="md:hidden">
            <FilterX size={16} />
          </span>
        </Button>
      ) : null}
    </>
  );
}
