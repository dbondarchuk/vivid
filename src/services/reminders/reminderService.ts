import { template } from "@/lib/string";
import {
  Appointment,
  BookingConfiguration,
  GeneralConfiguration,
  Reminder,
  SmsConfiguration,
  SmtpConfiguration,
  SocialConfiguration,
} from "@/types";
import { DateTime } from "luxon";
import { ConfigurationService } from "../configurationService";
import { EventsService } from "../eventsService";
import { sendEmail } from "../notifications/email/sendEmail";
import { getArguments } from "../notifications/getArguments";
import { getPhoneField, sendSms } from "../notifications/sms/sendSms";

export class ReminderService {
  constructor(
    protected readonly eventsService: EventsService,
    protected readonly configurationService: ConfigurationService
  ) {}

  public async sendReminders(date: Date) {
    const config = await this.configurationService.getConfiguration("booking");
    const generalConfig = await this.configurationService.getConfiguration(
      "general"
    );
    const socialConfig = await this.configurationService.getConfiguration(
      "social"
    );
    const smtpConfiguration = await this.configurationService.getConfiguration(
      "smtp"
    );
    const smsConfiguration = await this.configurationService.getConfiguration(
      "sms"
    );

    const timezone = config.timezone;

    const promises = (config.reminders || []).map(async (reminder) => {
      const appointments = await this.getAppointments(date, reminder, timezone);
      const appointmentPromises = appointments.map((appointment) =>
        this.sendReminder(
          appointment,
          reminder,
          config,
          generalConfig,
          smsConfiguration,
          smtpConfiguration,
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

        const appointments = await this.eventsService.getAppointments({
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

        const appointments = await this.eventsService.getAppointments({
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
    appointment: Appointment,
    reminder: Reminder,
    config: BookingConfiguration,
    generalConfiguration: GeneralConfiguration,
    smsConfiguration: SmsConfiguration,
    smtpConfiguration: SmtpConfiguration,
    generalConfig: GeneralConfiguration,
    socialConfig: SocialConfiguration
  ): Promise<void> {
    const { arg } = getArguments(
      appointment,
      config,
      generalConfig,
      socialConfig
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
          smtpConfiguration,
          `Reminder Service - ${reminder.name}`,
          appointment._id
        );
      case "sms":
        const phone = getPhoneField(appointment, config);
        if (!phone) {
          console.warn(
            `Can't find the phone field for appointment ${appointment._id}`
          );

          return;
        }

        await sendSms({
          phone,
          sender: generalConfig.name,
          generalConfiguration,
          smsConfiguration,
          smtpConfiguration,
          body: template(reminder.body, arg),
          webhookData: appointment._id,
          initiator: `Reminder service - ${reminder.name}`,
          appointmentId: appointment._id,
        });

        return;

      default:
        console.error(`Unknow reminder channel type: ${channel}`);
        return;
    }
  }
}
