import { AppointmentEvent, Payment } from ".";
import { AssetEntity } from "../assets";
import { Customer } from "../customers";

export const appointmentStatuses = [
  "pending",
  "confirmed",
  "declined",
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export type AppointmentEntity = AppointmentEvent & {
  _id: string;
  status: AppointmentStatus;
  createdAt: Date;
  customerId: string;
};

export type Appointment = AppointmentEntity & {
  customer: Customer;
  files?: AssetEntity[];
  payments?: Payment[];
  endAt: Date;
};

// export const StatusText: Record<AppointmentStatus, string> = {
//   pending: "Pending",
//   confirmed: "Confirmed",
//   declined: "Declined",
// };
