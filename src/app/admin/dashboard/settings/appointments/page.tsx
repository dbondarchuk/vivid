import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { AppointmentsSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/settings/appointments" },
];

export default async function Page() {
  const { booking, general, social } =
    await Services.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
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
        />
      </div>
    </PageContainer>
  );
}
