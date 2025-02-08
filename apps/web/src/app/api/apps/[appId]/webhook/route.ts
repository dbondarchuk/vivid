import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

const processWebhook = async (appId: string, request: NextRequest) => {
  if (!appId) {
    return NextResponse.json({ error: "AppId is required" }, { status: 400 });
  }

  const service = ServicesContainer.ConnectedAppService();

  const result = await service.processWebhook(appId, request);

  return NextResponse.json(result);
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = (await params).appId;
  return await processWebhook(appId, request);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = (await params).appId;
  return await processWebhook(appId, request);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = (await params).appId;
  return await processWebhook(appId, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = (await params).appId;
  return await processWebhook(appId, request);
}
