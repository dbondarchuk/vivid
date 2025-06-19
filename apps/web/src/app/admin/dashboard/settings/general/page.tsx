import PageContainer from "@/components/admin/layout/page-container";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { GeneralSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "General", link: "/admin/dashboard/settings/general" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("general");

  logger.debug("Loading general page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="General Settings"
            description="Adjust general settings"
          />
          {/* <Separator /> */}
        </div>
        <GeneralSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
