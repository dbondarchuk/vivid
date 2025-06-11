import { searchParams } from "@/components/admin/services/discounts/table/search-params";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

export async function GET(request: NextRequest) {
  const loader = createLoader(searchParams);
  const params = loader(request.nextUrl.searchParams);

  const page = params.page;
  const search = params.search ?? undefined;
  const limit = params.limit;
  const sort = params.sort;

  const offset = (page - 1) * limit;
  const priorityIds = params.priorityId ?? undefined;
  const enabled = params.enabled ?? undefined;
  const start = params.start ?? undefined;
  const end = params.end ?? undefined;
  const type = params.type;

  const res = await ServicesContainer.ServicesService().getDiscounts({
    offset,
    limit,
    search,
    sort,
    priorityIds,
    enabled,
    range: {
      start,
      end,
    },
    type,
  });

  return NextResponse.json(res);
}
