"use client";

import React from "react";
import { WeeklyEventCalendar } from "./weekly-event-calendar";
import { DateTime } from "luxon";
import {
  Appointment,
  DaySchedule,
  Event,
  HourNumbers,
  StatusText,
} from "@vivid/types";
import { AppointmentDialog } from "../appointments/appointment-dialog";
import { CalendarEvent, EventCalendarProps } from "./types";
import { MonthlyEventCalendar } from "./monthly-event-calendar";
import { EventPopover } from "./event-popover";
import { AgendaEventCalendar } from "./agenda-event-calendar";
import {
  Presentation,
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  StickyNote,
} from "lucide-react";

export const EventCalendar: React.FC<EventCalendarProps> = (props) => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [appointment, setAppointment] = React.useState<
    Appointment | undefined
  >();

  const [schedule, setSchedule] = React.useState<Record<string, DaySchedule>>(
    {}
  );

  const [loading, setLoading] = React.useState(false);

  const getEvents = async (start: Date, end: Date) => {
    setLoading(true);
    setEvents([]);

    const [eventsResponse, scheduleResponse] = await Promise.all([
      fetch(
        `/admin/api/events?start=${DateTime.fromJSDate(start)
          .startOf("day")
          .toISO()}&end=${DateTime.fromJSDate(end).endOf("day").toISO()}`
      ),
      fetch(
        `/admin/api/schedule?start=${DateTime.fromJSDate(start)
          .startOf("day")
          .toISO()}&end=${DateTime.fromJSDate(end).endOf("day").toISO()}`
      ),
    ]);

    const apiEvents = (await eventsResponse.json()) as Event[];
    const schedule = (await scheduleResponse.json()) as Record<
      string,
      DaySchedule
    >;

    setLoading(false);

    setSchedule(schedule);
    setEvents(
      (apiEvents || []).map((a) => {
        if ("createdAt" in a) {
          a.createdAt = DateTime.fromISO(
            a.createdAt as unknown as string
          ).toJSDate();
        }

        return {
          ...a,
          dateTime: DateTime.fromISO(
            a.dateTime as unknown as string
          ).toJSDate(),
        };
      })
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

  const onEventClick = ({ id }: CalendarEvent) => {
    if (!id) {
      return;
    }

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

  const renderEventAgenda = React.useCallback(
    (event: CalendarEvent) => {
      if (!event.id) {
        return null;
      }

      const appointment = events.find(
        (app) => (app as Appointment)._id == event.id
      ) as Appointment;

      return (
        <dl className="divide-y">
          <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
            <dt className="flex self-center items-center gap-1">
              <Presentation size={16} /> Appointment:
            </dt>
            <dd className="col-span-2">{appointment.option.name}</dd>
          </div>
          <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
            <dt className="flex self-center items-center gap-1">
              <CheckCircle size={16} /> Status:
            </dt>
            <dd className="col-span-2">{StatusText[appointment.status]}</dd>
          </div>
          {appointment.totalPrice && (
            <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
              <dt className="flex self-center items-center gap-1">
                <DollarSign size={16} /> Price:
              </dt>
              <dd className="col-span-2">${appointment.totalPrice}</dd>
            </div>
          )}
          {appointment.note && (
            <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
              <dt className="flex self-center items-center gap-1">
                <StickyNote size={16} /> Note:
              </dt>
              <dd className="col-span-2">{appointment.note}</dd>
            </div>
          )}
        </dl>
      );
    },
    [events]
  );

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
      {props.type === "weekly" ? (
        <WeeklyEventCalendar
          onRangeChange={getEvents}
          events={calendarEvents}
          onEventClick={onEventClick}
          variant="week-of"
          schedule={schedule}
          {...props}
        />
      ) : props.type === "daily" ? (
        <WeeklyEventCalendar
          variant="days-around"
          daysAround={0}
          onRangeChange={getEvents}
          events={calendarEvents}
          onEventClick={onEventClick}
          schedule={schedule}
          {...props}
        />
      ) : props.type === "days-around" ? (
        <WeeklyEventCalendar
          onRangeChange={getEvents}
          events={calendarEvents}
          variant="days-around"
          onEventClick={onEventClick}
          schedule={schedule}
          {...props}
        />
      ) : props.type === "agenda" ? (
        <AgendaEventCalendar
          onRangeChange={getEvents}
          events={calendarEvents}
          onEventClick={onEventClick}
          renderEvent={renderEventAgenda}
          schedule={schedule}
          {...props}
        />
      ) : (
        <MonthlyEventCalendar
          onRangeChange={getEvents}
          events={calendarEvents}
          onEventClick={onEventClick}
          schedule={schedule}
          {...props}
        />
      )}

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
