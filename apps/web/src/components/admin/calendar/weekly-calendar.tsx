"use client";

import { Button, cn, ScrollArea, ScrollBar } from "@vivid/ui";
import { formatTime, parseTime } from "@vivid/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime, HourNumbers, SecondNumbers } from "luxon";
import React, { Fragment, useCallback } from "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

const colStartClass = "col-start-[var(--calendar-col-start)]";
const colSpanClass = "col-end-[var(--calendar-col-end)]";
const rowStartClass = "row-start-[var(--calendar-row-start)]";
const rowSpanClass = "row-end-[var(--calendar-row-end)]";
const colsRepeatClass = "grid-cols-[var(--calendar-grid-cols)]";

export type CalendarEventVariant = "primary" | "secondary" | "tertiary";

export type CalendarEvent = {
  id?: string;
  start: Date;
  end: Date;
  title: string;
  variant?: CalendarEventVariant;
};

export type WeeklyCalendarProps = {
  date?: Date;
  variant?: "week-of" | "days-around";
  daysAround?: number;
  events?: CalendarEvent[];
  className?: string;
  scrollToHour?: HourNumbers;
  slotInterval?: 5 | 10 | 15 | 20 | 30;
  disableTimeChange?: boolean;
  onRangeChange?: (start: Date, end: Date) => void;
  onEventClick?: (id?: string) => void;
};

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  date,
  variant = "week-of",
  daysAround = 3,
  events: propsEvents,
  className,
  scrollToHour = 8,
  disableTimeChange = false,
  slotInterval = 5,
  onEventClick,
  onRangeChange,
}) => {
  const timeSlotColCount = 1;
  const slotsPerHour = 60 / slotInterval;

  const timeSlots = Array.from({ length: 24 }).flatMap((_, hour) =>
    Array.from({ length: slotsPerHour }).map((_, index) =>
      formatTime({
        hour: hour as HourNumbers,
        minute: (index * slotInterval) as SecondNumbers,
      })
    )
  );

  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const offset = scrollRef?.current?.offsetTop;

    scrollAreaRef?.current?.scrollTo({
      top: offset,
      behavior: "instant",
    });
  }, [scrollRef]);

  const getDates = (day: Date) => {
    switch (variant) {
      case "days-around":
        return Array.from({ length: daysAround * 2 + 1 })
          .map((_, index) => -1 * daysAround + index)
          .map((d) =>
            DateTime.fromJSDate(day).startOf("day").plus({ days: d })
          );

      case "week-of":
      default:
        return [0, 1, 2, 3, 4, 5, 6].map((d) =>
          DateTime.fromJSDate(day).startOf("week").plus({ days: d })
        );
    }
  };

  const [dates, setDates] = React.useState<DateTime[]>(
    getDates(date || new Date())
  );

  React.useEffect(() => {
    setDates(getDates(date || new Date()));
  }, [date]);

  React.useEffect(() => {
    onRangeChange?.(dates[0].toJSDate(), dates[dates.length - 1].toJSDate());
  }, [dates]);

  const previous = React.useCallback(() => {
    let prevDate: DateTime;
    switch (variant) {
      case "days-around":
        prevDate = dates[0].minus({ days: daysAround + 1 });
        break;

      case "week-of":
      default:
        prevDate = dates[0].minus({ weeks: 1 });
        break;
    }

    setDates(getDates(prevDate.toJSDate()));
  }, [dates, getDates]);

  const next = React.useCallback(() => {
    let nextDate: DateTime;
    switch (variant) {
      case "days-around":
        nextDate = dates[0].plus({ days: daysAround + 1 });
        break;

      case "week-of":
      default:
        nextDate = dates[0].plus({ weeks: 1 });
        break;
    }

    setDates(getDates(nextDate.toJSDate()));
  }, [dates, getDates]);

  const events = (propsEvents || []).map((event) => {
    const start = DateTime.fromJSDate(event.start);
    const end = DateTime.fromJSDate(event.end);
    return {
      ...event,
      start,
      end: end,
      isMultiDay: end.diff(start, "hours").hours >= 24,
    };
  });

  const getEventClassNames = useCallback(
    (event: (typeof events)[number]) => {
      const previousMultiDayEvents = events.filter(
        ({ isMultiDay }, index) => isMultiDay && index < events.indexOf(event)
      );
      const previousNonMultiDayEvents = events.filter(
        ({ isMultiDay }, index) => !isMultiDay && index < events.indexOf(event)
      );
      const isOverlappingNonMultiDay =
        !event.isMultiDay &&
        previousNonMultiDayEvents.reduce(
          (isEventOverlappingPreviousEvents, otherAppointment) => {
            return (
              isEventOverlappingPreviousEvents ||
              (event.start < otherAppointment.end &&
                event.end > otherAppointment.start)
            );
          },
          false
        );

      // Disallow negative index (if date outside of range, the
      // event should start at the first date in props.dates)
      const dateIndex = Math.max(
        0,
        dates.findIndex((date) =>
          date
            .toFormat("YYYY-MM-DD")
            .startsWith(event.start.toFormat("YYYY-MM-DD"))
        )
      );

      const styles = {
        "--calendar-col-start": `${timeSlotColCount + dateIndex + 1}`,
        "--calendar-col-end": `span ${Math.floor(
          Math.min(
            dates.length - dateIndex,
            event.end.diff(
              event.start > dates[0] ? event.start : dates[0],
              "days"
            ).days
          )
        )}`,
        "--calendar-row-start": `${
          (event.isMultiDay
            ? previousMultiDayEvents.reduce((rowStart, multiDayEvent) => {
                // Move the event down a row if it overlaps with a previous event
                if (
                  event.start < multiDayEvent.end &&
                  event.end > multiDayEvent.start
                ) {
                  rowStart++;
                }
                return rowStart;
              }, 1)
            : timeSlots.indexOf(
                event.start
                  .set({
                    minute:
                      event.start.minute - (event.start.minute % slotInterval),
                  })
                  .toFormat("HH:mm") as (typeof timeSlots)[number]
              )) + 1
        }`,
        "--calendar-row-end": `span ${Math.floor(
          event.end.diff(event.start, "minutes").minutes / slotInterval
        )}`,
      };

      const variants: Record<CalendarEventVariant, string> = {
        primary: "bg-slate-800 text-white hover:bg-indigo-900",
        secondary: "bg-slate-300 text-darkNavyBlue hover:bg-slate-200",
        tertiary: "bg-slate-600 text-white hover:bg-indigo-200",
      };

      const classes = cn(
        "flex max-h-full flex-col break-words rounded p-[7px_6px_5px] text-[13px] leading-[20px] no-underline transition-[background-color] z-[2] hover:z-[2] hover:h-min hover:max-h-none hover:min-h-full cursor-pointer",
        colStartClass,
        event.isMultiDay && colSpanClass,
        rowStartClass,
        !event.isMultiDay && rowSpanClass,
        variants[event.variant || "primary"] || variants.primary,
        isOverlappingNonMultiDay &&
          "w-[75%] ml-[25%] border border-white text-right z-[3] hover:z-[4]"
      );

      return {
        styles,
        classes,
      };
    },
    [dates, events, timeSlotColCount]
  );

  const sizePerRow = 64 / (timeSlots.length / 24);

  return (
    <ScrollArea
      className={cn("p-3 max-w-full", className)}
      viewportRef={scrollAreaRef}
    >
      <div
        className={cn(
          "flex flex-row items-center pb-2 bg-background sticky z-[5] top-0 h-12",
          disableTimeChange ? "justify-center" : "justify-between"
        )}
      >
        {!disableTimeChange && (
          <Button variant="outline" onClick={previous}>
            <ChevronLeft />
          </Button>
        )}
        <div>
          {dates[0].toLocaleString(DateTime.DATE_MED)} -{" "}
          {dates[dates.length - 1].toLocaleString(DateTime.DATE_MED)}
        </div>
        {!disableTimeChange && (
          <Button variant="outline" onClick={next}>
            <ChevronRight />
          </Button>
        )}
      </div>
      <div className="w-full h-full border-x border-b border-secondary">
        <div
          className={cn(
            "px-2 grid grid-rows-1 gap-0 sticky top-12 bg-background z-[5] shadow-md  border-y border-secondary",
            colsRepeatClass
            //colsRepeatClasses[dates.length as keyof typeof colsRepeatClasses]
          )}
          style={{
            "--calendar-grid-cols": `repeat(${dates.length + 1}, ${(
              100 /
              (dates.length + 1)
            ).toFixed(3)}%)`,
          }}
        >
          <div></div>
          {dates.map((date, index) => {
            return (
              <Fragment key={`date-${date.toISO()}`}>
                <div
                  className={cn(
                    "text-darkGray row-start-1 col-span-1 px-2 py-6 text-center text-[13px] text-xs",
                    colStartClass
                  )}
                  style={{
                    "--calendar-col-start": timeSlotColCount + index + 1,
                  }}
                >
                  {date.toFormat("EEE, MMM dd")}
                </div>
                <div
                  className={cn(
                    "text-darkGray row-start-1 col-span-1 px-2 py-6 text-center text-[13px] text-xs border-r border-secondary",
                    colStartClass
                  )}
                  style={{
                    "--calendar-col-start": timeSlotColCount + index,
                  }}
                ></div>
              </Fragment>
            );
          })}
          <div
            className={cn(
              "text-darkGray row-start-1 col-span-1 px-2 py-6 text-center text-[13px] text-xs border-r border-secondary",
              colStartClass
            )}
            style={{
              "--calendar-col-start": timeSlotColCount + dates.length,
            }}
          ></div>

          {events
            .filter(({ isMultiDay }) => isMultiDay)
            .map((event, index) => {
              const classes = getEventClassNames(event);
              const {
                "--calendar-row-end": _,
                "--calendar-row-start": __,
                ...restStyles
              } = classes.styles;
              return (
                <div
                  key={`event-${index}`}
                  onClick={() => event.id && onEventClick?.(event.id)}
                  className={cn(
                    classes.classes,
                    dates[0].startOf("day") > event.start && "rounded-l-none ",
                    dates[dates.length - 1].plus({ days: 1 }).startOf("day") <
                      event.end && "rounded-r-none ",
                    "mt-0.5"
                  )}
                  style={restStyles}
                >
                  {event.title}
                </div>
              );
            })}
        </div>

        <div
          className={cn(
            "mt-8 px-2 grid grid-rows-[var(--rows-repeat)] gap-0",
            colsRepeatClass
          )}
          style={{
            "--calendar-grid-cols": `repeat(${dates.length + 1}, ${(
              100 /
              (dates.length + 1)
            ).toFixed(3)}%)`,
            "--rows-repeat": `repeat(${timeSlots.length},${sizePerRow}px)`,
          }}
        >
          {Array.from({ length: dates.length + 1 }).map((_, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "text-darkGray row-start-1 row-span-full translate-y-[var(--translate-y)] col-span-1 py-6 text-center text-[13px] text-xs border-r border-secondary",
                  colStartClass
                )}
                style={{
                  "--calendar-col-start": timeSlotColCount + index,
                  //"--translate-y": `-${sizePerRow * 2}px`,
                }}
              ></div>
            );
          })}
          {timeSlots.map((time, index) => {
            const timeObj = parseTime(time);
            return (
              <Fragment key={`time-slot-${time}`}>
                <div
                  className={cn(
                    rowStartClass,
                    "text-darkGray translate-y-[var(--translate-y)] text-xs leading-[30px] col-span-full border-t scroll-m-16",
                    time.endsWith("00")
                      ? "col-start-1 border-secondary"
                      : "col-start-2 border-primary/20"
                  )}
                  style={{
                    "--calendar-row-start": index + 1,
                    //"--translate-y": `-${sizePerRow * 2}px`,
                  }}
                  data-time={time}
                  ref={
                    timeObj.hour === scrollToHour && timeObj.minute === 0
                      ? scrollRef
                      : undefined
                  }
                ></div>
                <div
                  className={cn(
                    rowStartClass,
                    "text-darkGray translate-y-[var(--translate-y)] text-xs leading-[30px] col-start-1"
                  )}
                  style={{
                    "--calendar-row-start": index + 1,
                    "--translate-y": time.endsWith("00")
                      ? // ? "100%"
                        "20px"
                      : "",
                    // : `-${sizePerRow}px`,
                  }}
                  suppressHydrationWarning
                >
                  {!time.endsWith("00") ? (
                    <>&nbsp;</>
                  ) : (
                    DateTime.fromObject({
                      ...timeObj,
                      year: 2000,
                      month: 1,
                      day: 1,
                    }).toLocaleString(DateTime.TIME_SIMPLE)
                  )}
                </div>
              </Fragment>
            );
          })}

          {events
            .filter((event) => {
              const hours = event.end.diff(event.start, "hours").hours;
              return hours < 24;
            })
            .map((event, index) => {
              const { classes, styles } = getEventClassNames(event);
              return (
                <div
                  data-id={event.id}
                  key={`time-slot-event-${index}`}
                  onClick={() => event.id && onEventClick?.(event.id)}
                  className={classes}
                  style={styles}
                >
                  <div className="min-h-0 overflow-hidden">{event.title}</div>
                  {event.end.diff(event.start, "minutes").minutes / 30 > 1 && (
                    <div className="pt-1 text-[10px]" suppressHydrationWarning>
                      {event.start.toLocaleString(DateTime.TIME_SIMPLE)} -{" "}
                      {event.end.toLocaleString(DateTime.TIME_SIMPLE)}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
