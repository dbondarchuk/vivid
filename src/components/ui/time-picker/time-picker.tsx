"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  getDateByType,
  getDatePeriod,
  Period,
  setDateByType,
} from "./time-picker-utils";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  seconds?: boolean;
}

export function TimePicker({
  date = new Date(new Date().setHours(0, 0, 0, 0)),
  setDate,
  seconds = false,
}: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  const onDateChange = (date: Date | undefined) => {
    if (seconds || !date) setDate(date);
    else setDate(setDateByType(date, "0", "seconds"));
  };

  const period = getDatePeriod(date);
  const onPeriodChange = (newPeriod: Period) => {
    const hours = getDateByType(date, "12hours");
    onDateChange(setDateByType(date, hours, "12hours", newPeriod));
  };

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="12hours"
          date={date}
          setDate={onDateChange}
          ref={hourRef}
          period={period}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={onDateChange}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      {seconds && (
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds" className="text-xs">
            Seconds
          </Label>
          <TimePickerInput
            picker="seconds"
            date={date}
            setDate={onDateChange}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </div>
      )}
      {/* <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div> */}
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs"></Label>
        <Select
          onValueChange={(value: Period) => onPeriodChange(value)}
          value={period}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder="AM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
