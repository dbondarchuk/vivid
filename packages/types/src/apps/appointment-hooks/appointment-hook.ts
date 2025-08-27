import { Appointment, AppointmentStatus } from "../../booking";
import { ConnectedAppData } from "../connected-app.data";

export interface IAppointmentHook {
  onAppointmentCreated(
    appData: ConnectedAppData,
    appointment: Appointment,
    confirmed: boolean,
  ): Promise<void>;
  onAppointmentStatusChanged(
    appData: ConnectedAppData,
    appointment: Appointment,
    newStatus: AppointmentStatus,
    oldStatus?: AppointmentStatus,
  ): Promise<void>;
  onAppointmentRescheduled(
    appData: ConnectedAppData,
    appointment: Appointment,
    newTime: Date,
    newDuration: number,
    oldTime?: Date,
    oldDuration?: number,
  ): Promise<void>;
}
