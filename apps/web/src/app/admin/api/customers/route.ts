import { searchParams } from "@/components/admin/customers/table/search-params";
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

  const res = await ServicesContainer.CustomersService().getCustomers({
    offset,
    limit,
    search,
    sort,
    priorityIds,
  });

  return NextResponse.json(res);
}
