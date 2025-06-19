import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppScope } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/apps")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing apps API request"
  );

  const params = request.nextUrl.searchParams;
  const scope = params.get("scope") as AppScope;

  logger.debug({ scope }, "Fetching apps by scope");

  const result =
    await ServicesContainer.ConnectedAppsService().getAppsByScope(scope);

  logger.debug(
    {
      scope,
      appCount: result.length,
    },
    "Successfully retrieved apps by scope"
  );

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(result, { headers });
}
