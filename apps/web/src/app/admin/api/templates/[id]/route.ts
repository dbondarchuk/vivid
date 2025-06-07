import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const template = await ServicesContainer.TemplatesService().getTemplate(id);
  if (!template) {
    return NextResponse.json({ error: "template_not_found" }, { status: 404 });
  }

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(template, { headers });
}
