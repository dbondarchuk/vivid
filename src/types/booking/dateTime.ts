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
