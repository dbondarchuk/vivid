import {
  Appointment,
  AppointmentStatus,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IAppointmentHook,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import {
  AppointmentStatusToICalMethodMap,
  getArguments,
  getEventCalendarContent,
} from "@vivid/utils";
import { EmailNotificationConfiguration } from "./models";

import { template } from "@vivid/utils";
import autoConfirmedTemplate from "./emails/appointment-auto-confirmed.html";
import confirmedTemplate from "./emails/appointment-confirmed.html";
import pendingTemplate from "./emails/appointment-created.html";
import declinedTemplate from "./emails/appointment-declined.html";
import rescheduledTemplate from "./emails/appointment-rescheduled.html";

const emailTemplates: Record<
  keyof typeof AppointmentStatusToICalMethodMap | "auto-confirmed",
  string
> = {
  confirmed: confirmedTemplate,
  declined: declinedTemplate,
  pending: pendingTemplate,
  rescheduled: rescheduledTemplate,
  "auto-confirmed": autoConfirmedTemplate,
};

export class EmailNotificationConnectedApp
  implements IConnectedApp, IAppointmentHook
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: EmailNotificationConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const defaultApps = await this.props.services
      .ConfigurationService()
      .getConfiguration("defaultApps");

    const emailAppId = defaultApps.email.appId;

    try {
      await this.props.services.ConnectedAppService().getApp(emailAppId);
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
    appointment: Appointment,
    confirmed: boolean
  ): Promise<void> {
    await this.sendNotification(
      appData,
      appointment,
      confirmed ? "auto-confirmed" : "pending",
      "New Request"
    );
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
    status: keyof typeof AppointmentStatusToICalMethodMap | "auto-confirmed",
    initiator: string
  ) {
    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");
    const { arg, generalConfiguration } = getArguments(
      appointment,
      config.booking,
      config.general,
      config.social,
      true
    );

    const data = appData.data as EmailNotificationConfiguration;

    const description = template(emailTemplates[status], arg);

    const newStatus = status === "auto-confirmed" ? "confirmed" : status;

    const eventSummary = `${appointment.fields.name} for ${appointment.option.name}`;
    const eventContent = getEventCalendarContent(
      config.general,
      appointment,
      eventSummary,
      description,
      status === "auto-confirmed"
        ? "REQUEST"
        : AppointmentStatusToICalMethodMap[newStatus]
    );

    await this.props.services.NotificationService().sendEmail({
      email: {
        to: data?.email || generalConfiguration.email,
        subject: `Appointment for ${arg.option!.name} by ${
          arg.fields!.name
        } at ${arg.dateTime}`,
        body: description,
        icalEvent: {
          method:
            status === "auto-confirmed"
              ? "REQUEST"
              : AppointmentStatusToICalMethodMap[status],
          content: eventContent,
        },
      },
      initiator: `Email Notification Service - ${initiator}`,
      appointmentId: appointment._id,
    });
  }
}
