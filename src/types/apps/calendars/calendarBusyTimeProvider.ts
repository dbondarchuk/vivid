import { DateTime } from "luxon";
import { Period } from "../../booking";
import { ConnectedAppData } from "../connectedApp";

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
