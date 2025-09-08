import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/schedule")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing schedule API request",
  );

  const searchParams = request.nextUrl.searchParams;
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");

  if (!startStr || !endStr) {
    logger.warn({ startStr, endStr }, "Missing required date range parameters");
    return NextResponse.json({ error: "Range is required" }, { status: 400 });
  }

  const start = DateTime.fromISO(startStr);
  const end = DateTime.fromISO(endStr);
  if (!start.isValid || !end.isValid) {
    logger.warn({ startStr, endStr }, "Invalid date range parameters");
    return NextResponse.json(
      { error: "Start and End must be dates in ISO format" },
      { status: 400 },
    );
  }

  const response = await ServicesContainer.ScheduleService().getSchedule(
    start.toJSDate(),
    end.toJSDate(),
  );

  logger.debug(
    {
      start: startStr,
      end: endStr,
    },
    "Successfully retrieved schedule",
  );

  return NextResponse.json(response);
}
