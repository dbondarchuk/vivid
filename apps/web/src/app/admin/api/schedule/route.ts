import { ServicesContainer } from "@vivid/services";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");

  if (!startStr || !endStr)
    return NextResponse.json({ error: "Range is required" }, { status: 400 });

  const start = DateTime.fromISO(startStr);
  const end = DateTime.fromISO(endStr);
  if (!start.isValid || !end.isValid)
    return NextResponse.json(
      { error: "Start and End must be dates in ISO format" },
      { status: 400 }
    );

  const response = await ServicesContainer.ScheduleService().getSchedule(
    start.toJSDate(),
    end.toJSDate()
  );

  return NextResponse.json(response);
}
