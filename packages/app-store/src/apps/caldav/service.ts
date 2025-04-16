import { parseIcsCalendar, parseIcsEvent } from "@ts-ics/schema-zod";
import {
  CalendarBusyTime,
  CalendarEvent,
  CalendarEventAttendee,
  CalendarEventResult,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  ICalendarBusyTimeProvider,
  ICalendarWriter,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import { DateTime } from "luxon";
import {
  generateIcsCalendar,
  getEventRegex,
  IcsAttendeePartStatusType,
  IcsStatusType,
} from "ts-ics";
import { DAVClient } from "tsdav";
import { CaldavCalendarSource } from "./models";

const attendeeStatusToPartStatusMap: Record<
  CalendarEventAttendee["status"],
  IcsAttendeePartStatusType
> = {
  confirmed: "ACCEPTED",
  declined: "DECLINED",
  tentative: "TENTATIVE",
  organizer: "ACCEPTED",
};

const evetStatusToIcsEventStatus: Record<
  CalendarEvent["status"],
  IcsStatusType
> = {
  confirmed: "CONFIRMED",
  declined: "CANCELLED",
  pending: "TENTATIVE",
};

export default class CaldavConnectedApp
  implements IConnectedApp, ICalendarBusyTimeProvider, ICalendarWriter
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: CaldavCalendarSource
  ): Promise<ConnectedAppStatusWithText | string[]> {
    try {
      const client = this.getClient(data);
      await client.login();

      // Try to connect
      const calendars = await client.fetchCalendars();
      if (!calendars.some((c) => c.displayName === data.calendarName)) {
        throw new Error(`Calendar '${data.calendarName}' was not found`);
      }

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: `Successfully fetched ${data.calendarName} calendar`,
      };

      this.props.update({
        account: {
          username: `${data.username} / ${data.calendarName}`,
          serverUrl: data.serverUrl,
        },
        data,
        ...status,
      });

      return status;
    } catch (e: any) {
      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText: e?.message || e?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      return status;
    }
  }

  public async processStaticRequest(
    request: CaldavCalendarSource & { fetchCalendars: true }
  ): Promise<string[]> {
    try {
      const { fetchCalendars, ...data } = request;

      const client = this.getClient(data);
      await client.login();

      const calendars = await client.fetchCalendars();

      return calendars
        .map((calendar) => calendar.displayName)
        .map((name) => {
          if (!name || typeof name === "string") return name;
          return Object.keys(name)[0];
        })
        .filter((name) => !!name) as string[];
    } catch (e: any) {
      console.error(`Failed to fetch calendars`, e);
      throw e;
    }
  }

  public async getBusyTimes(
    appData: ConnectedAppData,
    start: Date,
    end: Date
  ): Promise<CalendarBusyTime[]> {
    try {
      const startTime = DateTime.fromJSDate(start).toUTC().toISO()!;
      const endTime = DateTime.fromJSDate(end).toUTC().toISO()!;

      const { client, calendar } = await this.getCalendar(appData.data);
      const timezones =
        (calendar.timezone
          ? parseIcsCalendar(calendar.timezone).timezones
          : undefined) || [];

      const objects = await client.fetchCalendarObjects({
        calendar: calendar,
        expand: true,
        urlFilter: () => true,
        timeRange: {
          start: startTime,
          end: endTime,
        },
      });

      const events = objects
        .map((obj) => {
          const dataStr = obj.data as string;
          const eventStr = dataStr.match(getEventRegex)?.[0];
          if (!eventStr) return null;

          return parseIcsEvent(eventStr, { timezones });
        })
        .filter((e) => !!e);

      const calDavEvents: CalendarBusyTime[] = events.map((event) => {
        const startAt = event.start.date;
        const endAt = event.end
          ? event.end.date
          : DateTime.fromJSDate(event.start.date).plus({ years: 1 }).toJSDate();

        return {
          startAt,
          endAt,
          uid: event.uid,
          title: event.summary,
        };
      });

      this.props.update({
        status: "connected",
        statusText: "Successfully fetched events",
      });

      return calDavEvents;
    } catch (e: any) {
      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText: e?.message || e?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      throw e;
    }
  }

  public async createEvent(
    app: ConnectedAppData,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const { client, calendar } = await this.getCalendar(app.data);

    const ics = this.getEventIcs(event);
    const result = await client.createCalendarObject({
      calendar,
      iCalString: ics,
      filename: `${event.id}.ics`,
    });

    return {
      uid: event.uid,
    };
  }

  public async updateEvent(
    app: ConnectedAppData,
    uid: string,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const { client, calendar } = await this.getCalendar(app.data);
    const ics = this.getEventIcs(event);

    const url = `${calendar.url.replace(/\/?$/, "/")}${event.id}.ics`;
    await client.updateCalendarObject({
      calendarObject: {
        url,
        data: ics,
      },
    });

    return {
      uid,
    };
  }

  public async deleteEvent(
    app: ConnectedAppData,
    uid: string,
    eventId: string
  ): Promise<void> {
    const { client, calendar } = await this.getCalendar(app.data);
    const url = `${calendar.url.replace(/\/?$/, "/")}${eventId}.ics`;

    await client.deleteCalendarObject({
      calendarObject: {
        url,
      },
    });
  }

  protected getEventIcs(event: CalendarEvent) {
    const start = DateTime.fromJSDate(event.startTime).setZone(event.timezone);
    const end = start.plus({ minutes: event.duration });

    return generateIcsCalendar({
      version: "2.0",
      prodId: "-//vivid-caldav//EN",
      events: [
        {
          start: {
            date: start.toUTC().toJSDate(),
            local: {
              date: start.toJSDate(),
              timezone: event.timezone,
              tzoffset: start.toFormat("ZZ"),
            },
          },
          end: {
            date: end.toUTC().toJSDate(),
            local: {
              date: end.toJSDate(),
              timezone: event.timezone,
              tzoffset: end.toFormat("ZZ"),
            },
          },
          summary: event.title,
          description: event.description.plainText
            .replace(/(\r\n|\r|\n){2,}/g, "$1\n")
            .replace(/\r\n/g, "\n"),
          url: event.description.url,
          location: event.location.address ?? event.location.name,
          stamp: {
            date: DateTime.utc().toJSDate(),
          },
          uid: event.uid,
          attendees: event.attendees.map((attendee) => ({
            email: attendee.email,
            name: attendee.name,
            partstat: attendeeStatusToPartStatusMap[attendee.status],
          })),
          status: evetStatusToIcsEventStatus[event.status],
        },
      ],
    }).replace(/(?<!\r)\n/g, "\r\n ");
  }

  protected async getCalendar(config: CaldavCalendarSource) {
    const client = this.getClient(config);

    await client.login();

    const calendarName = config?.calendarName;
    if (!calendarName) {
      throw new Error("Calendar name is not set");
    }

    const calendars = await client.fetchCalendars();
    const calendar = calendars.find((c) => {
      if (!c.displayName) return false;
      if (typeof c.displayName === "string")
        return c.displayName === calendarName;

      return Object.keys(c.displayName)[0] === calendarName;
    });

    if (!calendar) {
      throw new Error(`Can't find calendar '${calendarName}'`);
    }

    return { client, calendar };
  }

  protected getClient(config: CaldavCalendarSource): DAVClient {
    return new DAVClient({
      serverUrl: config.serverUrl,
      credentials: {
        username: config.username,
        password: config.password,
      },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    });
  }
}
