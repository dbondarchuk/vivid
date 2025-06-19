import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { DefaultAppsConfigurationForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Apps", link: "/admin/dashboard/apps" },
  { title: "Default apps", link: "/admin/dashboard/apps/default" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("default");

  logger.debug("Loading default page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration(
      "defaultApps"
    );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Default apps" description="Select default apps" />
          {/* <Separator /> */}
        </div>
        <DefaultAppsConfigurationForm values={settings} />
      </div>
    </PageContainer>
  );
}
