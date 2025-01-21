import { Services } from "@/lib/services";
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

  const availability = await Services.EventsService().getAvailability(duration);

  return NextResponse.json(availability);
}
