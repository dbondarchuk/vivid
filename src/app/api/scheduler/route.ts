import { Services } from "@/lib/services";
import { okStatus } from "@/types/general/actionStatus";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateString = searchParams.get("dateTime");
  const key = searchParams.get("key");
  let date: DateTime;

  if (dateString) date = DateTime.fromISO(dateString);
  else date = DateTime.now();

  if (key !== process.env.SCHEDULER_KEY)
    return NextResponse.json(
      { error: "Scheduler key is required" },
      { status: 401 }
    );

  Services.RemindersService().sendReminders(date.toJSDate());

  return NextResponse.json(okStatus);
}
