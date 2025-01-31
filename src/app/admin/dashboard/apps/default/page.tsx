import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { DefaultAppsConfigurationForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Apps", link: "/admin/dashboard/apps" },
  { title: "Default apps", link: "/admin/dashboard/apps/default" },
];

export default async function Page() {
  const settings = await Services.ConfigurationService().getConfiguration(
    "defaultApps"
  );

  const apps = await Services.ConnectedAppService().getApps();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Default apps" description="Select default apps" />
          <Separator />
        </div>
        <DefaultAppsConfigurationForm values={settings} apps={apps} />
      </div>
    </PageContainer>
  );
}
