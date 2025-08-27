import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const logger = getLoggerFactory("AdminAPI/templates-by-id")("GET");
  const { id } = await params;

  logger.debug(
    {
      url: request.url,
      method: request.method,
      templateId: id,
    },
    "Processing template by ID API request",
  );

  const template = await ServicesContainer.TemplatesService().getTemplate(id);

  if (!template) {
    logger.warn({ templateId: id }, "Template not found");
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  logger.debug(
    {
      templateId: id,
      templateName: template.name,
      templateType: template.type,
    },
    "Successfully retrieved template",
  );

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(template, { headers });
}
