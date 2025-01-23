import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
  Period,
} from "@/types";
import {
  CalendarBusyTime,
  ICalendarBusyTimeProvider,
} from "@/types/apps/calendars/calendarBusyTimeProvider";
import { DateTime } from "luxon";
import { parseIcsCalendar, parseIcsEvent } from "ts-ics";
import { DAVClient } from "tsdav";
import { CaldavCalendarSource } from "./caldav.models";
import { NextRequest } from "next/server";

export class CaldavConnectedApp
  implements IConnectedApp, ICalendarBusyTimeProvider
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
    data: CaldavCalendarSource
  ): Promise<ConnectedAppStatusWithText> {
    let success = false;
    let error: string | undefined = undefined;

    try {
      const client = this.getClient(data);
      await client.login();

      const calendars = await client.fetchCalendars();

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: `Successfully fetched ${calendars.length} calendar(s)`,
      };

      this.props.update({
        account: {
          username: data.username,
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

  public async getBusyTimes(
    appData: ConnectedAppData,
    start: DateTime,
    end: DateTime
  ): Promise<CalendarBusyTime[]> {
    try {
      const client = this.getClient(appData.data);

      const startTime = start.toUTC().toISO()!;
      const endTime = end.toUTC().toISO()!;

      await client.login();

      const calendars = await client.fetchCalendars();
      const promises = calendars.map(async (calendar) => {
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

        const events = objects.map((obj) =>
          parseIcsEvent(obj.data as string, timezones)
        );

        const calDavEvents: CalendarBusyTime[] = events.map((event) => {
          const startAt = DateTime.fromJSDate(event.start.date);
          const endAt = event.end
            ? DateTime.fromJSDate(event.end.date)
            : DateTime.fromJSDate(event.start.date).plus({ years: 1 });

          return {
            startAt,
            endAt,
            uid: event.uid,
            title: event.summary,
          };
        });

        return calDavEvents;
      });

      const events = (await Promise.all(promises)).flat();
      return events;
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
