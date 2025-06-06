import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const name = (await params).name;
  const service = ServicesContainer.ConnectedAppService();

  await service.processRedirect(name, request);

  return new NextResponse(`<html><script>window.close()</script></html>`, {
    status: 201,
    headers: { "content-type": "text/html" },
  });
}
