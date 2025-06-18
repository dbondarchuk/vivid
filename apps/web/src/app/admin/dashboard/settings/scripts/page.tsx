import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { ScriptsSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "Scripts", link: "/admin/dashboard/settings/scripts" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("scripts");

  logger.debug("Loading scripts page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("scripts");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Scripts"
            description="Add additional third-party scripts to the website"
          />
          {/* <Separator /> */}
        </div>
        <ScriptsSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
