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
      await this.getArguments(appointment);

    const { body } = bookingConfiguration.textMessages.templates.pending;
    if (!body || !body.length) return;

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
      arg.config.name
    );
  }

  async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, generalConfiguration, arg } =
      await this.getArguments(appointment);

    const { body } = bookingConfiguration.textMessages.templates.declined;
    if (!body || !body.length) return;

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
      arg.config.name
    );
  }

  async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, generalConfiguration, arg } =
      await this.getArguments(appointment);

    const { body } = bookingConfiguration.textMessages.templates.confirmed;
    if (!body || !body.length) return;

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
      arg.config.name
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
      await this.getArguments(newAppointment);

    const { body } = bookingConfiguration.textMessages.templates.rescheduled;
    if (!body || !body.length) return;

    await this.sendSms(
      appointment,
      body,
      arg,
      bookingConfiguration,
      generalConfiguration,
      arg.config.name
    );
  }

  private async sendSms(
    appointment: Appointment,
    bodyTemplate: string,
    args: Record<string, any>,
    config: BookingConfiguration,
    generalConfiguration: GeneralConfiguration,
    name: string
  ) {
    const phone = getPhoneField(appointment, config);
    if (!phone) {
      console.warn(
        `Can't find the phone field for appointment ${appointment._id}`
      );

      return;
    }

    const templatedBody = template(bodyTemplate, args, true);

    const smtpConfiguration = await this.configurationService.getConfiguration(
      "smtp"
    );

    const smsConfiguration = await this.configurationService.getConfiguration(
      "sms"
    );

    sendSms({
      phone,
      body: templatedBody,
      generalConfiguration,
      smsConfiguration,
      smtpConfiguration,
      sender: name,
      webhookData: appointment._id,
    });
  }
}
