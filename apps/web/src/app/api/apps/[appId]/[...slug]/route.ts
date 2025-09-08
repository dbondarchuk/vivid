import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

const processAppCall = async (
  request: NextRequest,
  { params }: { params: Promise<{ appId: string; slug: string[] }> },
) => {
  const logger = getLoggerFactory("API/apps-call")("processAppCall");
  const { appId, slug } = await params;

  logger.debug(
    {
      url: request.url,
      method: request.method,
      appId,
      slug: slug?.join("/"),
    },
    "Processing app call request",
  );

  if (!appId) {
    logger.warn("Missing required appId parameter");
    return NextResponse.json({ error: "AppId is required" }, { status: 400 });
  }

  const service = ServicesContainer.ConnectedAppsService();

  try {
    const result = await service.processAppCall(appId, slug, request);

    if (result) {
      logger.debug(
        {
          appId,
          slug: slug.join("/"),
          status: result.status,
        },
        "Successfully processed app call",
      );
    } else {
      logger.warn({ appId, slug: slug.join("/") }, "No app call handler found");
    }

    return (
      result ?? NextResponse.json({ error: "unknown_handler" }, { status: 404 })
    );
  } catch (error: any) {
    logger.error(
      {
        appId,
        slug: slug.join("/"),
        error: error?.message || error?.toString(),
      },
      "Error processing app call",
    );
    throw error;
  }
};

export const GET = processAppCall;
export const POST = processAppCall;
export const PUT = processAppCall;
export const DELETE = processAppCall;
