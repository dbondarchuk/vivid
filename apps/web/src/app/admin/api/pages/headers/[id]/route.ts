import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = getLoggerFactory("AdminAPI/pages/headers/[id]")("GET");

  const { id } = await params;

  logger.debug({ id }, "Getting header");

  const header = await ServicesContainer.PagesService().getPageHeader(id);

  if (!header) {
    logger.warn({ id }, "Header not found");
    return NextResponse.json({ error: "Header not found" }, { status: 404 });
  }

  logger.debug({ id, name: header.name }, "Header found");

  return NextResponse.json(header);
}
