import { columns } from "@/components/admin/assets/table/assets.columns";
import { AssetsTable } from "@/components/admin/assets/table/assets.table";
import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { Query } from "@/types/database/query";
import { Plus } from "lucide-react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Assets", link: "/admin/dashboard/assets" },
];

export default async function AssetsPage(props: Params) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  const search = searchParams.search as string;
  const offset = (page - 1) * limit;

  const sort: Query["sort"] = [{ key: "dateTime", desc: true }];

  const res = await Services.AssetsService().getAssets({
    offset,
    limit,
    search: search as string,
    sort,
  });

  const total = res.total;
  const assets = res.items;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title="Assets" description="Manage assets" />

            <Link button href={"/admin/dashboard/assets/new"} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <AssetsTable
          columns={columns}
          data={assets}
          limit={limit}
          page={page}
          total={total}
          search={search}
        />
      </div>
    </PageContainer>
  );
}
