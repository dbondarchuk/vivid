import { AvailableAppServices } from "@/apps/apps.services";
import { Services } from "@/lib/services";
import { IScheduled } from "@/types";
import { okStatus } from "@/types/general/actionStatus";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateString = searchParams.get("date");
  const key = searchParams.get("key");
  let date: DateTime;

  if (dateString) date = DateTime.fromISO(dateString);
  else date = DateTime.now();

  if (key !== process.env.SCHEDULER_KEY)
    return NextResponse.json(
      { error: "Scheduler key is required" },
      { status: 401 }
    );

  const apps = await Services.ConnectedAppService().getAppsByScopeWithData(
    "scheduled"
  );
  const promises = apps.map((app) => {
    const service = AvailableAppServices[app.name](
      Services.ConnectedAppService().getAppServiceProps(app._id)
    ) as any as IScheduled;

    return service.onTime(app, date.toJSDate());
  });

  Promise.all(promises);

  return NextResponse.json(okStatus);
}
