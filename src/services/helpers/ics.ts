import { Period } from "@/models/period";
import { DateTime } from "luxon";
import { parseIcsCalendar } from "ts-ics";

export class IcsBusyTimeProvider {
  constructor(public readonly icsUrl: string) {}

  public async getBusyTimes(start: DateTime, end: DateTime): Promise<Period[]> {
    const ics = await this.getIcs();
    const calendar = parseIcsCalendar(ics);

    const icsEvents: Period[] = (calendar.events || [])
      .map((event) => {
        const startAt = DateTime.fromJSDate(event.start.date);
        const endAt = event.end
          ? DateTime.fromJSDate(event.end.date)
          : DateTime.fromJSDate(event.start.date).plus({ years: 1 });
        return {
          startAt,
          endAt,
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
