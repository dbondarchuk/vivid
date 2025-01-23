import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { CommunicationsConfigurationForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "SMTP", link: "/admin/dashboard/settings/smtp" },
];

export default async function Page() {
  const settings = await Services.ConfigurationService().getConfiguration(
    "communications"
  );

  const apps = await Services.ConnectedAppService().getApps();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="SMTP Settings"
            description="Adjust settings for sending emails"
          />
          <Separator />
        </div>
        <CommunicationsConfigurationForm values={settings} apps={apps} />
      </div>
    </PageContainer>
  );
}
