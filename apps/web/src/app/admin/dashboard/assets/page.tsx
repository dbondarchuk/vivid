import {
  searchParamsCache,
  serialize,
} from "@/components/admin/assets/table/search-params";
import { AssetsTable } from "@/components/admin/assets/table/table";
import { AssetsTableAction } from "@/components/admin/assets/table/table-action";
import PageContainer from "@/components/admin/layout/page-container";
import {
  Breadcrumbs,
  DataTableSkeleton,
  Heading,
  Link,
  Separator,
} from "@vivid/ui";
import { Upload } from "lucide-react";
import { Suspense } from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Assets", link: "/admin/dashboard/assets" },
];

export default async function AssetsPage(props: Params) {
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title="Assets" />

            <Link button href={"/admin/dashboard/assets/new"} variant="default">
              <Upload className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          <Separator />
        </div>
        <AssetsTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={8} rowCount={10} />}
        >
          <AssetsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
