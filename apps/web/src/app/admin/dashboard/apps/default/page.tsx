import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { DefaultAppsConfigurationForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Apps", link: "/admin/dashboard/apps" },
  { title: "Default apps", link: "/admin/dashboard/apps/default" },
];

export default async function Page() {
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration(
      "defaultApps"
    );

  const apps = await ServicesContainer.ConnectedAppService().getApps();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Default apps" description="Select default apps" />
          <Separator />
        </div>
        <DefaultAppsConfigurationForm values={settings} apps={apps} />
      </div>
    </PageContainer>
  );
}
