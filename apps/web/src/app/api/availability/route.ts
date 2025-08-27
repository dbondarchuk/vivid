import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("API/availability")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing availability API request",
  );

  const searchParams = request.nextUrl.searchParams;
  const durationStr = searchParams.get("duration");

  if (!durationStr) {
    logger.warn("Missing required duration parameter");
    return NextResponse.json(
      { error: "Duration is required" },
      { status: 400 },
    );
  }

  const duration = parseInt(durationStr);
  if (!duration || duration <= 0) {
    logger.warn({ duration, durationStr }, "Invalid duration parameter");
    return NextResponse.json(
      { error: "Duration should be positive number" },
      { status: 400 },
    );
  }

  logger.debug({ duration }, "Fetching availability");

  const availability =
    await ServicesContainer.EventsService().getAvailability(duration);

  logger.debug(
    {
      duration,
      availableSlots: availability.length,
    },
    "Successfully retrieved availability",
  );

  return NextResponse.json(availability);
}
