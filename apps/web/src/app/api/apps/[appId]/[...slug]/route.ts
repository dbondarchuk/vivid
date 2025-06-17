import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

const processAppCall = async (
  request: NextRequest,
  { params }: { params: Promise<{ appId: string; slug: string[] }> }
) => {
  const { appId, slug } = await params;

  if (!appId) {
    return NextResponse.json({ error: "AppId is required" }, { status: 400 });
  }

  const service = ServicesContainer.ConnectedAppsService();

  const result = await service.processAppCall(appId, slug, request);

  return (
    result ?? NextResponse.json({ error: "unknown_handler" }, { status: 404 })
  );
};

export const GET = processAppCall;
export const POST = processAppCall;
export const PUT = processAppCall;
export const DELETE = processAppCall;
