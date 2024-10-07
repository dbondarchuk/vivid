import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { AppointmentChoice } from "@/types";
import React from "react";
import { AppointmentScheduleForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/appointments" },
  { title: "New", link: "/admin/dashboard/appointments/new" },
];

export default async function NewAssetsPage() {
  const config = await Services.ConfigurationService().getConfiguration(
    "booking"
  );
  const choices: AppointmentChoice[] = config.options.map((option) => ({
    ...option,
    fields:
      option.fields
        ?.map((f) => config.fields?.find((x) => x.id === f.id))
        .filter((f) => !!f) || [],
    addons:
      option.addons
        ?.map((f) => config.addons?.find((x) => x.id === f.id))
        .filter((f) => !!f) || [],
  }));

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="New appointments"
            description="Schedule a new appointment on behalf of the customer"
          />
          <Separator />
        </div>
        <AppointmentScheduleForm timeZone={config.timezone} options={choices} />
      </div>
    </PageContainer>
  );
}
