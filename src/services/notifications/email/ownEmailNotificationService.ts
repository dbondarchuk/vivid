import { template } from "@/lib/string";
import { Appointment } from "@/types";
import { readFile } from "fs/promises";
import { join } from "path";
import { IcalEventMethod } from "../notificaionService.base";
import { IEmailNotificationService } from "./emailNotificationService";
import { sendEmail } from "./sendEmail";

export class OwnEmailNotificationService extends IEmailNotificationService {
  public async sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void> {
    this.sendOwnerEmail(appointment, "ownerNewPendingAppointment", "REQUEST");
  }

  async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    this.sendOwnerEmail(appointment, "ownerAppointmentDeclined", "CANCEL");
  }

  async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    this.sendOwnerEmail(appointment, "ownerAppointmentConfirmed", "PUBLISH");
  }

  async sendAppointmentRescheduledNotification(
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void> {
    this.sendOwnerEmail(
      {
        ...appointment,
        dateTime: newTime,
        totalDuration: newDuration,
      },
      "ownerAppointmentRescheduled",
      "REQUEST"
    );
  }

  private async sendOwnerEmail(
    appointment: Appointment,
    templateName: string,
    eventMethod: IcalEventMethod
  ) {
    const { bookingConfiguration, arg } = await this.getArguments(appointment);

    const eventSummary = this.getEventSummary(appointment);

    const bodyTemplate = await readFile(
      join(process.cwd(), "templates", "email", `${templateName}.html`),
      "utf-8"
    );

    const description = template(bodyTemplate, arg);

    const eventContent = await this.getEventCalendarContent(
      appointment,
      eventSummary,
      description,
      eventMethod
    );

    await sendEmail(
      {
        to: bookingConfiguration.email.to,
        subject: `Appointment for ${arg.option!.name} by ${
          arg.fields!.name
        } at ${arg.dateTime}`,
        body: description,
        icalEvent: {
          method: eventMethod,
          content: eventContent,
        },
      },
      "Owner Email Notification Service",
      appointment._id
    );
  }

  private getEventSummary(appointment: Appointment) {
    return `${appointment.fields.name} for ${appointment.option.name}`;
  }
}
