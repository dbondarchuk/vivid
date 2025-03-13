"use client";
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
  return (
    <>
      {isFilterActive ? (
        <Button variant="outline" onClick={onReset}>
          <span className="max-md:hidden">Reset filters</span>
          <span className="md:hidden">
            <FilterX size={16} />
          </span>
        </Button>
      ) : null}
    </>
  );
}
