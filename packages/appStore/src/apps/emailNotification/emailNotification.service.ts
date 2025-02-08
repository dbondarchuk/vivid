import {
  Appointment,
  AppointmentStatus,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  EmailAttachment,
  IAppointmentHook,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import {
  AppointmentStatusToICalMethodMap,
  getArguments,
  getEventCalendarContent,
  stream2buffer,
} from "@vivid/utils";
import { EmailNotificationConfiguration } from "./emailNotification.models";

import { template } from "@vivid/utils";
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

    const eventSummary = `${appointment.fields.name} for ${appointment.option.name}`;
    const eventContent = getEventCalendarContent(
      config.general,
      appointment,
      eventSummary,
      description,
      AppointmentStatusToICalMethodMap[status]
    );

    const promises =
      appointment.files
        ?.filter((file) => file.mimeType.startsWith("image/"))
        .map(async (file) => {
          const result = await this.props.services
            .AssetsService()
            .streamAsset(file.filename);
          if (!result) return null;

          const buffer = await stream2buffer(result.stream);

          return {
            cid: file._id,
            content: buffer,
            filename: file.filename,
            contentType: file.mimeType,
          } satisfies EmailAttachment;
        }) || [];

    const attachments = (await Promise.all(promises)).filter(
      (attachment) => !!attachment
    );

    await this.props.services.NotificationService().sendEmail({
      email: {
        to: data?.email || generalConfiguration.email,
        subject: `Appointment for ${arg.option!.name} by ${
          arg.fields!.name
        } at ${arg.dateTime}`,
        body: description,
        icalEvent: {
          method: AppointmentStatusToICalMethodMap[status],
          content: eventContent,
        },
        attachments,
      },
      initiator: `Email Notification Service - ${initiator}`,
      appointmentId: appointment._id,
    });
  }
}
