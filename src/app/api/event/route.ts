import { Services } from "@/lib/services";
import { AppointmentEvent } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const event = (await request.json()) as AppointmentEvent;
  if (
    !event ||
    !event.totalDuration ||
    !event.dateTime ||
    !event.fields.name ||
    !event.fields.email
  )
    return NextResponse.json({ error: "event is required" }, { status: 400 });

  try {
    const { _id } = await Services.EventsService().createEvent(event);

    return NextResponse.json({ success: true, id: _id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: "time_not_available", message: e?.message },
      { status: 400 }
    );
  }
}
