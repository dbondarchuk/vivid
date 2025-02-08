import {
  Appointment,
  AppointmentStatus,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IAppointmentHook,
  IConnectedApp,
  IConnectedAppProps,
  ITextMessageResponder,
  TextMessageReply,
} from "@vivid/types";
import { CustomerTextMessageNotificationConfiguration } from "./customerTextMessageNotification.models";

import { getArguments, getPhoneField, template } from "@vivid/utils";

import ownerTextMessageReplyTemplate from "./emails/ownerTextMessageReply.html";

export default class CustomerTextMessageNotificationConnectedApp
  implements IConnectedApp, IAppointmentHook, ITextMessageResponder
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
      await this.props.services.ConnectedAppService().getApp(textMessageAppId!);
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

  public async respond(
    appData: ConnectedAppData,
    data: string,
    reply: TextMessageReply
  ): Promise<void> {
    const bodyTemplate = ownerTextMessageReplyTemplate;

    const appointment = await this.props.services
      .EventsService()
      .getAppointment(data);

    if (!appointment) {
      // todo
    }

    const { booking, general, social } = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const args = getArguments(
      appointment as Appointment,
      booking,
      general,
      social,
      true
    );

    const arg = {
      ...args.arg,
      reply,
    };

    const description = template(bodyTemplate, arg);

    await this.props.services.NotificationService().sendEmail({
      email: {
        to: args.generalConfiguration.email,
        subject: "SMS reply",
        body: description,
      },
      initiator: "Customer Text Message Reply - notify owner",
      appointmentId: appointment?._id,
    });

    const { autoReply } =
      appData.data as CustomerTextMessageNotificationConfiguration;
    if (autoReply) {
      const replyBody = template(autoReply, arg);
      await this.props.services.NotificationService().sendTextMessage({
        phone: reply.from,
        sender: args.generalConfiguration.name,
        body: replyBody,
        webhookData: reply.data,
        initiator: "Customer Text Message Reply - auto reply",
        appointmentId: appointment?._id,
      });
    }
  }

  private async sendNotification(
    appData: ConnectedAppData,
    appointment: Appointment,
    status: keyof CustomerTextMessageNotificationConfiguration["templates"],
    initiator: string
  ) {
    const data = appData.data as CustomerTextMessageNotificationConfiguration;
    const body = data.templates[status].body;
    if (!body) {
      return;
    }

    const { booking, general, social } = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const phone = getPhoneField(appointment, booking);
    if (!phone) {
      console.warn(
        `Can't find the phone field for appointment ${appointment._id}`
      );

      return;
    }

    const { arg } = getArguments(appointment, booking, general, social, true);
    const templatedBody = template(body, arg, true);

    await this.props.services.NotificationService().sendTextMessage({
      phone,
      body: templatedBody,
      webhookData: {
        data: appointment._id,
        appId: appData._id,
      },
      appointmentId: appointment._id,
      initiator: `Customer Text Message Notification Service - ${initiator}`,
    });
  }
}
