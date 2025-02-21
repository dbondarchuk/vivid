import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { notFound } from "next/navigation";
import { AppointmentView } from "../../../../../components/admin/appointments/appoitment-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AppointmentPage(props: Props) {
  const params = await props.params;
  const appointment = await ServicesContainer.EventsService().getAppointment(
    params.id
  );
  if (!appointment) {
    return notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Appointments", link: "/admin/dashboard/appointments" },
    { title: appointment.option.name, link: "/admin/dashboard/appointments" },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={appointment.option.name}
            description={`By ${appointment.fields.name}`}
          />
          <Separator />
        </div>
        <AppointmentView appointment={appointment} />
      </div>
    </PageContainer>
  );
}
