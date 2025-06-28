import PageContainer from "@/components/admin/layout/page-container";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/services/fields/table/search-params";
import { FieldsTable } from "@/components/admin/services/fields/table/table";
import { FieldsTableAction } from "@/components/admin/services/fields/table/table-action";
import { getI18nAsync } from "@vivid/i18n/server";
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

export default async function FieldsPage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("fields");
  const t = await getI18nAsync("admin");

  logger.debug("Loading fields page");
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    { title: t("navigation.fields"), link: "/admin/dashboard/services/fields" },
  ];

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading
              title={t("services.fields.title")}
              description={t("services.fields.description")}
            />

            <Link
              button
              href={"/admin/dashboard/services/fields/new"}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" /> {t("services.fields.addNew")}
            </Link>
          </div>
          {/* <Separator /> */}
        </div>
        <FieldsTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={8} rowCount={10} />}
        >
          <FieldsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
