import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { SmsSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "SMS", link: "/admin/dashboard/settings/sms" },
];

export default async function Page() {
  const settings = await Services.ConfigurationService().getConfiguration(
    "sms"
  );

  const bookingConfiguration =
    await Services.ConfigurationService().getConfiguration("booking");

  const generalConfiguration =
    await Services.ConfigurationService().getConfiguration("general");

  const socialConfiguration =
    await Services.ConfigurationService().getConfiguration("social");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="SMS Settings"
            description="Adjust settings for sending text messages"
          />
          <Separator />
        </div>
        <SmsSettingsForm
          values={settings}
          bookingConfiguration={bookingConfiguration}
          generalConfiguration={generalConfiguration}
          socialConfiguration={socialConfiguration}
        />
      </div>
    </PageContainer>
  );
}
