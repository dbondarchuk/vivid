"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "@/types";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import * as React from "react";

export type CalendarDateRangePickerProps =
  React.HTMLAttributes<HTMLDivElement> & {
    range?: DateRange;
    onChange?: (range?: DateRange) => void;
  };

export const CalendarDateRangePicker: React.FC<
  CalendarDateRangePickerProps
> = ({ className, range, onChange }) => {
  const [date, setDate] = React.useState<DateRange | undefined>(range);

  const onSelect = (range?: DateRange) => {
    setDate(range);
    onChange?.(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal text-md",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.start ? (
              date.end ? (
                <>
                  {DateTime.fromJSDate(date.start).toFormat("LLL dd, y")} -{" "}
                  {DateTime.fromJSDate(date.end).toFormat("LLL dd, y")}
                </>
              ) : (
                DateTime.fromJSDate(date.start).toFormat("LLL dd, y")
              )
            ) : (
              <span className="text-sm text-muted-foreground">
                Pick a date range
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.start}
            selected={{
              from: date?.start,
              to: date?.end,
            }}
            onSelect={(range) =>
              onSelect(range ? { start: range.from, end: range.to } : undefined)
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};