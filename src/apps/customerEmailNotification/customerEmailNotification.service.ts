import { Services } from "@/lib/services";
import { template } from "@/lib/string";
import {
  AppointmentStatusToICalMethodMap,
  getEventCalendarContent,
} from "@/services/helpers/email";
import { sendEmail } from "@/services/notifications/email/sendEmail";
import { getAppointmentArguments } from "@/services/notifications/getAppointmentArguments";
import {
  Appointment,
  AppointmentStatus,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IAppointmentHook,
  IConnectedApp,
  IConnectedAppProps,
} from "@/types";
import { NextRequest } from "next/server";
import { CustomerEmailNotificationConfiguration } from "./customerEmailNotification.models";

export class CustomerEmailNotificationConnectedApp
  implements IConnectedApp, IAppointmentHook
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processWebhook(
    appData: ConnectedAppData,
    request: NextRequest
  ): Promise<void> {
    // do nothing
  }

  public async processRequest(
    appData: ConnectedAppData,
    data: CustomerEmailNotificationConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const defaultApps = await Services.ConfigurationService().getConfiguration(
      "defaultApps"
    );
    const emailAppId = defaultApps.email.appId;

    try {
      await Services.ConnectedAppService().getApp(emailAppId);
    } catch {
      return {
        status: "failed",
        statusText: "Email sender default is not configured",
      };
    }

    const status: ConnectedAppStatusWithText = {
      status: "connected",
      statusText: `Successfully set up`,
    };

    this.props.update({
      data,
      ...status,
    });

    return status;
  }

  public async onAppointmentCreated(
    appData: ConnectedAppData,
    appointment: Appointment
  ): Promise<void> {
    await this.sendNotification(appData, appointment, "pending", "New Request");
  }

  public async onAppointmentStatusChanged(
    appData: ConnectedAppData,
    appointment: Appointment,
    newStatus: AppointmentStatus
  ): Promise<void> {
    await this.sendNotification(appData, appointment, newStatus, newStatus);
  }

  public async onAppointmentRescheduled(
    appData: ConnectedAppData,
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void> {
    const newAppointment: Appointment = {
      ...appointment,
      dateTime: newTime,
      totalDuration: newDuration,
    };

    await this.sendNotification(
      appData,
      newAppointment,
      "rescheduled",
      "Rescheduled"
    );
  }

  private async sendNotification(
    appData: ConnectedAppData,
    appointment: Appointment,
    status: keyof CustomerEmailNotificationConfiguration["templates"],
    initiator: string
  ) {
    const { arg } = await getAppointmentArguments(appointment, true);

    const data = appData.data as CustomerEmailNotificationConfiguration;

    const eventContent = await getEventCalendarContent(
      appointment,
      template(data.event.summary, arg),
      template(data.event.description, arg)
    );

    const { subject, body } = data.templates[status];

    await sendEmail(
      {
        to: appointment.fields.email,
        subject: template(subject, arg),
        body: template(body, arg),
        icalEvent: {
          method: AppointmentStatusToICalMethodMap[status],
          content: eventContent,
        },
      },
      `Customer Email Notification Service - ${initiator}`,
      appointment._id
    );
  }
}
