import PageContainer from "@/components/admin/layout/page-container";
import { PagesTableColumnsCount } from "@/components/admin/pages/table/columns";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/pages/table/search-params";
import { PagesTable } from "@/components/admin/pages/table/table";
import { PagesTableAction } from "@/components/admin/pages/table/table-action";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { Breadcrumbs, DataTableSkeleton, Heading, Link } from "@vivid/ui";
import { Plus } from "lucide-react";
import { Suspense } from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PagesPage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("pages");
  const t = await getI18nAsync("admin");

  logger.debug("Loading pages page");
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    { title: t("pages.title"), link: "/admin/dashboard/pages" },
  ];

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading
              title={t("pages.title")}
              description={t("pages.managePages")}
            />

            <Link button href={"/admin/dashboard/pages/new"} variant="default">
              <Plus className="mr-2 h-4 w-4" /> {t("pages.addNew")}
            </Link>
          </div>
        </div>
        <PagesTableAction />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton
              columnCount={PagesTableColumnsCount}
              rowCount={10}
            />
          }
        >
          <PagesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
