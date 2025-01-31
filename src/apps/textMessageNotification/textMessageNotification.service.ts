import { Services } from "@/lib/services";
import { getAppointmentArguments } from "@/services/notifications/getAppointmentArguments";
import { sendTextMessage } from "@/services/notifications/textMessages/sendTextMessage";
import {
  Appointment,
  AppointmentStatus,
  BookingConfiguration,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  GeneralConfiguration,
  IAppointmentHook,
  IConnectedApp,
  IConnectedAppProps,
} from "@/types";
import {
  ITextMessageResponder,
  TextMessageReply,
} from "@/types/apps/textMessage";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";
import { TextMessageNotificationConfiguration } from "./textMessageNotification.models";

export const getPhoneField = (
  appointment: Appointment,
  phoneField?: string[]
): string | undefined => {
  const fields = new Set(
    ["phone", ...(phoneField || [])].map((x) => x.toLowerCase())
  );

  const [_, phone] =
    Object.entries(appointment.fields as Record<string, string>).find(
      ([field]) => fields.has(field.toLowerCase())
    ) || [];

  if (!phone) {
    return;
  }

  return phone;
};

export class TextMessageNotificationConnectedApp
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
    data: TextMessageNotificationConfiguration
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
    const data = appData.data as TextMessageNotificationConfiguration;
    const { arg, generalConfiguration } = await getAppointmentArguments(
      appointment,
      true
    );
    const body = `Hi ${generalConfiguration.name},
${arg.fields?.name} has requested a new appointment for ${arg.option?.name} (${
      arg.duration?.hours ? `${arg.duration.hours}hr ` : ""
    }${arg.duration?.minutes ? `${arg.duration.minutes}min` : ""}) for ${
      arg.dateTime
    }.
Respond Y to confirm, N to decline`;

    const phone = data?.phone || generalConfiguration.phone;
    if (!phone) {
      console.warn(`Can't find the phone field for owner notification`);

      return;
    }

    sendTextMessage({
      phone,
      body,
      webhookData: {
        data: appointment._id,
        appId: appData._id,
      },
      appointmentId: appointment._id,
      initiator: `Text Message Notification Service - New Appointment`,
    });
  }

  public async onAppointmentStatusChanged(
    appData: ConnectedAppData,
    appointment: Appointment,
    newStatus: AppointmentStatus
  ): Promise<void> {
    // do nothing
  }

  public async onAppointmentRescheduled(
    appData: ConnectedAppData,
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void> {
    // do nothing
  }

  public async respond(
    appData: ConnectedAppData,
    data: string,
    reply: TextMessageReply
  ): Promise<void> {
    const appointment = await Services.EventsService().getAppointment(data);
    const { general: generalConfiguration, booking: bookingConfiguration } =
      await Services.ConfigurationService().getConfigurations(
        "general",
        "booking"
      );

    if (!appointment) {
      await sendTextMessage({
        phone: reply.from,
        sender: generalConfiguration.name,
        body: `Unknown reply`,
        webhookData: reply.data,
        initiator: "Text Message Reply - Auto reply",
      });

      return;
    }

    const replyMessage = reply.message.toLocaleLowerCase();

    if (
      (replyMessage === "y" || replyMessage === "yes") &&
      appointment.status === "pending"
    ) {
      await this.processReply(
        appointment,
        "confirmed",
        reply,
        generalConfiguration,
        bookingConfiguration
      );
    } else if (
      (replyMessage === "n" || replyMessage === "no") &&
      appointment.status !== "declined"
    ) {
      await this.processReply(
        appointment,
        "declined",
        reply,
        generalConfiguration,
        bookingConfiguration
      );
    } else {
      await sendTextMessage({
        phone: reply.from,
        sender: generalConfiguration.name,
        body: `Unknown reply. Respond Y to confirm, N to decline`,
        webhookData: reply.data,
        initiator: "Text Message Reply - Auto reply",
      });
    }
  }

  private async processReply(
    appointment: Appointment,
    newStatus: Extract<AppointmentStatus, "confirmed" | "declined">,
    reply: TextMessageReply,
    generalConfiguration: GeneralConfiguration,
    bookingConfiguration: BookingConfiguration
  ) {
    await Services.EventsService().changeAppointmentStatus(
      appointment._id,
      newStatus
    );

    const dateTime = DateTime.fromJSDate(appointment.dateTime)
      .setZone(bookingConfiguration.timezone)
      .toLocaleString(DateTime.DATETIME_FULL);

    await sendTextMessage({
      phone: reply.from,
      sender: generalConfiguration.name,
      body: `Hi ${generalConfiguration.name},
Appointment by ${appointment.fields.name} for ${appointment.option.name} on ${dateTime} was ${newStatus}.
Thank you`,
      webhookData: reply.data,
      initiator: "Text Message Reply - Auto reply",
    });
  }
}
