import { Period } from "@/types/booking/period";
import { DateTime } from "luxon";
import { parseIcsCalendar } from "ts-ics";

export type IcsEvent = Period & {
  title?: string;
  uid: string;
};

export class IcsBusyTimeProvider {
  constructor(public readonly icsUrl: string) {}

  public async getBusyTimes(
    start: DateTime,
    end: DateTime,
    excludedUids?: string[]
  ): Promise<IcsEvent[]> {
    const ics = await this.getIcs();
    const calendar = parseIcsCalendar(ics);

    const excludedUidsSet = new Set(excludedUids || []);

    const icsEvents: IcsEvent[] = (calendar.events || [])
      .filter(
        (event) =>
          event.status !== "CANCELLED" &&
          !event.summary?.toLocaleLowerCase()?.startsWith("cancel") &&
          !excludedUidsSet.has(event.uid)
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
      .filter((event) => event.endAt >= start && event.startAt <= end);

    return icsEvents;
  }

  protected async getIcs(): Promise<string> {
    const response = await fetch(this.icsUrl);
    return await response.text();
  }
}

export const getIcsEventUid = (id: string, url: string) => {
  const host = new URL(url).host;
  return `${id}@${host}`;
};
