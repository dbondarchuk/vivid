import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { notFound } from "next/navigation";
import { AppointmentView } from "../../../../../components/admin/appointments/appoitment.view";

type Props = {
  params: { id: string };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/appointments" },
];

export default async function AppointmentPage({ params }: Props) {
  const appointment = await Services.EventsService().getAppointment(params.id);
  if (!appointment) {
    return notFound();
  }

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
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