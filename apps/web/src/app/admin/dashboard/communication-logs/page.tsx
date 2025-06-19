import { ClearAllCommunicationLogsButton } from "@/components/admin/communication-logs/table/clear-all";
import { CommunicationLogsTableColumnsCount } from "@/components/admin/communication-logs/table/columns";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/communication-logs/table/search-params";
import { CommunicationLogsTable } from "@/components/admin/communication-logs/table/table";
import { CommunicationLogsTableAction } from "@/components/admin/communication-logs/table/table-action";
import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, DataTableSkeleton, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { Suspense } from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Communications", link: "/admin/dashboard/communication-logs" },
];

export default async function CommunicationLogsPage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("communication-logs");

  logger.debug("Loading communication-logs page");
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-2 justify-between">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center justify-between">
              <Heading
                title="Communications"
                description="Monitor all sent and received messages"
              />

              {/* <ClearAllCommunicationLogsButton /> */}
            </div>
          </div>
          {/* <Separator /> */}
        </div>
        <CommunicationLogsTableAction
          allowClearAll
          showCustomerFilter
          showParticipantTypeFilter
        />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton
              columnCount={CommunicationLogsTableColumnsCount}
              rowCount={10}
            />
          }
        >
          <CommunicationLogsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
