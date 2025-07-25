import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = getLoggerFactory("AdminAPI/pages/footers/[id]")("GET");

  const { id } = await params;

  logger.debug({ id }, "Getting footer");

  const footer = await ServicesContainer.PagesService().getPageFooter(id);

  if (!footer) {
    logger.warn({ id }, "Footer not found");
    return NextResponse.json({ error: "Footer not found" }, { status: 404 });
  }

  logger.debug({ id, name: footer.name }, "Footer found");

  return NextResponse.json(footer);
}
