import { parseIcsCalendar } from "@ts-ics/schema-zod";
import {
  CalendarBusyTime,
  ConnectedAppData,
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
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: IcsLinkCalendarSource
  ): Promise<ConnectedAppStatusWithText> {
    let success = false;
    let error: string | undefined = undefined;

    try {
      const response = await fetch(data.link);
      if (response.status >= 400) {
        throw new Error(`Failed to fetch url. Status code: ${response.status}`);
      }

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: "Successfully fetched calendar",
      };

      this.props.update({
        account: {
          serverUrl: data.link,
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
    start: Date,
    end: Date
  ): Promise<CalendarBusyTime[]> {
    try {
      const link = (appData.data as IcsLinkCalendarSource).link;
      const response = await fetch(link);
      const ics = await response.text();

      const calendar = parseIcsCalendar(ics);
      const startDateTime = DateTime.fromJSDate(start);
      const endDateTime = DateTime.fromJSDate(end);

      const icsEvents: CalendarBusyTime[] = (calendar.events || [])
        .filter(
          (event) =>
            event.status !== "CANCELLED" &&
            !event.summary?.toLocaleLowerCase()?.startsWith("cancel")
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
            event.endAt >= startDateTime && event.startAt <= endDateTime
        )
        .map((event) => ({
          ...event,
          startAt: event.startAt.toJSDate(),
          endAt: event.endAt.toJSDate(),
        }));

      return icsEvents;
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
}
