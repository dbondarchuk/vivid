import { AppointmentView } from "@/components/admin/appointments/appoitment-view";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { notFound } from "next/navigation";
import React from "react";
import { AppointmentDeclineDialog } from "./appointment-decline-dialog";

export const AppointmentViewWrapper: React.FC<{
  appointmentId: string;
  shouldShowDeclineModal?: boolean;
}> = async ({ appointmentId, shouldShowDeclineModal }) => {
  const appointment =
    await ServicesContainer.EventsService().getAppointment(appointmentId);

  if (!appointment) {
    return notFound();
  }

  const { timezone } =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Appointments", link: "/admin/dashboard/appointments" },
    { title: appointment.option.name, link: "/admin/dashboard/appointments" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-col gap-4 justify-between">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading
          title={appointment.option.name}
          description={`By ${appointment.fields.name}`}
        />
        <Separator />
      </div>
      <AppointmentView appointment={appointment} timezone={timezone} />
      {shouldShowDeclineModal && (
        <AppointmentDeclineDialog appointment={appointment} />
      )}
    </div>
  );
};
