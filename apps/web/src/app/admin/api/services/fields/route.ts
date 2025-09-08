import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-cache";
export const revalidate = 3;

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/services-fields")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing services fields API request",
  );

  const fields = await ServicesContainer.ServicesService().getFields({});

  logger.debug(
    {
      total: fields.total,
      count: fields.items.length,
    },
    "Successfully retrieved service fields",
  );

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=3");

  return NextResponse.json(fields.items, { headers });
}
