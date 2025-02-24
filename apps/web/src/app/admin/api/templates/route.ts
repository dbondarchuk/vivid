import { ServicesContainer } from "@vivid/services";
import { CommunicationChannel } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type") as CommunicationChannel;
  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  const result = await ServicesContainer.TemplatesService().getTemplates({
    type: [type],
  });

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(result.items, { headers });
}
