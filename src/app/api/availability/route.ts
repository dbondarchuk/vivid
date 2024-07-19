import { AvailabilityService } from "@/services/availabilityService";
import { ConfigurationService } from "@/services/configurationService";
import { EventsService } from "@/services/eventsService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const durationStr = searchParams.get("duration");
  if (!durationStr)
    return NextResponse.json(
      { error: "Duration is required" },
      { status: 400 }
    );

  const duration = parseInt(durationStr);
  if (!duration || duration <= 0)
    return NextResponse.json(
      { error: "Duration should be positive number" },
      { status: 400 }
    );

  const configurationService = new ConfigurationService();
  const availabilityService = new AvailabilityService(
    configurationService,
    new EventsService(configurationService)
  );

  const availability = await availabilityService.getAvailability(duration);

  return NextResponse.json(availability);
}
