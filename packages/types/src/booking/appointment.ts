import { AppointmentEvent } from ".";
import { Asset } from "../assets";

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
  files?: Asset[];
};

export const StatusText: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
};
