import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/templates-arguments-demo")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing templates arguments demo API request"
  );

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (!type) {
    logger.warn("Missing required type parameter");
    return NextResponse.json(
      { error: "Type parameter is required" },
      { status: 400 }
    );
  }

  logger.debug({ type }, "Fetching demo template arguments");

  const config =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  const demoArguments = {
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
    },
    appointment: {
      id: "demo-appointment-id",
      dateTime: new Date().toISOString(),
      service: "Demo Service",
      duration: 60,
    },
    config: {
      general: {
        name: "Demo Business",
        email: "info@demo.com",
      },
    },
  };

  logger.debug(
    {
      type,
      hasDemoData: !!demoArguments,
    },
    "Successfully retrieved demo template arguments"
  );

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(demoArguments, { headers });
}
