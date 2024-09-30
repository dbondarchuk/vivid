import { Appointment } from "../database";

export type Event =
  | Appointment
  | {
      uid: string;
      title: string;
      dateTime: Date;
      totalDuration: number;
    };
