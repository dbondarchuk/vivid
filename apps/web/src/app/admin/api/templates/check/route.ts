import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const name = params.get("name");
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const id = params.get("id");
  const result = await ServicesContainer.TemplatesService().checkUniqueName(
    name,
    id || undefined
  );

  return NextResponse.json(result, {
    headers: new Headers({
      "Cache-Control": "max-age=10",
    }),
  });
}
