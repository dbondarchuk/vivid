import { Services } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

const processWebhook = async (appId: string, request: NextRequest) => {
  const service = Services.ConnectedAppService();

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
