import PageContainer from "@/components/admin/layout/page-container";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/pages/table/search-params";
import { PagesTable } from "@/components/admin/pages/table/table";
import { PagesTableAction } from "@/components/admin/pages/table/table-action";
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
  { title: "Pages", link: "/admin/dashboard/pages" },
];

export default async function PagesPage(props: Params) {
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading title="Pages" description="Manage pages" />

            <Link button href={"/admin/dashboard/pages/new"} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          {/* <Separator /> */}
        </div>
        <PagesTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={10} rowCount={10} />}
        >
          <PagesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
