import { HourNumbers, MinuteNumbers } from "luxon";

export interface DateTime {
  date: Date;
  time: Time;
  timeZone: string;
}

export interface Time {
  hour: HourNumbers;
  minute: MinuteNumbers;
}

export const formatTime = (time: Time) =>
  `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;

export const areTimesEqual = (
  timeA: Time | undefined | null,
  timeB: Time | undefined | null
) => timeA?.hour === timeB?.hour && timeA?.minute === timeB?.minute;
