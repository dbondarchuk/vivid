import type { Availability } from "@/types";
import { DateTime as Luxon } from "luxon";

import { ConfigurationService } from "./configurationService";
import { EventsService } from "./eventsService";
import { getAvailableTimeSlotsInCalendar } from "./helpers/timeSlot";

export class AvailabilityService {
  public constructor(
    private readonly configurationService: ConfigurationService,
    private readonly eventsService: EventsService
  ) {}
  public async getAvailability(duration: number): Promise<Availability> {
    const config = await this.configurationService.getConfiguration("booking");

    const events = await this.eventsService.getBusyEvents();

    const start = Luxon.now().plus({
      hours: config.minHoursBeforeBooking || 0,
    });

    const results = getAvailableTimeSlotsInCalendar({
      calendarEvents: events,
      configuration: {
        timeSlotDuration: duration,
        availablePeriods: config.workHours,
        timeZone: config.timezone || Luxon.now().zoneName!,
        minAvailableTimeAfterSlot: config.minAvailableTimeAfterSlot ?? 0,
        minAvailableTimeBeforeSlot: config.minAvailableTimeBeforeSlot ?? 0,
        slotStartMinuteStep: config.slotStartMinuteStep ?? 15,
      },
      from: start.toJSDate(),
      to: start.plus({ weeks: config.maxWeeksInFuture ?? 8 }).toJSDate(),
    });

    return results.map((x) => x.startAt);
  }
}
