import { DateTime } from "luxon";
import { Period } from "../../booking";
import { ConnectedAppData } from "../connectedApp.data";

export type CalendarBusyTime = Period & {
  title?: string;
  uid: string;
};

export interface ICalendarBusyTimeProvider {
  getBusyTimes(
    app: ConnectedAppData,
    start: DateTime,
    end: DateTime
  ): Promise<CalendarBusyTime[]>;
}
