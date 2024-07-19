import { MeetingEvent } from "@/models/meetingEvent";
import { ConfigurationService } from "@/services/configurationService";
import { EventsService } from "@/services/eventsService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const event = (await request.json()) as MeetingEvent;
  if (
    !event ||
    !event.duration ||
    !event.date ||
    !event.time ||
    !event.fields.email
  )
    return NextResponse.json({ error: "event is required" }, { status: 400 });

  const configurationService = new ConfigurationService();
  const eventService = new EventsService(configurationService);

  await eventService.createEvent(event);

  return NextResponse.json({ success: true }, { status: 201 });
}
