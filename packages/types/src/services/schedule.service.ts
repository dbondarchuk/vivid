import { DaySchedule } from "../configuration/schedule";

export interface IScheduleService {
  getSchedule(start: Date, end: Date): Promise<Record<string, DaySchedule>>;
}
