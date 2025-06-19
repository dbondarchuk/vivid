import PageContainer from "@/components/admin/layout/page-container";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/services/fields/table/search-params";
import { FieldsTable } from "@/components/admin/services/fields/table/table";
import { FieldsTableAction } from "@/components/admin/services/fields/table/table-action";
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

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Services", link: "/admin/dashboard/services" },
  { title: "Fields", link: "/admin/dashboard/services/fields" },
];

export default async function FieldsPage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("fields");

  logger.debug("Loading fields page");
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading
              title="Option fields"
              description="Manage option custom fields"
            />

            <Link
              button
              href={"/admin/dashboard/services/fields/new"}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
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
