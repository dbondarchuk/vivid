import { AvailableAppServices } from "@vivid/app-store/services";
import { ServicesContainer } from "@vivid/services";
import { IScheduled, okStatus } from "@vivid/types";
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

  const apps =
    await ServicesContainer.ConnectedAppsService().getAppsByScopeWithData(
      "scheduled"
    );
  const promises = apps.map(async (app) => {
    const service = AvailableAppServices[app.name](
      ServicesContainer.ConnectedAppsService().getAppServiceProps(app._id)
    );

    return (service as any as IScheduled).onTime(app, date.toUTC().toJSDate());
  });

  Promise.all(promises);

  return NextResponse.json(okStatus);
}
