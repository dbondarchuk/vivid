import { Services } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mimeType = searchParams.get("mimeType");
  const search = searchParams.get("search");

  const response = await Services.AssetsService().getAssets({
    search: search || undefined,
    mimeType: mimeType || undefined,
  });

  return NextResponse.json(response.items);
}
