import { searchParams } from "@/components/admin/communication-logs/table/search-params";
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
  const customerId = params.customer ?? undefined;
  const appointmentId = params.appointment ?? undefined;
  const direction = params.direction;
  const channel = params.channel;
  const start = params.start ?? undefined;
  const end = params.end ?? undefined;
  const participantType = params.participantType ?? undefined;

  const offset = (page - 1) * limit;

  const res =
    await ServicesContainer.CommunicationLogService().getCommunicationLogs({
      offset,
      limit,
      search,
      sort,
      customerId,
      appointmentId,
      direction,
      channel,
      participantType,
      range:
        start || end
          ? {
              start,
              end,
            }
          : undefined,
    });

  return NextResponse.json(res);
}
