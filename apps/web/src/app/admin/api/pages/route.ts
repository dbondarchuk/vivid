import { searchParams } from "@/components/admin/pages/table/search-params";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { PageListModelWithUrl } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/pages")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing pages API request",
  );

  const loader = createLoader(searchParams);
  const params = loader(request.nextUrl.searchParams);

  const page = params.page;
  const search = params.search || undefined;
  const limit = params.limit;
  const sort = params.sort;
  const publishStatus = params.published;
  const tags = params.tags || undefined;

  const offset = (page - 1) * limit;

  logger.debug(
    {
      page,
      search,
      limit,
      sort,
      offset,
    },
    "Fetching pages with parameters",
  );

  const response = await ServicesContainer.PagesService().getPages({
    search,
    limit,
    sort,
    offset,
    publishStatus,
    tags,
  });

  logger.debug(
    {
      total: response.total,
      count: response.items.length,
    },
    "Successfully retrieved pages",
  );

  const items = response.items.map(
    (page) =>
      ({
        ...page,
        slug: page.slug === "home" ? "" : page.slug,
        url: `${request.nextUrl.origin}/${page.slug === "home" ? "" : page.slug}`,
      }) satisfies PageListModelWithUrl,
  );

  return NextResponse.json({ ...response, items });
}
