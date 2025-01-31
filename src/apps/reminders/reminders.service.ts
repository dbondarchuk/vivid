import { Services } from "@/lib/services";
import { template } from "@/lib/string";
import { getPhoneField } from "@/services/helpers/phone";
import { sendEmail } from "@/services/notifications/email/sendEmail";
import { getAppointmentArguments } from "@/services/notifications/getAppointmentArguments";
import { getArguments } from "@/services/notifications/getArguments";
import { sendTextMessage } from "@/services/notifications/textMessages/sendTextMessage";
import {
  Appointment,
  BookingConfiguration,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  GeneralConfiguration,
  IConnectedApp,
  IConnectedAppProps,
  IScheduled,
  SocialConfiguration,
} from "@/types";
import {
  ITextMessageResponder,
  TextMessageReply,
} from "@/types/apps/textMessage";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";
import ownerTextMessageReplyTemplate from "./emails/ownerTextMessageReply.html";
import { Reminder, RemindersConfiguration } from "./reminders.models";

export class RemindersConnectedApp
  implements IConnectedApp, IScheduled, ITextMessageResponder
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
    data: RemindersConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const defaultApps = await Services.ConfigurationService().getConfiguration(
      "defaultApps"
    );

    try {
      const emailAppId = defaultApps.email?.appId;
      await Services.ConnectedAppService().getApp(emailAppId!);
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

  public async onTime(appData: ConnectedAppData, date: Date): Promise<void> {
    const {
      booking: bookingConfig,
      general: generalConfig,
      social: socialConfig,
    } = await Services.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

    const timezone = bookingConfig.timezone;
    const data = appData.data as RemindersConfiguration;

    const promises = (data?.reminders || []).map(async (reminder) => {
      const appointments = await this.getAppointments(date, reminder, timezone);
      const appointmentPromises = appointments.map((appointment) =>
        this.sendReminder(
          appData,
          appointment,
          reminder,
          bookingConfig,
          generalConfig,
          socialConfig
        )
      );

      return Promise.all(appointmentPromises);
    });

    await Promise.all(promises);
  }

  private async getAppointments(
    date: Date,
    reminder: Reminder,
    timezone: string
  ): Promise<Appointment[]> {
    const type = reminder.type;
    switch (type) {
      case "timeBefore": {
        const startDate = DateTime.fromJSDate(date)
          .setZone(timezone)
          .startOf("minute")
          .plus({
            days: reminder.days,
            weeks: reminder.weeks,
            hours: reminder.hours,
            minutes: reminder.minutes,
          });

        const endDate = startDate.plus({ minutes: 1, seconds: -1 });

        const appointments = await Services.EventsService().getAppointments({
          status: ["confirmed"],
          range: {
            start: startDate.toJSDate(),
            end: endDate.toJSDate(),
          },
        });

        console.log(
          `Found ${
            appointments.total
          } appointments between ${startDate.toISO()} and ${endDate.toISO()} for reminder ${
            reminder.name
          }`
        );

        return appointments.items;
      }

      case "atTime": {
        const dt = DateTime.fromJSDate(date).setZone(timezone);
        if (
          dt.hour !== reminder.time.hour ||
          dt.minute !== reminder.time.minute
        )
          return [];

        const startDate = dt
          .startOf("day")
          .plus({ days: reminder.days, weeks: reminder.weeks });

        const endDate = startDate.plus({ days: 1, seconds: -1 });

        console.log(
          `Looking for appointments between ${startDate.toISO()} and ${endDate.toISO()} for reminder ${
            reminder.name
          }`
        );

        const appointments = await Services.EventsService().getAppointments({
          status: ["confirmed"],
          range: {
            start: startDate.toJSDate(),
            end: endDate.toJSDate(),
          },
        });

        console.log(
          `Found ${
            appointments.total
          } appointments between ${startDate.toISO()} and ${endDate.toISO()} for reminder ${
            reminder.name
          }`
        );

        return appointments.items;
      }

      default:
        console.error(`Unknown reminder type: ${type}`);
        return [];
    }
  }

  private async sendReminder(
    appData: ConnectedAppData,
    appointment: Appointment,
    reminder: Reminder,
    config: BookingConfiguration,
    generalConfig: GeneralConfiguration,
    socialConfig: SocialConfiguration
  ): Promise<void> {
    const { arg } = getArguments(
      appointment,
      config,
      generalConfig,
      socialConfig,
      true
    );

    const channel = reminder.channel;
    switch (channel) {
      case "email":
        return sendEmail(
          {
            body: template(reminder.body, arg),
            subject: template(reminder.subject, arg),
            to: appointment.fields.email,
          },
          `Reminder Service - ${reminder.name}`,
          appointment._id
        );
      case "text-message":
        const phone = getPhoneField(appointment, config);
        if (!phone) {
          console.warn(
            `Can't find the phone field for appointment ${appointment._id}`
          );

          return;
        }

        await sendTextMessage({
          phone,
          sender: generalConfig.name,
          body: template(reminder.body, arg),
          webhookData: {
            data: appointment._id,
            appId: appData._id,
          },
          initiator: `Reminder service - ${reminder.name}`,
          appointmentId: appointment._id,
        });

        return;

      default:
        console.error(`Unknow reminder channel type: ${channel}`);
        return;
    }
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
      "Reminders Text Message Reply - notify owner",
      appointment?._id
    );
  }
}
