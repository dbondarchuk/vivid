import { AssetEntity } from "../assets";
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
    confirmed?: boolean;
    force?: boolean;
    files?: Record<string, File>;
    paymentIntentId?: string;
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
      customerId?: string | string[];
      discountId?: string | string[];
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
  addAppointmentFiles(id: string, files: File[]): Promise<AssetEntity[]>;
  rescheduleAppointment(
    id: string,
    newTime: Date,
    newDuration: number
  ): Promise<void>;
}
