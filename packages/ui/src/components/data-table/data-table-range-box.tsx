"use client";

import { DateRange } from "@vivid/types";
import { Options } from "nuqs";
import { CalendarDateRangePicker } from "../date-range-picker";

interface FilterBoxProps {
  title?: string;
  setStartValue: (
    value: Date | ((old: Date | null) => Date | null) | null,
    options?: Options | undefined,
  ) => Promise<URLSearchParams>;
  startValue: Date | null;
  setEndValue: (
    value: Date | ((old: Date | null) => Date | null) | null,
    options?: Options | undefined,
  ) => Promise<URLSearchParams>;
  endValue: Date | null;
}

export function DataTableRangeBox({
  title,
  startValue,
  setStartValue,
  endValue,
  setEndValue,
}: FilterBoxProps) {
  const range: DateRange = {
    start: startValue || undefined,
    end: endValue || undefined,
  };

  const onRangeChange = (newRange?: DateRange) => {
    setStartValue(newRange?.start || null);
    setEndValue(newRange?.end || null);
  };

  return (
    <CalendarDateRangePicker
      range={range}
      onChange={onRangeChange}
      className="w-auto"
    />
  );
}
