import { Time } from "./dateTime";

export interface MeetingEvent {
  duration: number;
  price?: number;
  meetingName: string;
  date: string;
  dateTime: string;
  time: Time;
  timeZone: string;
  fields: Record<string, string>;
}
