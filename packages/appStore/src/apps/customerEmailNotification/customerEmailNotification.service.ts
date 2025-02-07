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
  template,
} from "@vivid/utils";
import { CustomerEmailNotificationConfiguration } from "./customerEmailNotification.models";

export default class CustomerEmailNotificationConnectedApp
  implements IConnectedApp, IAppointmentHook
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processWebhook(): Promise<void> {
    // do nothing
  }

  public async processRequest(
    appData: ConnectedAppData,
    data: CustomerEmailNotificationConfiguration
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
    status: keyof CustomerEmailNotificationConfiguration["templates"],
    initiator: string
  ) {
    const { general, booking, social } = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const { arg } = getArguments(appointment, booking, general, social, true);

    const data = appData.data as CustomerEmailNotificationConfiguration;

    const eventContent = getEventCalendarContent(
      general,
      appointment,
      template(data.event.summary, arg),
      template(data.event.description, arg)
    );

    const { subject, body } = data.templates[status];

    await this.props.services.NotificationService().sendEmail({
      email: {
        to: appointment.fields.email,
        subject: template(subject, arg),
        body: template(body, arg),
        icalEvent: {
          method: AppointmentStatusToICalMethodMap[status],
          content: eventContent,
        },
      },
      initiator: `Customer Email Notification Service - ${initiator}`,
      appointmentId: appointment._id,
    });
  }
}
