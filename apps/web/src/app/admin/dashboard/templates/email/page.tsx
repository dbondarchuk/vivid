import PageContainer from "@/components/admin/layout/page-container";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/templates/table/search-params";
import { TemplatesTable } from "@/components/admin/templates/table/table";
import { TemplatesTableAction } from "@/components/admin/templates/table/table-action";
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

export default async function EmailTemplatesPage(props: Params) {
  const searchParams = await props.searchParams;

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Templates", link: "/admin/dashboard/templates" },
    {
      title: `Email Templates`,
      link: `/admin/dashboard/templates/email`,
    },
  ];

  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title={`Email Templates`} />

            <Link
              button
              href={`/admin/dashboard/templates/email/new`}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          <Separator />
        </div>
        <TemplatesTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <TemplatesTable type="email" />
        </Suspense>
      </div>
    </PageContainer>
  );
}
