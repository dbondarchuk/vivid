import { getI18nAsync } from "@vivid/i18n/server";
import { AppointmentView } from "@/components/admin/appointments/appoitment-view";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { notFound } from "next/navigation";
import React from "react";
import { AppointmentDeclineDialogWrapper } from "./appointment-decline-dialog";

export const AppointmentViewWrapper: React.FC<{
  appointmentId: string;
  shouldShowDeclineModal?: boolean;
}> = async ({ appointmentId, shouldShowDeclineModal }) => {
  const t = await getI18nAsync("admin");
  const appointment =
    await ServicesContainer.EventsService().getAppointment(appointmentId);

  if (!appointment) {
    return notFound();
  }

  const { timeZone } =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    {
      title: t("navigation.appointments"),
      link: "/admin/dashboard/appointments",
    },
    { title: appointment.option.name, link: "/admin/dashboard/appointments" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 justify-between">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading
          title={appointment.option.name}
          description={t("appointments.detail.by", {
            name: appointment.fields.name,
          })}
        />
        {/* <Separator /> */}
      </div>
      <AppointmentView appointment={appointment} timeZone={timeZone} />
      {shouldShowDeclineModal && (
        <AppointmentDeclineDialogWrapper appointment={appointment} />
      )}
    </div>
  );
};
