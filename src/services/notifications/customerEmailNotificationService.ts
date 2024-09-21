import { template } from "@/lib/string";
import { Appointment } from "@/types";
import { IEmailNotificationService } from "./emailNotificationService";

export class CustomerEmailNotificationService extends IEmailNotificationService {
  public async sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { booking, arg } = await this.getArguments(appointment);

    const eventContent = await this.getEventCalendarContent(
      appointment,
      template(booking.email.event.summary, arg),
      template(booking.email.event.description, arg)
    );

    const { subject, body } = booking.email.templates.pending;

    await this.sendEmail({
      to: appointment.fields.email,
      subject: template(subject, arg),
      body: template(body, arg),
      icalEvent: {
        method: "REQUEST",
        content: eventContent,
      },
    });
  }

  async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { booking, arg } = await this.getArguments(appointment);

    const eventContent = await this.getEventCalendarContent(
      appointment,
      template(booking.email.event.summary, arg),
      template(booking.email.event.description, arg),
      "CANCEL"
    );

    const { subject, body } = booking.email.templates.declined;

    await this.sendEmail({
      to: appointment.fields.email,
      subject: template(subject, arg),
      body: template(body, arg),
      icalEvent: {
        method: "CANCEL",
        content: eventContent,
      },
    });
  }

  async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { booking, arg } = await this.getArguments(appointment);

    const eventContent = await this.getEventCalendarContent(
      appointment,
      template(booking.email.event.summary, arg),
      template(booking.email.event.description, arg),
      "PUBLISH"
    );

    const { subject, body } = booking.email.templates.confirmed;

    await this.sendEmail({
      to: appointment.fields.email,
      subject: template(subject, arg),
      body: template(body, arg),
      icalEvent: {
        method: "PUBLISH",
        content: eventContent,
      },
    });
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

    const { booking, arg } = await this.getArguments(newAppointment);

    const eventContent = await this.getEventCalendarContent(
      newAppointment,
      template(booking.email.event.summary, arg),
      template(booking.email.event.description, arg),
      "REQUEST"
    );

    const { subject, body } = booking.email.templates.rescheduled;

    await this.sendEmail({
      to: appointment.fields.email,
      subject: template(subject, arg),
      body: template(body, arg),
      icalEvent: {
        method: "REQUEST",
        content: eventContent,
      },
    });
  }
}
