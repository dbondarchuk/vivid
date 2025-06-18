import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppointmentStatus, appointmentStatuses } from "@vivid/types";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/calendar")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing calendar API request"
  );

  const searchParams = request.nextUrl.searchParams;
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");
  const includeDeclined =
    searchParams.get("includeDeclined")?.toLowerCase() === "true";
  if (!startStr || !endStr) {
    logger.warn({ startStr, endStr }, "Missing required date range parameters");
    return NextResponse.json(
      { error: "Start and end dates are required" },
      { status: 400 }
    );
  }

  logger.debug(
    {
      start: startStr,
      end: endStr,
    },
    "Fetching calendar data"
  );

  const start = DateTime.fromISO(startStr);
  const end = DateTime.fromISO(endStr);
  if (!start.isValid || !end.isValid)
    return NextResponse.json(
      { error: "Start and End must be dates in ISO format" },
      { status: 400 }
    );

  const statuses: AppointmentStatus[] = appointmentStatuses.filter(
    (s) => includeDeclined || s !== "declined"
  );

  const [events, schedule, config] = await Promise.all([
    ServicesContainer.EventsService().getEvents(
      start.toJSDate(),
      end.toJSDate(),
      statuses
    ),
    ServicesContainer.ScheduleService().getSchedule(
      start.toJSDate(),
      end.toJSDate()
    ),
    ServicesContainer.ConfigurationService().getConfiguration("booking"),
  ]);

  logger.debug(
    {
      start: startStr,
      end: endStr,
    },
    "Successfully retrieved calendar data"
  );

  return NextResponse.json({
    events,
    schedule,
    timeZone: config.timeZone,
  });
}
