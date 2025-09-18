import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-cache";
export const revalidate = 3;

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/services-addons")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing services addons API request",
  );

  const addons = await ServicesContainer.ServicesService().getAddons({});

  logger.debug(
    {
      total: addons.total,
      count: addons.items.length,
    },
    "Successfully retrieved service addons",
  );

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=3");

  return NextResponse.json(addons.items, { headers });
}
