import { Services } from "@/lib/services";
import { template } from "@/lib/string";
import { sendEmail } from "@/services/notifications/email/sendEmail";
import { getAppointmentArguments } from "@/services/notifications/getAppointmentArguments";
import { sendTextMessage } from "@/services/notifications/textMessages/sendTextMessage";
import {
  Appointment,
  AppointmentStatus,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IAppointmentHook,
  IConnectedApp,
  IConnectedAppProps,
} from "@/types";
import {
  ITextMessageResponder,
  TextMessageReply,
} from "@/types/apps/textMessage";
import { NextRequest } from "next/server";
import { CustomerTextMessageNotificationConfiguration } from "./customerTextMessageNotification.models";

import { getPhoneField } from "@/services/helpers/phone";
import ownerTextMessageReplyTemplate from "./emails/ownerTextMessageReply.html";

export class CustomerTextMessageNotificationConnectedApp
  implements IConnectedApp, IAppointmentHook, ITextMessageResponder
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
    data: CustomerTextMessageNotificationConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const defaultApps = await Services.ConfigurationService().getConfiguration(
      "defaultApps"
    );

    try {
      const textMessageAppId = defaultApps.textMessage?.appId;
      await Services.ConnectedAppService().getApp(textMessageAppId!);
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

    const appointment = await Services.EventsService().getAppointment(data);
    if (!appointment) {
      // todo
    }

    const args = await getAppointmentArguments(
      appointment as Appointment,
      true
    );

    const arg = {
      ...args.arg,
      reply,
    };

    const description = template(bodyTemplate, arg);

    await sendEmail(
      {
        to: args.generalConfiguration.email,
        subject: "SMS reply",
        body: description,
      },
      "Customer Text Message Reply - notify owner",
      appointment?._id
    );

    const { autoReply } =
      appData.data as CustomerTextMessageNotificationConfiguration;
    if (autoReply) {
      const replyBody = template(autoReply, arg);
      await sendTextMessage({
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

    const bookingConfiguration =
      await Services.ConfigurationService().getConfiguration("booking");

    const phone = getPhoneField(appointment, bookingConfiguration);
    if (!phone) {
      console.warn(
        `Can't find the phone field for appointment ${appointment._id}`
      );

      return;
    }

    const { arg } = await getAppointmentArguments(appointment, true);
    const templatedBody = template(body, arg, true);

    sendTextMessage({
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
