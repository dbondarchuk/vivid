import { Asset } from "../assets";
import {
  Appointment,
  AppointmentEvent,
  AppointmentStatus,
  Availability,
  Event,
  Period,
} from "../booking";
import { Query, WithTotal } from "../database";
import { DateRange } from "../general";

export interface IEventsService {
  getAvailability(duration: number): Promise<Availability>;
  getBusyEventsInTimeFrame(start: Date, end: Date): Promise<Period[]>;
  getBusyEvents(): Promise<Period[]>;
  createEvent(args: {
    event: AppointmentEvent;
    status?: AppointmentStatus;
    force?: boolean;
    files?: Record<string, File>;
  }): Promise<Appointment>;
  getPendingAppointmentsCount(after?: Date): Promise<number>;
  getPendingAppointments(
    limit?: number,
    after?: Date
  ): Promise<WithTotal<Appointment>>;
  getNextAppointments(date: Date, limit?: number): Promise<Appointment[]>;
  getAppointments(
    query: Query & {
      range?: DateRange;
      status?: AppointmentStatus[];
    }
  ): Promise<WithTotal<Appointment>>;
  getEvents(
    start: Date,
    end: Date,
    status: AppointmentStatus[]
  ): Promise<Event[]>;
  getAppointment(id: string): Promise<Appointment | null>;
  changeAppointmentStatus(
    id: string,
    newStatus: AppointmentStatus
  ): Promise<void>;
  updateAppointmentNote(id: string, note?: string): Promise<void>;
  addAppointmentFiles(id: string, files: File[]): Promise<Asset[]>;
  addAppointmentAsset(id: string, assetId: string): Promise<void>;
  removeAppointmentFiles(id: string, filesIds: string[]): Promise<void>;
  rescheduleAppointment(
    id: string,
    newTime: Date,
    newDuration: number
  ): Promise<void>;
}
