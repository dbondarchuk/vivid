import { Appointment } from "@/types";
import { EventAttributes } from "ics";
import { ConfigurationService } from "../configurationService";
import { getArguments } from "./getArguments";
import { INotificationService } from "./notificaionService.interface";

export type IcalEventMethod = "PUBLISH" | "REQUEST" | "CANCEL" | "REPLY";

export type Email = {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  body: string;
  icalEvent?: {
    method: IcalEventMethod;
    filename?: string;
    content: EventAttributes;
  };
};

export abstract class BaseNotificationService implements INotificationService {
  constructor(protected readonly configurationService: ConfigurationService) {}
  abstract sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void>;
  abstract sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void>;
  abstract sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void>;
  abstract sendAppointmentRescheduledNotification(
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void>;

  protected async getArguments(appointment: Appointment) {
    const booking = await this.configurationService.getConfiguration("booking");
    const general = await this.configurationService.getConfiguration("general");
    const social = await this.configurationService.getConfiguration("social");

    return getArguments(appointment, booking, general, social);
  }
}
