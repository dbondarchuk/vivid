import { columns } from "@/components/admin/appointments/table/appointments.columns";
import { AppointmentsTable } from "@/components/admin/appointments/table/appointments.table";
import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/pageContainer";
import { ServicesContainer } from "@vivid/services";
import { AppointmentStatus, appointmentStatuses, Sort } from "@vivid/types";
import { Heading, Link, Separator } from "@vivid/ui";
import { getSort } from "@vivid/utils";
import { CalendarClock } from "lucide-react";
import { DateTime } from "luxon";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/appointments" },
];

export default async function AppointmentsPage(props: Params) {
  const searchParams = await props.searchParams;
  const page = (Number(searchParams.page) || 1) - 1;
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
  const offset = page * limit;

  const range = {
    start,
    end,
  };

  const sort: Sort = getSort(searchParams) || [{ key: "dateTime", desc: true }];

  const res = await ServicesContainer.EventsService().getAppointments({
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
          <div className="flex flex-col gap-2 justify-between">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-start justify-between">
              <Heading title="Appointments" description="Manage appoinments" />

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
          sort={sort}
        />
      </div>
    </PageContainer>
  );
}
