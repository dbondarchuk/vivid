import { getOptions } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const response = await getOptions();

  return NextResponse.json(response);
}
