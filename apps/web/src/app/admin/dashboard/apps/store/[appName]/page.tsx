import { AppDetails } from "@/components/admin/apps/store/app-details";
import PageContainer from "@/components/admin/layout/page-container";
import { AvailableApps } from "@vivid/app-store";
import { Breadcrumbs } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";

type Params = {
  params: Promise<{ appName: string }>;
};

export default async function AppsStorePage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("app-store-details");
  const { appName } = await props.params;

  logger.debug(
    {
      appName,
    },
    "Loading app store details page"
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Apps", link: "/admin/dashboard/apps" },
    { title: "Apps Store", link: "/admin/dashboard/apps/store" },
    {
      title: AvailableApps[appName].displayName,
      link: `/admin/dashboard/apps/store/${appName}`,
    },
  ];

  logger.debug(
    {
      appName,
      appDisplayName: AvailableApps[appName].displayName,
    },
    "App store details page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <Breadcrumbs items={breadcrumbItems} />
      <AppDetails appName={appName} />
    </PageContainer>
  );
}
