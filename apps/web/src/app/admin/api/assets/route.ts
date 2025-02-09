import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mimeType = searchParams.get("mimeType");
  const search = searchParams.get("search");

  const response = await ServicesContainer.AssetsService().getAssets({
    search: search || undefined,
    mimeType: mimeType || undefined,
  });

  return NextResponse.json(response.items);
}
