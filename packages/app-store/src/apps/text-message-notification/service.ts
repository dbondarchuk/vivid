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
  ITextMessageResponder,
  RespondResult,
  TextMessageReply,
} from "@vivid/types";
import { getArguments } from "@vivid/utils";
import { DateTime } from "luxon";
import { TextMessageNotificationConfiguration } from "./models";

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

  public async processRequest(
    appData: ConnectedAppData,
    data: TextMessageNotificationConfiguration
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
    appointment: Appointment,
    confirmed: boolean
  ): Promise<void> {
    const data = appData.data as TextMessageNotificationConfiguration;
    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const args = getArguments({
      appointment,
      config,
      customer: appointment.customer,
    });

    const body = `Hi ${config.general.name},
${appointment.customer} has requested a new appointment for ${appointment.option.name} (${
      args.duration?.hours ? `${args.duration.hours}hr ` : ""
    }${args.duration?.minutes ? `${args.duration.minutes}min` : ""}) for ${
      args.dateTime
    }.
Respond${!confirmed ? " Y to confirm," : ""} N to decline`;

    const phone = data?.phone || config.general.phone;
    if (!phone) {
      console.warn(`Can't find the phone field for owner notification`);

      return;
    }

    this.props.services.NotificationService().sendTextMessage({
      phone,
      body,
      webhookData: {
        appointmentId: appointment._id,
        appId: appData._id,
      },
      appointmentId: appointment._id,
      participantType: "user",
      handledBy: `Text Message Notification Service - New Appointment`,
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
    reply: TextMessageReply
  ): Promise<RespondResult> {
    if (!reply?.data?.appointmentId) {
      throw new Error(`Appointment Id is missing`);
    }

    const appointment = await this.props.services
      .EventsService()
      .getAppointment(reply.data.appointmentId);

    const { general: generalConfiguration, booking: bookingConfiguration } =
      await this.props.services
        .ConfigurationService()
        .getConfigurations("general", "booking");

    if (!appointment) {
      await this.props.services.NotificationService().sendTextMessage({
        phone: reply.from,
        sender: generalConfiguration.name,
        body: `Unknown reply`,
        webhookData: reply.data,
        participantType: "user",
        handledBy: "Text Message Reply - Auto reply",
      });

      return {
        participantType: "user",
        handledBy: "Text Message Reply - Auto reply",
      };
    }

    const replyMessage = reply.message.toLocaleLowerCase();

    if (
      (replyMessage === "y" || replyMessage === "yes") &&
      appointment.status === "pending"
    ) {
      return await this.processReply(
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
      return await this.processReply(
        appointment,
        "declined",
        reply,
        generalConfiguration,
        bookingConfiguration
      );
    } else {
      await this.props.services.NotificationService().sendTextMessage({
        phone: reply.from,
        sender: generalConfiguration.name,
        body: `Unknown reply. Respond Y to confirm, N to decline`,
        webhookData: reply.data,
        participantType: "user",
        handledBy: "Text Message Reply - Auto reply",
      });

      return {
        participantType: "user",
        handledBy: "Text Message Reply - Auto reply",
      };
    }
  }

  private async processReply(
    appointment: Appointment,
    newStatus: Extract<AppointmentStatus, "confirmed" | "declined">,
    reply: TextMessageReply,
    generalConfiguration: GeneralConfiguration,
    bookingConfiguration: BookingConfiguration
  ): Promise<RespondResult> {
    await this.props.services
      .EventsService()
      .changeAppointmentStatus(appointment._id, newStatus);

    const dateTime = DateTime.fromJSDate(appointment.dateTime)
      .setZone(bookingConfiguration.timeZone)
      .toLocaleString(DateTime.DATETIME_FULL);

    await this.props.services.NotificationService().sendTextMessage({
      phone: reply.from,
      sender: generalConfiguration.name,
      body: `Hi ${generalConfiguration.name},
Appointment by ${appointment.fields.name} for ${appointment.option.name} on ${dateTime} was ${newStatus}.
Thank you`,
      webhookData: reply.data,
      participantType: "user",
      handledBy: "Text Message Reply - Auto reply",
    });

    return {
      participantType: "user",
      handledBy: "Text Message Reply - Auto reply",
    };
  }
}
