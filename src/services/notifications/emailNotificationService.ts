import { Appointment } from "@/types";
import * as ics from "ics";
import { createEvent, EventAttributes } from "ics";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import { ConfigurationService } from "../configurationService";
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

export type CalendarEventOptions = {
  from: string;
  address?: string;
  name: string;
  url: string;
};

export abstract class IEmailNotificationService
  implements INotificationService
{
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

  protected async getArguments(appointment: Appointment) {
    const booking = await this.configurationService.getConfiguration("booking");
    const general = await this.configurationService.getConfiguration("general");
    const social = await this.configurationService.getConfiguration("social");

    const arg = {
      ...appointment,
      dateTime: DateTime.fromJSDate(appointment.dateTime).toLocaleString(
        DateTime.DATETIME_SHORT
      ),
      config: {
        ...general,
        ...social,
      },
    };

    return {
      booking,
      general,
      social,
      arg,
    };
  }

  protected async sendEmail(email: Email) {
    const smtp = await this.configurationService.getConfiguration("smtp");

    const mailOptions: nodemailer.SendMailOptions = {
      from: smtp.email,
      to: email.to,
      cc: email.cc,
      subject: email.subject,
      html: email.body,
      icalEvent: email.icalEvent
        ? {
            filename: email.icalEvent.filename || "invitation.ics",
            method: email.icalEvent.method,
            content: createEvent(email.icalEvent.content).value,
          }
        : undefined,
    };

    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.auth.user,
        pass: smtp.auth.pass,
      },
    });

    await transport.sendMail(mailOptions);
  }

  protected async getEventCalendarContent(
    event: Appointment,
    summary: string,
    description: string,
    method: IcalEventMethod = "REQUEST"
  ) {
    const booking = await this.configurationService.getConfiguration("booking");
    const { address, name, url } =
      await this.configurationService.getConfiguration("general");

    const config: CalendarEventOptions = {
      from: booking.email.from,
      address,
      name,
      url,
    };

    const host = new URL(config.url).host;
    const date = DateTime.fromJSDate(event.dateTime);

    const icsEvent: ics.EventAttributes = {
      method,
      uid: `${date.toMillis()}@${host}`,
      start: date.toMillis(),
      end: date.plus({ minutes: event.totalDuration }).toMillis(),
      startInputType: "utc",
      endInputType: "utc",
      organizer: {
        email: config.from,
        name: config.name,
      },
      url: `${config.url}/admin/dashboard/appointments/${event._id}`,
      title: summary,
      description: description,
      location: config.address,
      attendees: [
        {
          partstat: "ACCEPTED",
          name: event.fields.name,
          email: event.fields.email,
        },
      ],
    };

    return icsEvent;
  }
}
