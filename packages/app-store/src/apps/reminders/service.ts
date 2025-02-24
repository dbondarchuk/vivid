import { renderToStaticMarkup } from "@vivid/email-builder/static";
import {
  Appointment,
  BookingConfiguration,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  GeneralConfiguration,
  IConnectedApp,
  IConnectedAppProps,
  IScheduled,
  ITextMessageResponder,
  SocialConfiguration,
  TextMessageReply,
} from "@vivid/types";
import {
  getArguments,
  getPhoneField,
  template,
  templateSafeWithError,
} from "@vivid/utils";
import { DateTime } from "luxon";
import ownerTextMessageReplyTemplate from "./emails/owner-text-message-reply.html";
import { Reminder, RemindersConfiguration } from "./models";

export default class RemindersConnectedApp
  implements IConnectedApp, IScheduled, ITextMessageResponder
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: RemindersConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const defaultApps = await this.props.services
      .ConfigurationService()
      .getConfiguration("defaultApps");

    try {
      const emailAppId = defaultApps.email?.appId;
      await this.props.services.ConnectedAppService().getApp(emailAppId!);
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
    } = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

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

        const appointments = await this.props.services
          .EventsService()
          .getAppointments({
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

        const appointments = await this.props.services
          .EventsService()
          .getAppointments({
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
    const template = await this.props.services
      .TemplatesService()
      .getTemplate(reminder.templateId);
    if (!template) {
      console.warn(`Can't find template ${reminder.templateId}`);
      return;
    }

    switch (channel) {
      case "email":
        return this.props.services.NotificationService().sendEmail({
          email: {
            body: await renderToStaticMarkup(template.value, { args: arg }),
            subject: templateSafeWithError(reminder.subject, arg),
            to: appointment.fields.email,
          },
          initiator: `Reminder Service - ${reminder.name}`,
          appointmentId: appointment._id,
        });

      case "text-message":
        const phone = getPhoneField(appointment, config);
        if (!phone) {
          console.warn(
            `Can't find the phone field for appointment ${appointment._id}`
          );

          return;
        }

        await this.props.services.NotificationService().sendTextMessage({
          phone,
          sender: generalConfig.name,
          body: templateSafeWithError(template.value, arg),
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

    const appointment = await this.props.services
      .EventsService()
      .getAppointment(data);

    if (!appointment) {
      // todo
    }

    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const args = getArguments(
      appointment as Appointment,
      config.booking,
      config.general,
      config.social,
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
      initiator: "Reminders Text Message Reply - notify owner",
      appointmentId: appointment?._id,
    });
  }
}
