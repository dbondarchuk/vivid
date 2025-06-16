import { ServicesContainer } from "@vivid/services";
import { AppScope } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const scope = params.get("scope") as AppScope;

  const result =
    await ServicesContainer.ConnectedAppsService().getAppsByScope(scope);

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(result, { headers });
}
