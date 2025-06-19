import { searchParams } from "@/components/admin/appointments/table/search-params";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/appointments")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing appointments API request"
  );

  const loader = createLoader(searchParams);
  const params = loader(request.nextUrl.searchParams);

  const page = params.page;
  const search = params.search ?? undefined;
  const limit = params.limit;
  const sort = params.sort;
  const status = params.status ?? undefined;
  const start = params.start ?? undefined;
  const end = params.end ?? undefined;

  const offset = (page - 1) * limit;

  logger.debug(
    {
      page,
      search,
      limit,
      sort,
      status,
      start,
      end,
      offset,
    },
    "Fetching appointments with parameters"
  );

  const res = await ServicesContainer.EventsService().getAppointments({
    offset,
    limit,
    search,
    sort,
    status,
    range: start || end ? { start, end } : undefined,
  });

  logger.debug(
    {
      total: res.total,
      count: res.items.length,
    },
    "Successfully retrieved appointments"
  );

  return NextResponse.json(res);
}
