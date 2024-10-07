import { AppointmentEvent } from "../booking";

export const appointmentStatuses = [
  "pending",
  "confirmed",
  "declined",
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export type Appointment = Omit<AppointmentEvent, "dateTime"> & {
  _id: string;
  dateTime: Date;
  status: AppointmentStatus;
  createdAt: Date;
};
