import { parseIcsCalendar, parseIcsEvent } from "@ts-ics/schema-zod";
import { getLoggerFactory } from "@vivid/logger";
import {
  CalendarBusyTime,
  CalendarEvent,
  CalendarEventAttendee,
  CalendarEventResult,
  ConnectedAppData,
  ConnectedAppError,
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
  protected readonly loggerFactory = getLoggerFactory("CaldavConnectedApp");

  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: CaldavCalendarSource
  ): Promise<ConnectedAppStatusWithText | string[]> {
    const logger = this.loggerFactory("processRequest");
    logger.debug(
      {
        appId: appData._id,
        serverUrl: data.serverUrl,
        username: data.username,
      },
      "Processing CalDAV connection request"
    );

    try {
      const client = this.getClient(data);
      logger.debug(
        { appId: appData._id },
        "Attempting to login to CalDAV server"
      );

      await client.login();

      // Try to connect
      logger.debug(
        { appId: appData._id },
        "Fetching calendars from CalDAV server"
      );

      const calendars = await client.fetchCalendars();

      logger.debug(
        {
          appId: appData._id,
          calendarCount: calendars.length,
          targetCalendar: data.calendarName,
        },
        "Retrieved calendars from server"
      );

      if (!calendars.some((c) => c.displayName === data.calendarName)) {
        logger.warn(
          {
            appId: appData._id,
            calendarName: data.calendarName,
            availableCalendars: calendars.map((c) => c.displayName),
          },
          "Target calendar not found"
        );

        throw new ConnectedAppError("calDav.statusText.calendar_not_found", {
          calendarName: data.calendarName,
        });
      }

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: {
          key: "calDav.statusText.successfully_set_up",
          args: {
            calendarName: data.calendarName,
          },
        },
      };

      this.props.update({
        account: {
          username: `${data.username} / ${data.calendarName}`,
          serverUrl: data.serverUrl,
        },
        data,
        ...status,
      });

      logger.info(
        {
          appId: appData._id,
          calendarName: data.calendarName,
          status: status.status,
        },
        "Successfully connected to CalDAV calendar"
      );

      return status;
    } catch (error: any) {
      logger.error(
        {
          appId: appData._id,
          error,
          serverUrl: data.serverUrl,
        },
        "Failed to connect to CalDAV server"
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "common.statusText.error",
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
    const logger = this.loggerFactory("processStaticRequest");
    logger.debug(
      { serverUrl: request.serverUrl, username: request.username },
      "Processing static request to fetch calendars"
    );

    try {
      const { fetchCalendars, ...data } = request;

      const client = this.getClient(data);
      logger.debug(
        { serverUrl: data.serverUrl },
        "Attempting to login for calendar fetch"
      );

      await client.login();

      logger.debug({ serverUrl: data.serverUrl }, "Fetching calendars");
      const calendars = await client.fetchCalendars();

      const calendarNames = calendars
        .map((calendar) => calendar.displayName)
        .map((name) => {
          if (!name || typeof name === "string") return name;
          return Object.keys(name)[0];
        })
        .filter((name) => !!name) as string[];

      logger.info(
        { serverUrl: data.serverUrl, calendarCount: calendarNames.length },
        "Successfully fetched calendar list"
      );

      return calendarNames;
    } catch (error: any) {
      logger.error(
        { serverUrl: request.serverUrl, error },
        "Failed to fetch calendars"
      );

      throw new ConnectedAppError(
        "calDav.statusText.failed_to_fetch_calendars",
        {
          serverUrl: request.serverUrl,
        }
      );
    }
  }

  public async getBusyTimes(
    appData: ConnectedAppData,
    start: Date,
    end: Date
  ): Promise<CalendarBusyTime[]> {
    const logger = this.loggerFactory("getBusyTimes");
    logger.debug(
      {
        appId: appData._id,
        start: start.toISOString(),
        end: end.toISOString(),
      },
      "Getting busy times from CalDAV calendar"
    );

    try {
      const startTime = DateTime.fromJSDate(start).toUTC().toISO()!;
      const endTime = DateTime.fromJSDate(end).toUTC().toISO()!;

      logger.debug(
        { appId: appData._id, startTime, endTime },
        "Converted time range to UTC"
      );

      const { client, calendar } = await this.getCalendar(appData.data);

      logger.debug(
        { appId: appData._id, calendarName: calendar.displayName },
        "Retrieved calendar for busy time fetch"
      );

      const timezones =
        (calendar.timezone
          ? parseIcsCalendar(calendar.timezone).timezones
          : undefined) || [];

      logger.debug(
        { appId: appData._id, timezoneCount: timezones.length },
        "Parsed calendar timezones"
      );

      logger.debug(
        { appId: appData._id, startTime, endTime },
        "Fetching calendar objects from CalDAV server"
      );

      const objects = await client.fetchCalendarObjects({
        calendar: calendar,
        expand: true,
        urlFilter: () => true,
        timeRange: {
          start: startTime,
          end: endTime,
        },
      });

      logger.debug(
        { appId: appData._id, objectCount: objects.length },
        "Retrieved calendar objects from server"
      );

      const events = objects
        .map((obj) => {
          const dataStr = obj.data as string;
          const eventStr = dataStr.match(getEventRegex)?.[0];
          if (!eventStr) return null;

          return parseIcsEvent(eventStr, { timezones });
        })
        .filter((e) => !!e);

      logger.debug(
        { appId: appData._id, eventCount: events.length },
        "Parsed events from calendar objects"
      );

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

      logger.info(
        { appId: appData._id, busyTimeCount: calDavEvents.length },
        "Successfully retrieved busy times from CalDAV calendar"
      );

      this.props.update({
        status: "connected",
        statusText: {
          key: "calDav.statusText.successfully_fetched_calendars",
          args: {
            serverUrl: appData.data?.serverUrl,
          },
        },
      });

      return calDavEvents;
    } catch (error: any) {
      logger.error(
        { appId: appData._id, error },
        "Error getting busy times from CalDAV calendar"
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "common.statusText.error",
      };

      this.props.update({
        ...status,
      });

      throw error;
    }
  }

  public async createEvent(
    app: ConnectedAppData,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const logger = this.loggerFactory("createEvent");
    logger.debug(
      { appId: app._id, eventId: event.id, eventTitle: event.title },
      "Creating event in CalDAV calendar"
    );

    try {
      const { client, calendar } = await this.getCalendar(app.data);

      logger.debug(
        { appId: app._id, calendarName: calendar.displayName },
        "Retrieved calendar for event creation"
      );

      const ics = this.getEventIcs(event);

      logger.debug(
        { appId: app._id, eventId: event.id, icsLength: ics.length },
        "Generated ICS content for event"
      );

      const result = await client.createCalendarObject({
        calendar,
        iCalString: ics,
        filename: `${event.id}.ics`,
      });

      logger.info(
        { appId: app._id, eventId: event.id, eventTitle: event.title },
        "Successfully created event in CalDAV calendar"
      );

      return {
        uid: event.uid,
      };
    } catch (error: any) {
      logger.error(
        {
          appId: app._id,
          eventId: event.id,
          error: error instanceof Error ? error.message : String(error),
        },
        "Error creating event in CalDAV calendar"
      );

      this.props.update({
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "common.statusText.error",
      });

      throw error;
    }
  }

  public async updateEvent(
    app: ConnectedAppData,
    uid: string,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const logger = this.loggerFactory("updateEvent");
    logger.debug(
      { appId: app._id, eventId: event.id, uid, eventTitle: event.title },
      "Updating event in CalDAV calendar"
    );

    try {
      const { client, calendar } = await this.getCalendar(app.data);
      const ics = this.getEventIcs(event);

      const url = `${calendar.url.replace(/\/?$/, "/")}${event.id}.ics`;

      logger.debug(
        { appId: app._id, eventId: event.id, url },
        "Updating calendar object at URL"
      );

      await client.updateCalendarObject({
        calendarObject: {
          url,
          data: ics,
        },
      });

      logger.info(
        { appId: app._id, eventId: event.id, uid, eventTitle: event.title },
        "Successfully updated event in CalDAV calendar"
      );

      return {
        uid,
      };
    } catch (error: any) {
      logger.error(
        {
          appId: app._id,
          eventId: event.id,
          uid,
          error: error instanceof Error ? error.message : String(error),
        },
        "Error updating event in CalDAV calendar"
      );

      this.props.update({
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "common.statusText.error",
      });

      throw error;
    }
  }

  public async deleteEvent(
    app: ConnectedAppData,
    uid: string,
    eventId: string
  ): Promise<void> {
    const logger = this.loggerFactory("deleteEvent");
    logger.debug(
      { appId: app._id, eventId, uid },
      "Deleting event from CalDAV calendar"
    );

    try {
      const { client, calendar } = await this.getCalendar(app.data);
      const url = `${calendar.url.replace(/\/?$/, "/")}${eventId}.ics`;

      logger.debug(
        { appId: app._id, eventId, url },
        "Deleting calendar object at URL"
      );

      await client.deleteCalendarObject({
        calendarObject: {
          url,
        },
      });

      logger.info(
        { appId: app._id, eventId, uid },
        "Successfully deleted event from CalDAV calendar"
      );
    } catch (error: any) {
      logger.error(
        {
          appId: app._id,
          eventId,
          uid,
          error: error instanceof Error ? error.message : String(error),
        },
        "Error deleting event from CalDAV calendar"
      );

      this.props.update({
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "common.statusText.error",
      });

      throw error;
    }
  }

  protected getEventIcs(event: CalendarEvent) {
    const logger = this.loggerFactory("getEventIcs");
    logger.debug(
      {
        eventId: event.id,
        eventTitle: event.title,
        attendeeCount: event.attendees.length,
      },
      "Generating ICS content for event"
    );

    const start = DateTime.fromJSDate(event.startTime).setZone(event.timeZone);
    const end = start.plus({ minutes: event.duration });

    const ics = generateIcsCalendar({
      version: "2.0",
      prodId: "-//vivid-caldav//EN",
      events: [
        {
          start: {
            date: start.toUTC().toJSDate(),
            local: {
              date: start.toJSDate(),
              timezone: event.timeZone,
              tzoffset: start.toFormat("ZZ"),
            },
          },
          end: {
            date: end.toUTC().toJSDate(),
            local: {
              date: end.toJSDate(),
              timezone: event.timeZone,
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

    logger.debug(
      { eventId: event.id, icsLength: ics.length },
      "Generated ICS content"
    );

    return ics;
  }

  protected async getCalendar(config: CaldavCalendarSource) {
    const logger = this.loggerFactory("getCalendar");
    logger.debug(
      {
        serverUrl: config.serverUrl,
        username: config.username,
        calendarName: config.calendarName,
      },
      "Getting calendar configuration"
    );

    try {
      const client = this.getClient(config);

      logger.debug(
        { serverUrl: config.serverUrl },
        "Attempting to login to CalDAV server"
      );
      await client.login();

      const calendarName = config?.calendarName;
      if (!calendarName) {
        logger.error(
          { serverUrl: config.serverUrl },
          "Calendar name is not set"
        );
        throw new Error("Calendar name is not set");
      }

      logger.debug(
        { serverUrl: config.serverUrl },
        "Fetching calendars from server"
      );

      const calendars = await client.fetchCalendars();

      logger.debug(
        {
          serverUrl: config.serverUrl,
          calendarCount: calendars.length,
          targetCalendar: calendarName,
        },
        "Retrieved calendars from server"
      );

      const calendar = calendars.find((c) => {
        if (!c.displayName) return false;
        if (typeof c.displayName === "string")
          return c.displayName === calendarName;

        return Object.keys(c.displayName)[0] === calendarName;
      });

      if (!calendar) {
        logger.warn(
          {
            serverUrl: config.serverUrl,
            calendarName,
            availableCalendars: calendars.map((c) => c.displayName),
          },
          "Target calendar not found"
        );
        throw new Error(`Can't find calendar '${calendarName}'`);
      }

      logger.debug(
        {
          serverUrl: config.serverUrl,
          calendarName,
          calendarUrl: calendar.url,
        },
        "Found target calendar"
      );

      return { client, calendar };
    } catch (error: any) {
      logger.error(
        {
          serverUrl: config.serverUrl,
          error: error instanceof Error ? error.message : String(error),
        },
        "Error getting calendar configuration"
      );

      this.props.update({
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "common.statusText.error",
      });

      throw error;
    }
  }

  protected getClient(config: CaldavCalendarSource): DAVClient {
    const logger = this.loggerFactory("getClient");
    logger.debug(
      { serverUrl: config.serverUrl, username: config.username },
      "Creating DAV client"
    );

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
