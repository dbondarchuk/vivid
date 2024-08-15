import { template } from "@/lib/string";
import { BookingConfiguration } from "@/models/configuration";
import { MeetingEvent } from "@/models/meetingEvent";
import { Period } from "@/models/period";
import { DateTime } from "luxon";
import * as nodemailer from "nodemailer";
import { ConfigurationService } from "./configurationService";
import { IcsBusyTimeProvider } from "./helpers/ics";
import * as ics from "ics";
import { getDbConnection } from "@/database";

const APPOINTMENTS_COLLECTION_NAME = "appointments";

type DbEvent = Omit<MeetingEvent, "dateTime"> & {
  dateTime: Date;
};

type CalendarEventOptions = {
  from: string;
  address: string;
  name: string;
  url: string;
};

export class EventsService {
  constructor(private readonly configurationService: ConfigurationService) {}

  public async getBusyEvents(): Promise<Period[]> {
    const configuration = await this.configurationService.getConfiguration();
    const config = configuration.booking;

    const start = DateTime.utc();
    const end = DateTime.utc().plus({ weeks: config.maxWeeksInFuture ?? 8 });

    const dbEventsPromise = this.getDbBusyTimes(start, end);

    const ics = new IcsBusyTimeProvider(config.ics);
    const icsEventsPromise = ics.getBusyTimes(start, end);

    const [dbEvents, icsEvents] = await Promise.all([
      dbEventsPromise,
      icsEventsPromise,
    ]);

    return [...dbEvents, ...icsEvents];
  }

  public async createEvent(event: MeetingEvent): Promise<void> {
    const { booking, address, smtp, name, url } =
      await this.configurationService.getConfiguration();

    await this.saveEvent(event);

    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.auth.user,
        pass: smtp.auth.pass,
      },
    });

    const { fields, ...eventData } = event;
    const params = {
      ...eventData,
      ...fields,
      address,
      dateTime: DateTime.fromISO(event.dateTime, {
        zone: event.timeZone,
      }).toLocaleString(DateTime.DATETIME_SHORT),
    };

    const config: CalendarEventOptions = {
      from: booking.email.from,
      address,
      name,
      url,
    };

    const owner = this.sendOwnerEmail(
      event,
      booking,
      config,
      params,
      transport
    );
    const customer = this.sendCustomersEmail(
      event,
      booking,
      config,
      params,
      transport
    );

    await Promise.all([owner, customer]);
  }

  private async sendCustomersEmail(
    event: MeetingEvent,
    booking: BookingConfiguration,
    config: CalendarEventOptions,
    params: Record<string, any>,
    transporter: nodemailer.Transporter
  ): Promise<void> {
    const eventContent = this.getEventCalendarContnet(
      event,
      template(booking.event.summary, params),
      template(booking.event.description, params),
      config
    );

    const mailOptions: nodemailer.SendMailOptions = {
      from: booking.email.from,
      to: event.fields.email,
      subject: template(booking.email.subject, params),
      html: template(booking.email.body, params),
      icalEvent: {
        filename: "invitation.ics",
        method: "REQUEST",
        content: eventContent,
      },
    };

    await transporter.sendMail(mailOptions);
  }

  private async sendOwnerEmail(
    event: MeetingEvent,
    booking: BookingConfiguration,
    config: CalendarEventOptions,
    params: Record<string, any>,
    transporter: nodemailer.Transporter
  ): Promise<void> {
    const eventSummary = `${event.fields.name} for ${event.meetingName}`;
    const description = `<p>New booking from ${event.fields.name} at ${params.dateTime}</p>
        <p>Customer email: ${event.fields.email}</p>
        <p>Customer phone: ${event.fields.phone}</p>
        <p>Service: ${event.meetingName}</p>
        <p>Duration: ${event.duration} minutes</p>`;

    const eventContent = this.getEventCalendarContnet(
      event,
      eventSummary,
      description,
      config
    );

    const mailOptions: nodemailer.SendMailOptions = {
      from: booking.email.from,
      to: booking.email.to,
      subject: `New booking from ${params.name} at ${params.dateTime}`,
      html: description,
      icalEvent: {
        filename: "invitation.ics",
        method: "REQUEST",
        content: eventContent,
      },
    };

    await transporter.sendMail(mailOptions);
  }

  private getEventCalendarContnet(
    event: MeetingEvent,
    summary: string,
    description: string,
    config: CalendarEventOptions
  ): string {
    const host = new URL(config.url).host;

    const date = DateTime.fromISO(event.dateTime);

    const { error, value } = ics.createEvent({
      method: "REQUEST",
      uid: `${date.toMillis()}@${host}`,
      start: date.toMillis(),
      end: date.plus({ minutes: event.duration }).toMillis(),
      startInputType: "utc",
      endInputType: "utc",
      organizer: {
        email: config.from,
        name: config.name,
      },
      url: `${config.url}/event/${date.toMillis()}`,
      title: summary,
      description: description,
      location: config.address,
      attendees: [
        {
          partstat: "ACCEPTED",
          name: event.fields.name,
          email: event.fields.email,
        },
      ],
    });

    if (!value) {
      throw `Failed to generate ics: ${error?.message}`;
    }

    return value;
  }

  private async getDbBusyTimes(
    start: DateTime,
    end: DateTime
  ): Promise<Period[]> {
    const db = await getDbConnection();
    const events = await db
      .collection<DbEvent>(APPOINTMENTS_COLLECTION_NAME)
      .find({
        dateTime: {
          $gte: start.minus({ days: 1 }).toJSDate(),
          $lte: end.plus({ days: 1 }).toJSDate(),
        },
      })
      .map(({ duration, dateTime }) => {
        return {
          duration,
          dateTime,
        };
      })
      .toArray();

    return events.map((x) => ({
      startAt: DateTime.fromJSDate(x.dateTime, { zone: "utc" }),
      endAt: DateTime.fromJSDate(x.dateTime, { zone: "utc" }).plus({
        minutes: x.duration,
      }),
    }));
  }

  private async saveEvent(event: MeetingEvent) {
    const db = await getDbConnection();
    const appointments = db.collection<DbEvent>(APPOINTMENTS_COLLECTION_NAME);

    const dbEvent: DbEvent = {
      ...event,
      dateTime: DateTime.fromISO(event.dateTime, { zone: "utc" }).toJSDate(),
    };

    await appointments.insertOne(dbEvent);
  }
}
