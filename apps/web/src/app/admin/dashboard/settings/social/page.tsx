import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { SocialSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "Social", link: "/admin/dashboard/settings/social" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("social");

  logger.debug("Loading social page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("social");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Social Settings"
            description="Adjust social links settings"
          />
          {/* <Separator /> */}
        </div>
        <SocialSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
