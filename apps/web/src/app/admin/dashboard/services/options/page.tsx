import PageContainer from "@/components/admin/layout/page-container";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/services/options/table/search-params";
import { OptionsTable } from "@/components/admin/services/options/table/table";
import { OptionsTableAction } from "@/components/admin/services/options/table/table-action";
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
  { title: "Options", link: "/admin/dashboard/services/options" },
];

export default async function OptionsPage(props: Params) {
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading
              title="Options"
              description="Manage options that you provide"
            />

            <Link
              button
              href={"/admin/dashboard/services/options/new"}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          <Separator />
        </div>
        <OptionsTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <OptionsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
