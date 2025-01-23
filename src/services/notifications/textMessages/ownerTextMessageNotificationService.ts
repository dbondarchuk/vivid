import { Appointment } from "@/types";

import { BaseNotificationService } from "../notificaionService.base";
import { sendTextMessage } from "./sendTextMessage";

export class OwnerTextMessageNotificationService extends BaseNotificationService {
  public async sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void> {
    const { bookingConfiguration, generalConfiguration, arg } =
      await this.getArguments(appointment, true);

    if (
      !bookingConfiguration?.textMessages?.sendNewRequestNotifications ||
      !generalConfiguration.phone
    ) {
      return;
    }

    const body = `Hi ${generalConfiguration.name},
${arg.fields?.name} has requested a new appointment for ${arg.option?.name} (${
      arg.duration?.hours ? `${arg.duration.hours}hr ` : ""
    }${arg.duration?.minutes ? `${arg.duration.minutes}min` : ""}) for ${
      arg.dateTime
    }.
Respond Y to confirm, N to decline`;
    //${generalConfiguration.url}/admin/dashboard/appointments/${arg._id}`;

    await sendTextMessage({
      phone: generalConfiguration.phone,
      body,
      sender: generalConfiguration.name,
      webhookData: `owner|${appointment._id}`,
      appointmentId: appointment._id,
      initiator: `Owner Text Message Notificaiton Service - New Request`,
    });
  }

  public async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    // do nothing
  }

  public async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    // do nothing
  }
  public async sendAppointmentRescheduledNotification(
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void> {
    // do nothing
  }
}
