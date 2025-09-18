import { AppDetails } from "@/components/admin/apps/store/app-details";
import PageContainer from "@/components/admin/layout/page-container";
import { AvailableApps } from "@vivid/app-store";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { Breadcrumbs } from "@vivid/ui";
import { Metadata } from "next/types";

type Params = {
  params: Promise<{ appName: string }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const t = await getI18nAsync("apps");
  const { appName } = await props.params;
  const app = AvailableApps[appName];
  return {
    title: t(app.displayName),
    description: t(app.description.text),
  };
}

export default async function AppsStorePage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("app-store-details");
  const t = await getI18nAsync("admin");
  const tApps = await getI18nAsync("apps");
  const { appName } = await props.params;

  logger.debug(
    {
      appName,
    },
    "Loading app store details page",
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.apps"), link: "/admin/dashboard/apps" },
    { title: t("apps.appStore"), link: "/admin/dashboard/apps/store" },
    {
      title: tApps(AvailableApps[appName].displayName),
      link: `/admin/dashboard/apps/store/${appName}`,
    },
  ];

  logger.debug(
    {
      appName,
      appDisplayName: AvailableApps[appName].displayName,
    },
    "App store details page loaded",
  );

  console.log(breadcrumbItems);
  console.log(appName);

  return (
    <PageContainer scrollable>
      <Breadcrumbs items={breadcrumbItems} />
      <AppDetails appName={appName} />
    </PageContainer>
  );
}
