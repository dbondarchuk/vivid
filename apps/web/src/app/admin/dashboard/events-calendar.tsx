"use client";

import {
  EventCalendar,
  EventCalendarType,
} from "@/components/admin/event-calendar";
import {
  Button,
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vivid/ui";
import { DateTime } from "luxon";
import React from "react";
import { useCookies } from "react-cookie";

type EventsCalendarView = Exclude<EventCalendarType, "days-around">;

const COOKIE_NAME = "events-calendar-view";
type CookieValues = {
  [COOKIE_NAME]?: EventsCalendarView;
};

export const EventsCalendar = () => {
  const [cookies, setCookies] = useCookies<typeof COOKIE_NAME, CookieValues>([
    COOKIE_NAME,
  ]);

  const [date, setDate] = React.useState(
    DateTime.now().startOf("day") as DateTime
  );

  const [type, setType] = React.useState<EventsCalendarView>(
    cookies[COOKIE_NAME] ?? "weekly"
  );

  const changeType = (view: EventsCalendarView) => {
    setType(view);
    setCookies(COOKIE_NAME, view, {
      expires: DateTime.now().plus({ years: 1 }).toJSDate(),
    });
  };

  return (
    <div className="grid gap-3 w-full">
      <div className="flex flex-row gap-2 justify-between">
        <Button onClick={() => setDate(DateTime.now())}>Today</Button>
        <Select
          value={type}
          onValueChange={(value) => changeType(value as typeof type)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <EventCalendar
        date={date.toJSDate()}
        type={type}
        className={cn(
          "w-full",
          type !== "monthly" && type !== "agenda" && "h-[100vh]"
        )}
        onDateClick={(date) => {
          setDate(DateTime.fromJSDate(date));
          setType("daily");
        }}
      />
    </div>
  );
};
