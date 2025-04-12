import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  DaySchedule,
  IConnectedApp,
  IConnectedAppProps,
  IScheduleProvider,
  Schedule,
  ScheduleOverride,
  WeekIdentifier,
  WithDatabaseId,
} from "@vivid/types";
import { eachOfInterval, getWeekIdentifier } from "@vivid/utils";
import { AnyBulkWriteOperation, ObjectId } from "mongodb";
import { RequestAction } from "./models";

export const SCHEDULE_COLLECTION_NAME = "weekly-schedules";

type ScheduleOverrideEntity = WithDatabaseId<ScheduleOverride> & {
  appId: string;
};

export default class WeeklyScheduleConnectedApp
  implements IConnectedApp, IScheduleProvider
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: RequestAction
  ): Promise<any> {
    switch (data.type) {
      case "get-weekly-schedule":
        return await this.getWeekSchedule(appData._id, data.week);

      case "set-schedules":
        return await this.setSchedules(
          appData._id,
          data.schedules,
          data.replaceExisting
        );

      case "remove-schedule":
        return await this.removeSchedule(appData._id, data.week);

      case "remove-all-schedules":
        return await this.removeAllSchedules(appData._id, data.week);

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

  public async unInstall(appData: ConnectedAppData): Promise<void> {
    const db = await this.props.getDbConnection();
    const collection = db.collection<ScheduleOverrideEntity>(
      SCHEDULE_COLLECTION_NAME
    );
    await collection.deleteMany({
      appId: appData._id,
    });

    const count = await collection.countDocuments({});
    if (count === 0) {
      await db.dropCollection(SCHEDULE_COLLECTION_NAME);
    }
  }

  protected async setSchedule(
    appId: string,
    weekIdentifier: WeekIdentifier,
    schedule: Schedule
  ): Promise<void> {
    return await this.setSchedules(
      appId,
      {
        [weekIdentifier]: schedule,
      },
      true
    );
  }

  protected async setSchedules(
    appId: string,
    schedules: Record<WeekIdentifier, Schedule>,
    replaceExisting?: boolean
  ): Promise<void> {
    const db = await this.props.getDbConnection();
    const scheduleOverrides = db.collection<ScheduleOverrideEntity>(
      SCHEDULE_COLLECTION_NAME
    );

    const operations: AnyBulkWriteOperation<ScheduleOverrideEntity>[] =
      Object.entries(schedules).map(([week, schedule]) => ({
        updateOne: {
          filter: { week: parseInt(week), appId },
          update: {
            $set: replaceExisting
              ? {
                  schedule,
                }
              : {},
            $setOnInsert: {
              week: parseInt(week),
              appId,
              _id: new ObjectId().toString(),
              ...(replaceExisting ? {} : { schedule }),
            },
          },
          upsert: true,
        },
      }));

    await scheduleOverrides.bulkWrite(operations);
  }

  protected async removeSchedule(
    appId: string,
    weekIdentifier: WeekIdentifier
  ): Promise<void> {
    const db = await this.props.getDbConnection();
    const scheduleOverrides = db.collection<ScheduleOverrideEntity>(
      SCHEDULE_COLLECTION_NAME
    );

    await scheduleOverrides.deleteOne({
      appId,
      week: weekIdentifier,
    });
  }

  protected async removeAllSchedules(
    appId: string,
    weekIdentifier: WeekIdentifier
  ): Promise<void> {
    const db = await this.props.getDbConnection();
    const scheduleOverrides = db.collection<ScheduleOverrideEntity>(
      SCHEDULE_COLLECTION_NAME
    );

    await scheduleOverrides.deleteMany({
      appId,
      week: {
        $gte: weekIdentifier,
      },
    });
  }

  protected async getWeekSchedule(
    appId: string,
    weekIdentifier: WeekIdentifier
  ): Promise<{
    schedule: Schedule;
    isDefault: boolean;
  }> {
    const db = await this.props.getDbConnection();
    const scheduleOverrides = db.collection<ScheduleOverrideEntity>(
      SCHEDULE_COLLECTION_NAME
    );

    const scheduleOverride = await scheduleOverrides.findOne({
      appId,
      week: weekIdentifier,
    });

    return scheduleOverride?.schedule
      ? {
          schedule: scheduleOverride?.schedule,
          isDefault: false,
        }
      : {
          schedule: (
            await this.props.services
              .ConfigurationService()
              .getConfiguration("schedule")
          ).schedule,
          isDefault: true,
        };
  }

  public async getSchedule(
    appData: ConnectedAppData,
    start: Date,
    end: Date
  ): Promise<Record<string, DaySchedule>> {
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
    const scheduleOverrides = db.collection<ScheduleOverrideEntity>(
      SCHEDULE_COLLECTION_NAME
    );

    const weeksOverrides = await scheduleOverrides
      .find({
        appId: appData._id,
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

    return days.reduce(
      (map, day) => {
        const dayStr = day.toISODate()!;
        const week = getWeekIdentifier(day);
        const weekSchedule = weeksOverridesMap[week];

        const weekDay = day.weekday;
        const daySchedule = weekSchedule?.find(
          (s) => s.weekDay === weekDay
        )?.shifts;

        if (!daySchedule) return map;

        return {
          ...map,
          [dayStr]: daySchedule || [],
        };
      },
      {} as Record<string, DaySchedule>
    );
  }
}
