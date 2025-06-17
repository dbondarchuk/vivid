import {
  Appointment,
  AppointmentStatus,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IAppointmentHook,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import { CustomerTextMessageNotificationConfiguration } from "./models";

import {
  getArguments,
  getPhoneField,
  templateSafeWithError,
} from "@vivid/utils";

export default class CustomerTextMessageNotificationConnectedApp
  implements IConnectedApp, IAppointmentHook
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: CustomerTextMessageNotificationConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const defaultApps = await this.props.services
      .ConfigurationService()
      .getConfiguration("defaultApps");

    try {
      const textMessageAppId = defaultApps.textMessage?.appId;
      await this.props.services
        .ConnectedAppsService()
        .getApp(textMessageAppId!);
    } catch {
      return {
        status: "failed",
        statusText: "Text message sender default app is not configured",
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
    status: keyof CustomerTextMessageNotificationConfiguration["templates"],
    initiator: string
  ) {
    const data = appData.data as CustomerTextMessageNotificationConfiguration;
    const templateId = data.templates[status].templateId;
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

    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const phoneFields = (
      await this.props.services.ServicesService().getFields({
        type: ["phone"],
      })
    ).items;

    const phone =
      appointment.fields?.phone ?? getPhoneField(appointment, phoneFields);
    if (!phone) {
      console.warn(
        `Can't find the phone field for appointment ${appointment._id}`
      );

      return;
    }

    const args = getArguments({
      appointment,
      config,
      customer: appointment.customer,
      useAppointmentTimezone: true,
    });

    const templatedBody = templateSafeWithError(
      template.value as string,
      args,
      true
    );

    await this.props.services.NotificationService().sendTextMessage({
      phone,
      body: templatedBody,
      webhookData: {
        appointmentId: appointment._id,
        appId: appData._id,
      },
      appointmentId: appointment._id,
      participantType: "customer",
      handledBy: `Customer Text Message Notification Service - ${initiator}`,
    });
  }
}
