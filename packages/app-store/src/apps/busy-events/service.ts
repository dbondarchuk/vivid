import {
  CalendarBusyTime,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  ICalendarBusyTimeProvider,
  IConnectedApp,
  IConnectedAppProps,
  Schedule,
  ScheduleOverride,
  WeekIdentifier,
  WithDatabaseId,
} from "@vivid/types";
import { eachOfInterval, getWeekIdentifier, parseTime } from "@vivid/utils";
import { ObjectId } from "mongodb";
import { RequestAction } from "./models";

export const BUSY_EVENTS_COLLECTION_NAME = "busy-events";

type BusyEventsEntity = WithDatabaseId<ScheduleOverride> & {
  appId: string;
};

export default class BusyEventsConnectedApp
  implements IConnectedApp, ICalendarBusyTimeProvider
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: RequestAction
  ): Promise<any> {
    switch (data.type) {
      case "get-weekly-busy-events":
        return await this.getWeekBusyEvents(appData._id, data.week);

      case "set-busy-events":
        return await this.setBusyEvents(appData._id, data.week, data.events);

      default: {
        const status: ConnectedAppStatusWithText = {
          status: "connected",
          statusText: `Successfully installed the app`,
        };

        this.props.update({
          ...status,
        });

        return status;
      }
    }
  }

  protected async getWeekBusyEvents(
    appId: string,
    weekIdentifier: WeekIdentifier
  ): Promise<Schedule> {
    const db = await this.props.getDbConnection();
    const collection = db.collection<BusyEventsEntity>(
      BUSY_EVENTS_COLLECTION_NAME
    );

    return (
      (
        await collection.findOne({
          appId,
          week: weekIdentifier,
        })
      )?.schedule || []
    );
  }

  protected async setBusyEvents(
    appId: string,
    week: WeekIdentifier,
    schedule: Schedule
  ): Promise<void> {
    const db = await this.props.getDbConnection();
    const events = db.collection<BusyEventsEntity>(BUSY_EVENTS_COLLECTION_NAME);

    await events.updateOne(
      { week, appId },
      {
        $set: {
          schedule,
        },
        $setOnInsert: {
          appId,
          week,
          _id: new ObjectId().toString(),
        },
      },
      { upsert: true }
    );
  }

  public async getBusyTimes(
    { _id: appId }: ConnectedAppData,
    start: Date,
    end: Date
  ): Promise<CalendarBusyTime[]> {
    const days = eachOfInterval(start, end, "day");

    const weekMap = days.reduce(
      (map, day) => ({
        ...map,
        [day.toISODate()!]: getWeekIdentifier(day),
      }),
      {} as Record<string, WeekIdentifier>
    );

    const weeks = Array.from(
      new Set(Object.values(weekMap).map((week) => week))
    );

    const db = await this.props.getDbConnection();
    const busyEvents = db.collection<BusyEventsEntity>(
      BUSY_EVENTS_COLLECTION_NAME
    );

    const weeksOverrides = await busyEvents
      .find({
        appId,
        week: {
          $in: weeks,
        },
      })
      .toArray();

    const weeksOverridesMap = weeksOverrides.reduce(
      (map, weeksOverride) => ({
        ...map,
        [weeksOverride.week]: weeksOverride.schedule,
      }),
      {} as Record<WeekIdentifier, Schedule>
    );

    const events = days.flatMap((day) => {
      const week = getWeekIdentifier(day);
      const weekEvents = weeksOverridesMap[week];

      const weekDay = day.weekday;
      const dayEvents = weekEvents?.find((s) => s.weekDay === weekDay)?.shifts;

      if (!dayEvents) return [];

      return dayEvents.map((event, index) => ({
        endAt: day.set(parseTime(event.end)).toJSDate(),
        startAt: day.set(parseTime(event.start)).toJSDate(),
        uid: `busy-event-${day.toISODate()}-${index}`,
        title: "Busy",
      }));
    });

    return events;
  }
}
