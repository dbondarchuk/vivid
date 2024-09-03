import { AppointmentStatus } from "@/types";

export const StatusText: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
};
