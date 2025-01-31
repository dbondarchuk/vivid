import { Services } from "@/lib/services";
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
import { EmailNotificationConfiguration } from "./emailNotification.models";

import { template } from "@/lib/string";
import confirmedTemplate from "./emails/appointmentConfirmed.html";
import pendingTemplate from "./emails/appointmentCreated.html";
import declinedTemplate from "./emails/appointmentDeclined.html";
import rescheduledTemplate from "./emails/appointmentRescheduled.html";

const emailTemplates: Record<
  keyof typeof AppointmentStatusToICalMethodMap,
  string
> = {
  confirmed: confirmedTemplate,
  declined: declinedTemplate,
  pending: pendingTemplate,
  rescheduled: rescheduledTemplate,
};

export class EmailNotificationConnectedApp
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
    data: EmailNotificationConfiguration
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
    status: keyof typeof AppointmentStatusToICalMethodMap,
    initiator: string
  ) {
    const { arg, generalConfiguration } = await getAppointmentArguments(
      appointment,
      true
    );

    const data = appData.data as EmailNotificationConfiguration;

    const description = template(emailTemplates[status], arg);

    const eventSummary = `${appointment.fields.name} for ${appointment.option.name}`;
    const eventContent = await getEventCalendarContent(
      appointment,
      eventSummary,
      description,
      AppointmentStatusToICalMethodMap[status]
    );

    await sendEmail(
      {
        to: data?.email || generalConfiguration.email,
        subject: `Appointment for ${arg.option!.name} by ${
          arg.fields!.name
        } at ${arg.dateTime}`,
        body: description,
        icalEvent: {
          method: AppointmentStatusToICalMethodMap[status],
          content: eventContent,
        },
      },
      `Email Notification Service - ${initiator}`,
      appointment._id
    );
  }
}
