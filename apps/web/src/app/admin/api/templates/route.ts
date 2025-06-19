import { searchParams } from "@/components/admin/templates/table/search-params";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/templates")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing templates API request"
  );

  const loader = createLoader(searchParams);
  const params = loader(request.nextUrl.searchParams);

  const page = params.page;
  const search = params.search ?? undefined;
  const limit = params.limit;
  const sort = params.sort;
  const type = params.type ?? undefined;

  const offset = (page - 1) * limit;

  logger.debug(
    {
      page,
      search,
      limit,
      sort,
      type,
      offset,
    },
    "Fetching templates with parameters"
  );

  const res = await ServicesContainer.TemplatesService().getTemplates({
    offset,
    limit,
    search,
    sort,
    type,
  });

  logger.debug(
    {
      total: res.total,
      count: res.items.length,
    },
    "Successfully retrieved templates"
  );

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(res.items, { headers });
}
