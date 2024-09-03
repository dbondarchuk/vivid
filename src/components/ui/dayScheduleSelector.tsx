import { formatTime, parseTime } from "@/lib/time";
import { AvailablePeriod, Shift, Time } from "@/types";
import { DateTime, HourNumbers, Info, MinuteNumbers } from "luxon";
import React from "react";
import { ScrollArea } from "./scroll-area";
import { boolean } from "zod";
import { cn } from "@/lib/utils";
import { isUtf8 } from "buffer";

export type DayScheduleSelectorProps = {
  days?: number[];
  startTime?: Time;
  endTime?: Time;
  interval?: 5 | 10 | 15 | 20 | 30 | 60;
  value?: AvailablePeriod[];
  scrollTo?: HourNumbers;
  onChange: (value: AvailablePeriod[]) => void;
};

const timeDiff = (start: Time, end: Time) =>
  (new Date(2000, 0, 1, end.hour, end.minute).getTime() -
    new Date(2000, 0, 1, start.hour, start.minute).getTime()) /
  60000;

const generateSlots = (start: Time, end: Time, interval: number): Time[] => {
  const numOfRows = Math.ceil(timeDiff(start, end) / interval);
  return Array.from({ length: numOfRows }).map((_, i) => {
    const date = new Date(
      new Date(2000, 0, 1, start.hour, start.minute).getTime() +
        i * interval * 60000
    );
    return {
      hour: date.getHours() as HourNumbers,
      minute: date.getMinutes() as MinuteNumbers,
    };
  });
};

const getKey = (day: number, slot: Time): string =>
  `${day}-${formatTime(slot)}`;

const deserialize = (
  schedule: AvailablePeriod[],
  days: number[],
  slots: Time[]
): Record<string, boolean> => {
  const result: Record<string, boolean> = {};
  for (let day of days) {
    const shifts = schedule.find((period) => period.weekDay === day)?.shifts;

    if (!shifts) continue;
    for (let slot of slots) {
      const formatSlot = formatTime(slot);
      for (let shift of shifts) {
        // We can compare time in lexicographical order
        if (formatSlot >= shift.end) break;
        if (formatSlot >= shift.start) {
          result[getKey(day, slot)] = true;
        }
      }
    }
  }

  return result;
};

// Convert seconds since midnight to HH:mm string, and simply ignore the seconds
const secondsSinceMidnightToTime = (seconds: number): Time => {
  var minutes = Math.floor(seconds / 60);
  return {
    hour: Math.floor(minutes / 60) as HourNumbers,
    minute: (minutes % 60) as MinuteNumbers,
  };
};

const timeToSecondsSinceMidnight = (time: Time): number =>
  time.hour * 60 * 60 + time.minute * 60;

const serialize = (
  selected: Record<string, boolean>,
  days: number[],
  slots: Time[],
  interval: number
): AvailablePeriod[] => {
  const result: Record<number, Shift[]> = {};
  for (let day of days) {
    let start: Time | undefined;
    let end: Time | undefined;

    let index = 0;
    for (let slot of slots) {
      index++;
      const key = getKey(day, slot);
      // Start of selection
      if (selected[key] && !start) {
        start = slot;
      }

      // End of selection (I am not selected, so select until my previous one.)
      if (!selected[key] && !!start) {
        end = slot;
      }

      // End of selection (I am the last one :) .)
      if (selected[key] && !!start && index === slots.length) {
        end = secondsSinceMidnightToTime(
          timeToSecondsSinceMidnight(slot) + interval * 60
        );
      }

      if (!!end) {
        if (!result[day]) result[day] = [];

        result[day].push({ start: formatTime(start!), end: formatTime(end) });
        start = undefined;
        end = undefined;
      }
    }
  }

  return Object.entries(result).map(([day, shifts]) => ({
    shifts,
    weekDay: parseInt(day.toString(), 10),
  }));
};

export const DayScheduleSelector: React.FC<DayScheduleSelectorProps> = ({
  days = [1, 2, 3, 4, 5, 6, 7],
  interval = 10,
  startTime = {
    hour: 0,
    minute: 0,
  },
  endTime = {
    hour: 23,
    minute: 59,
  },
  scrollTo = 8,
  value,
  onChange,
}) => {
  const slots = generateSlots(startTime, endTime, interval);
  const scrollToRef = React.useRef<HTMLTableRowElement>(null);

  React.useEffect(() => {
    scrollToRef?.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  const [selected, setSelected] = React.useState<Record<string, boolean>>(
    value ? deserialize(value, days, slots) : {}
  );

  const [selectingStart, setSelectingStart] = React.useState<
    { day: number; slot: Time } | undefined
  >();

  const startSelecting = React.useCallback(
    (day: number, slot: Time) => {
      const key = getKey(day, slot);
      if (selected[key]) {
        setSelected((old) => ({
          ...old,
          [key]: false,
        }));
      } else {
        setSelectingStart({ day, slot });
        setSelected((old) => ({
          ...old,
          [key]: true,
        }));
      }
    },
    [selected, setSelectingStart, setSelected]
  );

  const stopSelecting = React.useCallback(() => {
    setSelectingStart(undefined);
    onChange(serialize(selected, days, slots, interval));
  }, [setSelectingStart, selected, onChange, days, slots, interval]);

  const onSelect = React.useCallback(
    (day: number, slot: Time) => {
      if (selectingStart?.day !== day) return;

      const key = getKey(day, slot);
      setSelected((old) => ({
        ...old,
        [key]: !old[key],
      }));
    },
    [selectingStart, setSelected]
  );

  return (
    <ScrollArea className="h-[60vh] max-h-screen">
      <table className="table-fixed w-full border-collapse border-spacing-1">
        <thead>
          <tr>
            <th className="max-w-8"></th>
            {days.map((day) => (
              <th key={day}>{Info.weekdays("short")[(day + 6) % 7]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr
              key={formatTime(slot)}
              className={cn(
                slot.minute === 0
                  ? "border-t border-gray-200 first:border-none"
                  : ""
              )}
              ref={
                slot.hour === scrollTo && slot.minute === 0
                  ? scrollToRef
                  : undefined
              }
            >
              {slot.minute === 0 && (
                <td className="select-none" rowSpan={Math.floor(60 / interval)}>
                  {formatTime(slot)}
                </td>
              )}
              {days.map((day) => {
                const key = getKey(day, slot);

                return (
                  <td
                    key={key}
                    onMouseDown={(e) => {
                      e.buttons === 1 && startSelecting(day, slot);
                    }}
                    onTouchStart={() => startSelecting(day, slot)}
                    onMouseUp={() => stopSelecting()}
                    onTouchEnd={() => stopSelecting()}
                    onMouseOver={() => onSelect(day, slot)}
                    className={cn(
                      "border h-4 cursor-pointer",
                      selected[key] ? "bg-sky-700" : "bg-gray-100"
                    )}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
};
