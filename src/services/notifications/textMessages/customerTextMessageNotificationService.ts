import { template } from "@/lib/string";
import { Appointment, BookingConfiguration } from "@/types";

import { BaseNotificationService } from "../notificaionService.base";
import { getPhoneField, sendTextMessage } from "./sendTextMessage";

export class CustomerTextMessageNotificationService extends BaseNotificationService {
  public async sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, arg } = await this.getArguments(
      appointment,
      true
    );

    const { body } = bookingConfiguration.textMessages.templates.pending;
    if (!body || !body.length) return;

    await this.sendTextMessage(
      appointment,
      body,
      arg,
      bookingConfiguration,
      arg.config.name,
      "New Request"
    );
  }

  async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, arg } = await this.getArguments(
      appointment,
      true
    );

    const { body } = bookingConfiguration.textMessages.templates.declined;
    if (!body || !body.length) return;

    await this.sendTextMessage(
      appointment,
      body,
      arg,
      bookingConfiguration,
      arg.config.name,
      "Declined"
    );
  }

  async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, arg } = await this.getArguments(
      appointment,
      true
    );

    const { body } = bookingConfiguration.textMessages.templates.confirmed;
    if (!body || !body.length) return;

    await this.sendTextMessage(
      appointment,
      body,
      arg,
      bookingConfiguration,
      arg.config.name,
      "Confirmed"
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

    const { bookingConfiguration, generalConfiguration, arg } =
      await this.getArguments(newAppointment, true);

    const { body } = bookingConfiguration.textMessages.templates.rescheduled;
    if (!body || !body.length) return;

    await this.sendTextMessage(
      appointment,
      body,
      arg,
      bookingConfiguration,
      arg.config.name,
      "Reschedule"
    );
  }

  private async sendTextMessage(
    appointment: Appointment,
    bodyTemplate: string,
    args: Record<string, any>,
    config: BookingConfiguration,
    name: string,
    initiator: string
  ) {
    const phone = getPhoneField(appointment, config);
    if (!phone) {
      console.warn(
        `Can't find the phone field for appointment ${appointment._id}`
      );

      return;
    }

    const templatedBody = template(bodyTemplate, args, true);

    sendTextMessage({
      phone,
      body: templatedBody,
      sender: name,
      // webhookData: `customer|${appointment._id}`,
      webhookData: `${appointment._id}`,
      appointmentId: appointment._id,
      initiator: `Customer Text Message Notificaiton Service - ${initiator}`,
    });
  }
}
