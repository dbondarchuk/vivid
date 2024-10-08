"use client";

import React from "react";
import {
  CalendarEvent,
  WeeklyCalendar,
  WeeklyCalendarProps,
} from "./weeklyCalendar";
import { DateTime } from "luxon";
import { Appointment, Event } from "@/types";
import { AppointmentDialog } from "../appointments/appointment.dialog";

export const WeeklyCalendarWrapper: React.FC<
  Omit<WeeklyCalendarProps, "events" | "variant">
> = (props) => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [appointment, setAppointment] = React.useState<
    Appointment | undefined
  >();
  const [loading, setLoading] = React.useState(false);

  const getEvents = async (start: Date, end: Date) => {
    setLoading(true);
    const response = await fetch(
      `/admin/api/events?start=${DateTime.fromJSDate(
        start
      ).toISO()}&end=${DateTime.fromJSDate(end).toISO()}`
    );

    setLoading(false);

    const apiEvents = (await response.json()) as Event[];

    setEvents(
      (apiEvents || []).map((a) => ({
        ...a,
        dateTime: DateTime.fromISO(a.dateTime as unknown as string).toJSDate(),
      }))
    );
  };

  const calendarEvents: CalendarEvent[] = React.useMemo(
    () =>
      events.map((app) => {
        const start = DateTime.fromJSDate(app.dateTime);
        if ("_id" in app) {
          return {
            start: start.toJSDate(),
            end: start.plus({ minutes: app.totalDuration || 0 }).toJSDate(),
            id: app._id,
            title: `${app.fields.name} for ${app.option.name}`,
            variant: app.status !== "confirmed" ? "secondary" : "primary",
          };
        } else {
          return {
            start: start.toJSDate(),
            end: start.plus({ minutes: app.totalDuration || 0 }).toJSDate(),
            title: app.title,
            variant: "tertiary",
          };
        }
      }),
    [events]
  );

  const onEventClick = (id?: string) => {
    if (!id) return;
    const appointment = events.find(
      (app) => (app as Appointment)._id == id
    ) as Appointment;
    if (appointment) setAppointment(appointment);
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setAppointment(undefined);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute bg-white bg-opacity-60 z-50 h-full w-full flex items-center justify-center">
          <div className="flex items-center">
            <span className="text-3xl mr-4">Loading</span>
            <svg
              className="animate-spin h-8 w-8 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      )}
      <WeeklyCalendar
        {...props}
        onRangeChange={getEvents}
        events={calendarEvents}
        onEventClick={onEventClick}
      />
      {appointment && (
        <AppointmentDialog
          appointment={appointment}
          open={true}
          onOpenChange={onDialogOpenChange}
        />
      )}
    </div>
  );
};
