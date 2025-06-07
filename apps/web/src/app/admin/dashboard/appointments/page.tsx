import { AppointmentsTable } from "@/components/admin/appointments/table/table";
import {
  searchParamsCache,
  serialize,
} from "@/components/admin/appointments/table/search-params";
import { AppointmentsTableAction } from "@/components/admin/appointments/table/table-action";
import PageContainer from "@/components/admin/layout/page-container";
import {
  Breadcrumbs,
  DataTableSkeleton,
  Heading,
  Link,
  Separator,
} from "@vivid/ui";
import { CalendarClock } from "lucide-react";
import { Suspense } from "react";
import { AppointmentsTableColumnsCount } from "@/components/admin/appointments/table/columns";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/appointments" },
];

export default async function AppointmentsPage(props: Params) {
  const searchParams = await props.searchParams;
  const parsed = searchParamsCache.parse(searchParams);

  const key = serialize({ ...parsed });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-2 justify-between">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center justify-between">
              <Heading title="Appointments" />

              <Link
                button
                href={"/admin/dashboard/appointments/new"}
                variant="default"
              >
                <CalendarClock className="mr-2 h-4 w-4" />{" "}
                <span className="max-md:hidden">Schedule Appointment</span>
                <span className="md:hidden">Add New</span>
              </Link>
            </div>
          </div>
          {/* <Separator /> */}
        </div>
        <AppointmentsTableAction showCustomerFilter />
        <Suspense
          key={key}
          fallback={
            <DataTableSkeleton
              columnCount={AppointmentsTableColumnsCount}
              rowCount={10}
            />
          }
        >
          <AppointmentsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
