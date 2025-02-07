import { Time, parseTime as typesParseTime } from "@vivid/types";
import { DateTime, Duration } from "luxon";

export const parseTime = typesParseTime;

export const formatTime = (time: Time) =>
  `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;

export const formatTimeLocale = (time: Time) =>
  DateTime.fromObject({ hour: time.hour, minute: time.minute }).toLocaleString(
    DateTime.TIME_SIMPLE
  );

export const durationToTime = (minutes: number) => {
  const duration = Duration.fromObject({ minutes }).shiftTo("hours", "minutes");
  return {
    hours: duration.hours,
    minutes: duration.minutes,
  };
};

export const areTimesEqual = (
  timeA: Time | undefined | null,
  timeB: Time | undefined | null
) => timeA?.hour === timeB?.hour && timeA?.minute === timeB?.minute;
