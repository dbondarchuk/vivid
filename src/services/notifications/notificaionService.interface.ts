import { Appointment } from "@/types";

export interface INotificationService {
  sendAppointmentRequestedNotification(appointment: Appointment): Promise<void>;
  sendAppointmentDeclinedNotification(appointment: Appointment): Promise<void>;
  sendAppointmentConfirmedNotification(appointment: Appointment): Promise<void>;
  sendAppointmentRescheduledNotification(
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void>;
}
