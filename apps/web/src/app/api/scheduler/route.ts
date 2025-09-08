import { AvailableAppServices } from "@vivid/app-store/services";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { IScheduled, okStatus } from "@vivid/types";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("API/scheduler")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing scheduler API request",
  );

  const searchParams = request.nextUrl.searchParams;
  const dateString = searchParams.get("date");
  const key = searchParams.get("key");
  let date: DateTime;

  if (dateString) date = DateTime.fromISO(dateString);
  else date = DateTime.now();

  if (key !== process.env.SCHEDULER_KEY) {
    logger.warn(
      { providedKey: key ? "***" : "missing" },
      "Invalid or missing scheduler key",
    );
    return NextResponse.json(
      { error: "Scheduler key is required" },
      { status: 401 },
    );
  }

  logger.debug(
    {
      date: date.toISO(),
      appCount: 0, // Will be updated after fetching apps
    },
    "Starting scheduled tasks execution",
  );

  const apps =
    await ServicesContainer.ConnectedAppsService().getAppsByScopeWithData(
      "scheduled",
    );

  logger.debug(
    {
      date: date.toISO(),
      appCount: apps.length,
      appNames: apps.map((app) => app.name),
    },
    "Found scheduled apps to process",
  );

  const promises = apps.map(async (app) => {
    const service = AvailableAppServices[app.name](
      ServicesContainer.ConnectedAppsService().getAppServiceProps(app._id),
    );

    return (service as any as IScheduled).onTime(app, date.toUTC().toJSDate());
  });

  Promise.all(promises);

  logger.debug(
    {
      date: date.toISO(),
      appCount: apps.length,
    },
    "Successfully initiated scheduled tasks",
  );

  return NextResponse.json(okStatus);
}
