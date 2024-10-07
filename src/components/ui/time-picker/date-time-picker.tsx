"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";
import { DateTime } from "luxon";

export type DateTimePickerProps = Pick<CalendarProps, "fromDate" | "toDate"> & {
  value?: Date;
  onChange: (newValue: Date) => void;
  className?: string;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  className,
  ...calendarProps
}) => {
  const [date, setDate] = React.useState<DateTime | undefined>(
    value ? DateTime.fromJSDate(value) : undefined
  );

  const changeDate = (newDate: DateTime) => {
    setDate(date);
    onChange(newDate.toJSDate());
  };

  React.useEffect(() => {
    setDate(value ? DateTime.fromJSDate(value) : undefined);
  }, [value, setDate]);

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    const newDateTime = DateTime.fromJSDate(newDay);

    if (!date) {
      changeDate(newDateTime);
      return;
    }

    const newDateFull = date.set({
      year: newDateTime.year,
      month: newDateTime.month,
      day: newDateTime.day,
    });

    changeDate(newDateFull);
  };

  const handleTimeSelect = (newDay: Date | undefined) => {
    if (!newDay) return;

    const newDateTime = DateTime.fromJSDate(newDay);
    changeDate(newDateTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          suppressHydrationWarning
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            date.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date?.toJSDate()}
          onSelect={(d) => handleSelect(d)}
          initialFocus
          {...calendarProps}
        />
        <div className="p-3 border-t border-border">
          <TimePicker setDate={handleTimeSelect} date={date?.toJSDate()} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
