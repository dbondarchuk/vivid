import PageContainer from "@/components/admin/layout/page-container";
import { AddNewTemplateButton } from "@/components/admin/templates/add-new-template-button";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/templates/table/search-params";
import { TemplatesTable } from "@/components/admin/templates/table/table";
import { TemplatesTableAction } from "@/components/admin/templates/table/table-action";
import { Breadcrumbs, DataTableSkeleton, Heading, Separator } from "@vivid/ui";
import { Suspense } from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EmailTemplatesPage(props: Params) {
  const searchParams = await props.searchParams;

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Communications", link: "/admin/dashboard/communication-logs" },
    { title: "Templates", link: "/admin/dashboard/templates" },
  ];

  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title={`Communication templates`} />

            <AddNewTemplateButton />
          </div>
          {/* <Separator /> */}
        </div>
        <TemplatesTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <TemplatesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
