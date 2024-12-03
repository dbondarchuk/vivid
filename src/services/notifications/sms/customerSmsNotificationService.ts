import { template } from "@/lib/string";
import {
  Appointment,
  BookingConfiguration,
  GeneralConfiguration,
} from "@/types";

import { BaseNotificationService } from "../notificaionService.base";
import { getPhoneField, sendSms } from "./sendSms";

export class CustomerSmsNotificationService extends BaseNotificationService {
  public async sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, generalConfiguration, arg } =
      await this.getArguments(appointment, true);

    const { body } = bookingConfiguration.textMessages.templates.pending;
    if (!body || !body.length) return;

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
      arg.config.name,
      "New Request"
    );
  }

  async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, generalConfiguration, arg } =
      await this.getArguments(appointment, true);

    const { body } = bookingConfiguration.textMessages.templates.declined;
    if (!body || !body.length) return;

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
      arg.config.name,
      "Declined"
    );
  }

  async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, generalConfiguration, arg } =
      await this.getArguments(appointment, true);

    const { body } = bookingConfiguration.textMessages.templates.confirmed;
    if (!body || !body.length) return;

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
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

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
      arg.config.name,
      "Reschedule"
    );
  }

  private async sendSms(
    appointment: Appointment,
    bodyTemplate: string,
    args: Record<string, any>,
    config: BookingConfiguration,
    generalConfiguration: GeneralConfiguration,
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

    const { smtp: smtpConfiguration, sms: smsConfiguration } =
      await this.configurationService.getConfigurations("smtp", "sms");

    sendSms({
      phone,
      body: templatedBody,
      generalConfiguration,
      smsConfiguration,
      smtpConfiguration,
      sender: name,
      webhookData: appointment._id,
      appointmentId: appointment._id,
      initiator: `SMS Notificaiton Service - ${initiator}`,
    });
  }
}
