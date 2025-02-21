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
  const { booking, general, social } =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  const apps = await ServicesContainer.ConnectedAppService().getApps();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Appointment Settings"
            description="Adjust appointment settings"
          />
          <Separator />
        </div>
        <AppointmentsSettingsForm
          values={booking}
          generalSettings={general}
          socialSettings={social}
          apps={apps}
        />
      </div>
    </PageContainer>
  );
}
