import { CommunicationLogsTableColumnsCount } from "@/components/admin/communication-logs/table/columns";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/communication-logs/table/search-params";
import { CommunicationLogsTable } from "@/components/admin/communication-logs/table/table";
import { CommunicationLogsTableAction } from "@/components/admin/communication-logs/table/table-action";
import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { Breadcrumbs, DataTableSkeleton, Heading } from "@vivid/ui";
import { Metadata } from "next";
import { Suspense } from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("navigation.communicationLogs"),
  };
}

export default async function CommunicationLogsPage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("communication-logs");
  const t = await getI18nAsync("admin");

  logger.debug("Loading communication-logs page");
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    {
      title: t("navigation.communicationLogs"),
      link: "/admin/dashboard/communication-logs",
    },
  ];

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-2 justify-between">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center justify-between">
              <Heading
                title={t("navigation.communicationLogs")}
                description={t("navigation.monitorMessages")}
              />
            </div>
          </div>
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
