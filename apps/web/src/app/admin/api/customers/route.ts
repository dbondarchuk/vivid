import { searchParams } from "@/components/admin/customers/table/search-params";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/customers")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing customers API request"
  );

  const loader = createLoader(searchParams);
  const params = loader(request.nextUrl.searchParams);

  const page = params.page;
  const search = params.search ?? undefined;
  const limit = params.limit;
  const sort = params.sort;

  const offset = (page - 1) * limit;
  const priorityIds = params.priorityId ?? undefined;

  logger.debug(
    {
      page,
      search,
      limit,
      sort,
      offset,
      priorityIds,
    },
    "Fetching customers with parameters"
  );

  const res = await ServicesContainer.CustomersService().getCustomers({
    offset,
    limit,
    search,
    sort,
    priorityIds,
  });

  logger.debug(
    {
      total: res.total,
      count: res.items.length,
    },
    "Successfully retrieved customers"
  );

  return NextResponse.json(res);
}
