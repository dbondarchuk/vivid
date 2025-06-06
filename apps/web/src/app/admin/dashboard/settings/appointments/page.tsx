import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { AppointmentsSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/settings/appointments" },
];

export default async function Page() {
  const booking =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Appointment Settings"
            description="Adjust appointment settings"
          />
          {/* <Separator /> */}
        </div>
        <AppointmentsSettingsForm values={booking} />
      </div>
    </PageContainer>
  );
}
