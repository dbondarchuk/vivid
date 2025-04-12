import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-cache";
export const revalidate = 3;

export async function GET(request: NextRequest) {
  const result = await ServicesContainer.ServicesService().getOptions({});

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=3");

  return NextResponse.json(result.items, { headers });
}
