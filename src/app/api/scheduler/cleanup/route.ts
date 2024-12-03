import { Services } from "@/lib/services";
import { okStatus } from "@/types/general/actionStatus";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key");

  if (key !== process.env.SCHEDULER_KEY)
    return NextResponse.json(
      { error: "Scheduler key is required" },
      { status: 401 }
    );

  const maxDate = DateTime.now().minus({ months: 1 });
  console.log(
    `Cleaning up logs older than ${maxDate.toLocaleString(
      DateTime.DATETIME_FULL_WITH_SECONDS
    )}`
  );
  await Services.CommunicationLogService().clearOldLogs(maxDate.toJSDate());

  return NextResponse.json(okStatus);
}
