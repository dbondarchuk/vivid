import { searchParams } from "@/components/admin/communication-logs/table/search-params";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/communication-logs")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing communication logs API request",
  );

  const loader = createLoader(searchParams);
  const params = loader(request.nextUrl.searchParams);

  const page = params.page;
  const search = params.search ?? undefined;
  const limit = params.limit;
  const sort = params.sort;
  const customerId = params.customer ?? undefined;
  const appointmentId = params.appointment ?? undefined;
  const direction = params.direction;
  const channel = params.channel;
  const start = params.start ?? undefined;
  const end = params.end ?? undefined;
  const participantType = params.participantType ?? undefined;

  const offset = (page - 1) * limit;

  logger.debug(
    {
      page,
      limit,
      offset,
    },
    "Fetching communication logs with parameters",
  );

  const res =
    await ServicesContainer.CommunicationLogsService().getCommunicationLogs({
      offset,
      limit,
      search,
      sort,
      customerId,
      appointmentId,
      direction,
      channel,
      participantType,
      range:
        start || end
          ? {
              start,
              end,
            }
          : undefined,
    });

  logger.debug(
    {
      total: res.total,
      count: res.items.length,
    },
    "Successfully retrieved communication logs",
  );

  return NextResponse.json(res);
}
