import { renderToStaticMarkup } from "@vivid/email-builder/static";
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
  templateSafeWithError,
} from "@vivid/utils";
import { CustomerEmailNotificationConfiguration } from "./models";

export default class CustomerEmailNotificationConnectedApp
  implements IConnectedApp, IAppointmentHook
{
  public constructor(protected readonly props: IConnectedAppProps) {}

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
    appointment: Appointment,
    confirmed: boolean
  ): Promise<void> {
    await this.sendNotification(
      appData,
      appointment,
      confirmed ? "confirmed" : "pending",
      "New Request",
      confirmed
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
    status: keyof CustomerEmailNotificationConfiguration["templates"],
    initiator: string,
    forceRequest?: boolean
  ) {
    const { general, booking, social } = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const { arg } = getArguments(appointment, booking, general, social, true);

    const data = appData.data as CustomerEmailNotificationConfiguration;

    if (!data.event.templateId) {
      return;
    }

    const eventTemplate = await this.props.services
      .TemplatesService()
      .getTemplate(data.event.templateId);
    if (!eventTemplate) {
      console.error(`Can't find template with id ${eventTemplate}`);
      return;
    }

    const renderedEventTemplate = await renderToStaticMarkup({
      document: eventTemplate.value,
      args: arg,
    });

    const eventContent = getEventCalendarContent(
      general,
      appointment,
      templateSafeWithError(data.event.summary, arg),
      renderedEventTemplate,
      forceRequest ? "REQUEST" : AppointmentStatusToICalMethodMap[status]
    );

    const { subject, templateId } = data.templates[status];
    if (!templateId) {
      return;
    }

    const template = await this.props.services
      .TemplatesService()
      .getTemplate(templateId);
    if (!template) {
      console.error(`Can't find template with id ${templateId}`);
      return;
    }

    const renderedTemplate = await renderToStaticMarkup({
      args: arg,
      document: template.value,
    });

    await this.props.services.NotificationService().sendEmail({
      email: {
        to: appointment.fields.email,
        subject: templateSafeWithError(subject, arg),
        body: renderedTemplate,
        icalEvent: {
          method: forceRequest
            ? "REQUEST"
            : AppointmentStatusToICalMethodMap[status],
          content: eventContent,
        },
      },
      initiator: `Customer Email Notification Service - ${initiator}`,
      appointmentId: appointment._id,
    });
  }
}
