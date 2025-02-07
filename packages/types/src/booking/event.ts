import { Appointment } from "./appointment";

export type Event =
  | Appointment
  | {
      uid: string;
      title: string;
      dateTime: Date;
      totalDuration: number;
    };
