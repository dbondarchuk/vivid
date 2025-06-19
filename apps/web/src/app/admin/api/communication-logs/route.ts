import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/communication-logs")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing communication logs API request"
  );

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  logger.debug(
    {
      page,
      limit,
      offset,
    },
    "Fetching communication logs with parameters"
  );

  const logs =
    await ServicesContainer.CommunicationLogsService().getCommunicationLogs({
      offset,
      limit,
    });

  logger.debug(
    {
      total: logs.total,
      count: logs.items.length,
    },
    "Successfully retrieved communication logs"
  );

  return NextResponse.json(logs);
}
