import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

const processWebhook = async (
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) => {
  const appId = (await params).appId;

  if (!appId) {
    return NextResponse.json({ error: "AppId is required" }, { status: 400 });
  }

  const service = ServicesContainer.ConnectedAppsService();

  const result = await service.processWebhook(appId, request);

  return (
    result ?? NextResponse.json({ error: "unknown_handler" }, { status: 404 })
  );
};

export const GET = processWebhook;
export const POST = processWebhook;
export const PUT = processWebhook;
export const DELETE = processWebhook;
