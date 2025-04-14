import { parseIcsCalendar, parseIcsEvent } from "@ts-ics/schema-zod";
import {
  CalendarBusyTime,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  ICalendarBusyTimeProvider,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import { DateTime } from "luxon";
import { getEventRegex } from "ts-ics";
import { DAVClient } from "tsdav";
import { CaldavCalendarSource } from "./models";

export default class CaldavConnectedApp
  implements IConnectedApp, ICalendarBusyTimeProvider
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
      const client = this.getClient(appData.data);

      const startTime = DateTime.fromJSDate(start).toUTC().toISO()!;
      const endTime = DateTime.fromJSDate(end).toUTC().toISO()!;

      await client.login();

      const calendarName = (appData.data as CaldavCalendarSource)?.calendarName;
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
