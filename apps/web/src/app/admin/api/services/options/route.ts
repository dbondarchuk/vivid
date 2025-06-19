import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-cache";
export const revalidate = 3;

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/services-options")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing services options API request"
  );

  const options = await ServicesContainer.ServicesService().getOptions({});

  logger.debug(
    {
      total: options.total,
      count: options.items.length,
    },
    "Successfully retrieved service options"
  );

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=3");

  return NextResponse.json(options.items, { headers });
}
