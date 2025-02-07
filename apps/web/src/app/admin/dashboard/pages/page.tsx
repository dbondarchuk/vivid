import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/pageContainer";
import { columns } from "@/components/admin/pages/table/pages.columns";
import { PagesTable } from "@/components/admin/pages/table/pages.table";
import { ServicesContainer } from "@vivid/services";
import { Sort } from "@vivid/types";
import { Heading, Link, Separator } from "@vivid/ui";
import { getSort } from "@vivid/utils";
import { Plus } from "lucide-react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pages", link: "/admin/dashboard/pages" },
];

export default async function PagesPage(props: Params) {
  const searchParams = await props.searchParams;
  const page = (Number(searchParams.page) || 1) - 1;
  const limit = Number(searchParams.limit) || 10;

  const statuses: boolean[] | undefined = searchParams.published
    ? (Array.isArray(searchParams.published)
        ? (searchParams.published as string[])
        : [searchParams.published as string]
      ).map((x) => x === "true")
    : [true, false];

  const search = searchParams.search as string;
  const offset = page * limit;

  const sort: Sort = getSort(searchParams) || [
    { key: "updatedAt", desc: true },
  ];

  const res = await ServicesContainer.PagesService().getPages({
    offset,
    limit,
    search: search as string,
    sort,
    publishStatus: statuses,
  });

  const total = res.total;
  const pages = res.items;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title="Pages" description="Manage pages" />

            <Link button href={"/admin/dashboard/pages/new"} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <PagesTable
          columns={columns}
          data={pages}
          limit={limit}
          page={page}
          total={total}
          search={search}
          sort={sort}
          published={statuses}
        />
      </div>
    </PageContainer>
  );
}
