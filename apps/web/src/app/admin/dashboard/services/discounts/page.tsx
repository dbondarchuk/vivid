import PageContainer from "@/components/admin/layout/page-container";
import { DiscountsTableColumnsCount } from "@/components/admin/services/discounts/table/columns";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/services/discounts/table/search-params";
import { DiscountsTable } from "@/components/admin/services/discounts/table/table";
import { DiscountsTableAction } from "@/components/admin/services/discounts/table/table-action";
import { getI18nAsync } from "@vivid/i18n";
import { getLoggerFactory } from "@vivid/logger";
import {
  Breadcrumbs,
  DataTableSkeleton,
  Heading,
  Link,
  Separator,
} from "@vivid/ui";
import { Plus } from "lucide-react";
import { Suspense } from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DiscountsPage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("discounts");
  const t = await getI18nAsync("admin");

  logger.debug("Loading discounts page");
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    {
      title: t("navigation.discounts"),
      link: "/admin/dashboard/services/discounts",
    },
  ];

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading
              title={t("services.discounts.title")}
              description={t("services.discounts.description")}
            />

            <Link
              button
              href={"/admin/dashboard/services/discounts/new"}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" /> {t("services.discounts.addNew")}
            </Link>
          </div>
          {/* <Separator /> */}
        </div>
        <DiscountsTableAction />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton
              columnCount={DiscountsTableColumnsCount}
              rowCount={10}
            />
          }
        >
          <DiscountsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
