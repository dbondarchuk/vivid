import { ClearAllCommunicationLogsButton } from "@/components/admin/communicationLogs/clearAllButton";
import { columns } from "@/components/admin/communicationLogs/table/communicationLogs.columns";
import { CommunicationLogsTable } from "@/components/admin/communicationLogs/table/communicationLogs.table";
import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import {
  CommunicationChannel,
  communicationChannels,
  CommunicationDirection,
} from "@/types";
import { Query } from "@/types/database/query";
import { DateTime } from "luxon";

type Params = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Communication Logs", link: "/admin/dashboard/communication-logs" },
];

export default async function CommunicationLogsPage({ searchParams }: Params) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const start = searchParams.start
    ? DateTime.fromISO(searchParams.start as string).toJSDate()
    : undefined;
  const end = searchParams.end
    ? DateTime.fromISO(searchParams.end as string).toJSDate()
    : undefined;

  const directions: CommunicationDirection[] | undefined =
    searchParams.direction
      ? Array.isArray(searchParams.direction)
        ? (searchParams.direction as CommunicationDirection[])
        : [searchParams.direction as CommunicationDirection]
      : ["inbound", "outbound"];

  const channels: CommunicationChannel[] | undefined = searchParams.channel
    ? Array.isArray(searchParams.channel)
      ? (searchParams.channel as CommunicationChannel[])
      : [searchParams.channel as CommunicationChannel]
    : (communicationChannels as unknown as CommunicationChannel[]);

  const search = searchParams.search as string;
  const offset = (page - 1) * limit;

  const range = {
    start,
    end,
  };

  const sort: Query["sort"] = [{ key: "dateTime", desc: true }];

  const res = await Services.CommunicationLogService().getCommunicationLogs({
    range: { start, end },
    direction: directions,
    channel: channels,
    offset,
    limit,
    search: search as string,
    sort,
  });

  const total = res.total;
  const pageCount = Math.ceil(total / limit);
  const logs = res.items;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <div className="flex flex-col gap-2 justify-between">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-start justify-between">
              <Heading
                title="Communication Logs"
                description="Monitor all sent and received messages"
              />

              <ClearAllCommunicationLogsButton />
            </div>
          </div>
          <Separator />
        </div>
        <CommunicationLogsTable
          columns={columns}
          data={logs}
          limit={limit}
          page={page}
          total={total}
          dateRange={range}
          directions={directions}
          channels={channels}
          search={search}
        />
      </div>
    </PageContainer>
  );
}
