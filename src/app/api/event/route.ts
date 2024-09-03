import { Services } from "@/lib/services";
import { AppointmentEvent } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const event = (await request.json()) as AppointmentEvent;
  if (
    !event ||
    !event.totalDuration ||
    !event.dateTime ||
    !event.fields.name ||
    !event.fields.email
  )
    return NextResponse.json({ error: "event is required" }, { status: 400 });

  await Services.EventsService().createEvent(event);

  return NextResponse.json({ success: true }, { status: 201 });
}
