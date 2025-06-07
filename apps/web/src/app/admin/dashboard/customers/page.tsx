import { CustomersTable } from "@/components/admin/customers/table/table";
import { CustomersTableAction } from "@/components/admin/customers/table/table-action";
import PageContainer from "@/components/admin/layout/page-container";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/customers/table/search-params";
import {
  Breadcrumbs,
  DataTableSkeleton,
  Heading,
  Link,
  Separator,
} from "@vivid/ui";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { CustomersTableColumnLength } from "@/components/admin/customers/table/columns";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Customers", link: "/admin/dashboard/customers" },
];

export default async function CustomersPage(props: Params) {
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading title="Customer" description="Manage your customers" />

            <Link
              button
              href={"/admin/dashboard/customers/new"}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          {/* <Separator /> */}
        </div>
        <CustomersTableAction />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton
              columnCount={CustomersTableColumnLength}
              rowCount={10}
            />
          }
        >
          <CustomersTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
