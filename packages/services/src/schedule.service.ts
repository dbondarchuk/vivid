import {
  DaySchedule,
  IConfigurationService,
  IConnectedAppsService,
  IScheduleProvider,
  IScheduleService,
} from "@vivid/types";
import { eachOfInterval } from "@vivid/utils";

export class ScheduleService implements IScheduleService {
  constructor(
    protected readonly connectedAppsService: IConnectedAppsService,
    protected readonly configurationService: IConfigurationService
  ) {}

  public async getSchedule(
    start: Date,
    end: Date
  ): Promise<Record<string, DaySchedule>> {
    const days = eachOfInterval(start, end, "day");

    const {
      booking: { scheduleAppId },
      schedule: defaultSchedule,
    } = await this.configurationService.getConfigurations(
      "booking",
      "schedule"
    );

    let scheduleFromApp: Record<string, DaySchedule> = {};
    if (scheduleAppId) {
      const { app: scheduleApp, service: scheduleAppService } =
        await this.connectedAppsService.getAppService<IScheduleProvider>(
          scheduleAppId
        );

      scheduleFromApp = await scheduleAppService.getSchedule(
        scheduleApp,
        start,
        end
      );
    }

    return days.reduce(
      (map, day) => {
        const dayStr = day.toISODate()!;
        const weekDay = day.weekday;

        const daySchedule =
          scheduleFromApp?.[dayStr] ??
          defaultSchedule.schedule.find((s) => s.weekDay === weekDay)?.shifts;

        return {
          ...map,
          [dayStr]: daySchedule || [],
        };
      },
      {} as Record<string, DaySchedule>
    );
  }
}
