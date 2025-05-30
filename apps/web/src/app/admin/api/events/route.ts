import { ServicesContainer } from "@vivid/services";
import { AppointmentStatus, appointmentStatuses } from "@vivid/types";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");
  const includeDeclined =
    searchParams.get("includeDeclined")?.toLowerCase() === "true";
  if (!startStr || !endStr)
    return NextResponse.json({ error: "Range is required" }, { status: 400 });

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

  let events = await ServicesContainer.EventsService().getEvents(
    start.toJSDate(),
    end.toJSDate(),
    statuses
  );

  // const config =
  //   await ServicesContainer.ConfigurationService().getConfiguration("booking");

  // events = events.map((event) => ({
  //   ...event,
  //   dateTime: DateTime.fromJSDate(event.dateTime)
  //     .setZone(config.timezone)
  //     .toJSDate(),
  //   createdAt:
  //     "createdAt" in event
  //       ? DateTime.fromJSDate(event.createdAt)
  //           .setZone(config.timezone)
  //           .toJSDate()
  //       : undefined,
  // }));

  return NextResponse.json(events);
}
