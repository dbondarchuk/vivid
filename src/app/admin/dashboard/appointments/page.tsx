import { columns } from "@/components/admin/appointments/table/appointments.columns";
import { AppointmentsTable } from "@/components/admin/appointments/table/appointments.table";
import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { AppointmentStatus, appointmentStatuses } from "@/types";
import { Query } from "@/types/database/query";
import { DateTime } from "luxon";

type Params = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/appointments" },
];

export default async function AppointmentsPage({ searchParams }: Params) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const start = searchParams.start
    ? DateTime.fromISO(searchParams.start as string).toJSDate()
    : undefined;
  const end = searchParams.end
    ? DateTime.fromISO(searchParams.end as string).toJSDate()
    : undefined;

  const statuses: AppointmentStatus[] | undefined = searchParams.status
    ? Array.isArray(searchParams.status)
      ? (searchParams.status as AppointmentStatus[])
      : [searchParams.status as AppointmentStatus]
    : appointmentStatuses.filter((s) => s !== "declined");

  const search = searchParams.search as string;
  const offset = (page - 1) * limit;

  const range = {
    start,
    end,
  };

  const sort: Query["sort"] = [{ key: "dateTime", desc: true }];

  const res = await Services.EventsService().getAppointments({
    range: { start, end },
    status: statuses,
    offset,
    limit,
    search: search as string,
    sort,
  });

  const total = res.total;
  const pageCount = Math.ceil(total / limit);
  const appointments = res.items;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Appointments" description="Manage appoinments" />
          <Separator />
        </div>
        <AppointmentsTable
          columns={columns}
          data={appointments}
          limit={limit}
          page={page}
          total={total}
          dateRange={range}
          statuses={statuses}
          search={search}
        />
      </div>
    </PageContainer>
  );
}