import { template } from "@/lib/string";
import { Appointment } from "@/types";
import { IEmailNotificationService } from "./emailNotificationService";
import { sendEmail } from "./sendEmail";

export class CustomerEmailNotificationService extends IEmailNotificationService {
  public async sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, arg } = await this.getArguments(appointment);
    const smtpConfiguration = await this.getSmtpConfiguration();

    const eventContent = await this.getEventCalendarContent(
      appointment,
      template(bookingConfiguration.email.event.summary, arg),
      template(bookingConfiguration.email.event.description, arg)
    );

    const { subject, body } = bookingConfiguration.email.templates.pending;

    await sendEmail(
      {
        to: appointment.fields.email,
        subject: template(subject, arg),
        body: template(body, arg),
        icalEvent: {
          method: "REQUEST",
          content: eventContent,
        },
      },
      smtpConfiguration
    );
  }

  async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, arg } = await this.getArguments(appointment);
    const smtpConfiguration = await this.getSmtpConfiguration();

    const eventContent = await this.getEventCalendarContent(
      appointment,
      template(bookingConfiguration.email.event.summary, arg),
      template(bookingConfiguration.email.event.description, arg),
      "CANCEL"
    );

    const { subject, body } = bookingConfiguration.email.templates.declined;

    await sendEmail(
      {
        to: appointment.fields.email,
        subject: template(subject, arg),
        body: template(body, arg),
        icalEvent: {
          method: "CANCEL",
          content: eventContent,
        },
      },
      smtpConfiguration
    );
  }

  async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, arg } = await this.getArguments(appointment);
    const smtpConfiguration = await this.getSmtpConfiguration();

    const eventContent = await this.getEventCalendarContent(
      appointment,
      template(bookingConfiguration.email.event.summary, arg),
      template(bookingConfiguration.email.event.description, arg),
      "PUBLISH"
    );

    const { subject, body } = bookingConfiguration.email.templates.confirmed;

    await sendEmail(
      {
        to: appointment.fields.email,
        subject: template(subject, arg),
        body: template(body, arg),
        icalEvent: {
          method: "PUBLISH",
          content: eventContent,
        },
      },
      smtpConfiguration
    );
  }

  async sendAppointmentRescheduledNotification(
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void> {
    const newAppointment: Appointment = {
      ...appointment,
      dateTime: newTime,
      totalDuration: newDuration,
    };

    const { bookingConfiguration, arg } = await this.getArguments(
      newAppointment
    );
    const smtpConfiguration = await this.getSmtpConfiguration();

    const eventContent = await this.getEventCalendarContent(
      newAppointment,
      template(bookingConfiguration.email.event.summary, arg),
      template(bookingConfiguration.email.event.description, arg),
      "REQUEST"
    );

    const { subject, body } = bookingConfiguration.email.templates.rescheduled;

    await sendEmail(
      {
        to: appointment.fields.email,
        subject: template(subject, arg),
        body: template(body, arg),
        icalEvent: {
          method: "REQUEST",
          content: eventContent,
        },
      },
      smtpConfiguration
    );
  }
}