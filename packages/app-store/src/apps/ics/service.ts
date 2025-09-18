import { parseIcsCalendar } from "@ts-ics/schema-zod";
import { getLoggerFactory } from "@vivid/logger";
import {
  CalendarBusyTime,
  ConnectedAppData,
  ConnectedAppError,
  ConnectedAppStatusWithText,
  ICalendarBusyTimeProvider,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import { DateTime } from "luxon";
import { IcsLinkCalendarSource } from "./models";

export default class IcsConnectedApp
  implements IConnectedApp, ICalendarBusyTimeProvider
{
  protected readonly loggerFactory = getLoggerFactory("IcsConnectedApp");

  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: IcsLinkCalendarSource,
  ): Promise<ConnectedAppStatusWithText> {
    const logger = this.loggerFactory("processRequest");
    logger.debug(
      { appId: appData._id, icsLink: data.link },
      "Processing ICS calendar connection request",
    );

    try {
      logger.debug(
        { appId: appData._id, icsLink: data.link },
        "Fetching ICS calendar from URL",
      );

      const response = await fetch(data.link);

      logger.debug(
        { appId: appData._id, icsLink: data.link, status: response.status },
        "Received response from ICS URL",
      );

      if (response.status >= 400) {
        logger.error(
          { appId: appData._id, icsLink: data.link, status: response.status },
          "Failed to fetch ICS calendar - HTTP error",
        );

        throw new ConnectedAppError("ics.statusText.http_error", {
          statusCode: response.status,
        });
      }

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: "ics.statusText.successfully_set_up",
      };

      this.props.update({
        account: {
          serverUrl: data.link,
        },
        data,
        ...status,
      });

      logger.info(
        { appId: appData._id, icsLink: data.link, status: status.status },
        "Successfully connected to ICS calendar",
      );

      return status;
    } catch (error: any) {
      logger.error(
        { appId: appData._id, icsLink: data.link, error },
        "Error processing ICS calendar connection request",
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      return status;
    }
  }

  public async getBusyTimes(
    appData: ConnectedAppData,
    start: Date,
    end: Date,
  ): Promise<CalendarBusyTime[]> {
    const logger = this.loggerFactory("getBusyTimes");
    logger.debug(
      {
        appId: appData._id,
        start: start.toISOString(),
        end: end.toISOString(),
      },
      "Getting busy times from ICS calendar",
    );

    try {
      const link = (appData.data as IcsLinkCalendarSource).link;

      logger.debug(
        { appId: appData._id, icsLink: link },
        "Fetching ICS calendar data",
      );

      const response = await fetch(link);

      logger.debug(
        { appId: appData._id, icsLink: link, status: response.status },
        "Received ICS calendar response",
      );

      if (response.status >= 400) {
        logger.error(
          { appId: appData._id, icsLink: link, status: response.status },
          "Failed to fetch ICS calendar data",
        );

        throw new ConnectedAppError("ics.statusText.calendar_fetch_error", {
          statusCode: response.status,
        });
      }

      const ics = await response.text();

      logger.debug(
        { appId: appData._id, icsLink: link, icsLength: ics.length },
        "Retrieved ICS calendar content",
      );

      logger.debug({ appId: appData._id }, "Parsing ICS calendar");

      const calendar = parseIcsCalendar(ics);

      logger.debug(
        { appId: appData._id, eventCount: calendar.events?.length || 0 },
        "Parsed ICS calendar events",
      );

      const startDateTime = DateTime.fromJSDate(start);
      const endDateTime = DateTime.fromJSDate(end);

      logger.debug(
        {
          appId: appData._id,
          startDateTime: startDateTime.toISO(),
          endDateTime: endDateTime.toISO(),
        },
        "Processing events within time range",
      );

      const icsEvents: CalendarBusyTime[] = (calendar.events || [])
        .filter(
          (event) =>
            event.status !== "CANCELLED" &&
            !event.summary?.toLocaleLowerCase()?.startsWith("cancel"),
        )
        .map((event) => {
          const startAt = DateTime.fromJSDate(event.start.date);
          const endAt = event.end
            ? DateTime.fromJSDate(event.end.date)
            : DateTime.fromJSDate(event.start.date).plus({ years: 1 });
          return {
            startAt,
            endAt,
            title: event.summary,
            uid: event.uid,
          };
        })
        .filter(
          (event) =>
            event.endAt >= startDateTime && event.startAt <= endDateTime,
        )
        .map((event) => ({
          ...event,
          startAt: event.startAt.toJSDate(),
          endAt: event.endAt.toJSDate(),
        }));

      logger.info(
        {
          appId: appData._id,
          busyTimeCount: icsEvents.length,
          totalEvents: calendar.events?.length || 0,
        },
        "Successfully processed busy times from ICS calendar",
      );

      this.props.update({
        status: "connected",
        statusText: "ics.statusText.successfully_fetched_events",
      });

      return icsEvents;
    } catch (error: any) {
      logger.error(
        { appId: appData._id, error },
        "Error getting busy times from ICS calendar",
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText:
          error instanceof ConnectedAppError
            ? {
                key: error.key,
                args: error.args,
              }
            : error?.message || error?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      throw error;
    }
  }
}
